import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { CSVLink, CSVDownload } from 'react-csv';
import './AddedUserDetails.css';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import DashNav from '../DashNav/DashNav';
import logo from '../Img/blank_lingrow.png';

function enumUserType(userType) {
    switch (userType) {
        case 1:
            return "Parent";
        case 2:
            return "Teacher";
        case 3:
            return "Researcher";
        case 4:
            return "Admin";
        default:
            return "Error";
    }
}

export default function AddedUserDetails() {
    const nav = useNavigate();
    const loc = useLocation();

    // State variables.
    const [tab_header, setTabHeader] = useState("LinGrow User Creator");
    const [csvButton, setCsvButton] = useState("Download CSV");
    const [successHeader, setSuccessHeader] = useState("Users Registered");
    const [failedHeader, setFailedHeader] = useState("Users Failed to Register");

    // State variable for CSV file and user list creation.
    const [csvData, setCsvData] = useState([]);
    const [successfulCreation, setSuccessfulCreation] = useState([]);
    const [failedCreation, setFailedCreation] = useState([]);
    const [initialDataSet, setInitialDataSet] = useState(false);

    // Set initial state.
    const setInitialState = (data) => {
        let CSV_header = ["Email", "Name", "User Type", "Password"];
        let user_success = [];
        let user_failed = [];

        // Create a promise to ensure that the state variables are set before the page is rendered.
        var promise = new Promise((resolve, reject) => {
            // If there is "errors" property, that means there are "created_users" and "not_created_users" within "errors".
            if (data.hasOwnProperty("errors")) {
                // Iterate through created users.
                for (let i = 0; i < data.errors.created_users.length; i++) {
                    user_success.push([
                        data.errors.created_users[i].email,
                        `${data.errors.created_users[i].first_name} ${data.errors.created_users[i].middle_name} ${data.errors.created_users[i].last_name}`,
                        enumUserType(data.errors.created_users[i].user_type),
                        data.errors.created_users[i].password
                    ]);
                }

                // Iterated through failed users.
                for (let i = 0; i < data.errors.not_created_users.length; i++) {
                    user_failed.push([
                        data.errors.not_created_users[i].email,
                        `${data.errors.not_created_users[i].first_name} ${data.errors.not_created_users[i].middle_name} ${data.errors.not_created_users[i].last_name}`,
                        Object.values(data.errors.not_created_users[i].error)[0]
                    ]);
                }

                console.log("user_success: ", user_success);
                console.log("user_failed: ", user_failed);

                setSuccessfulCreation(user_success);
                setFailedCreation(user_failed);
            }

            // Otherwise, all users passed and all users are contained within "created_users".
            else {
                for (let i = 0; i < data.created_users.length; i++) {
                    user_success.push([
                        data.created_users[i].email,
                        `${data.created_users[i].first_name} ${data.created_users[i].middle_name} ${data.created_users[i].last_name}`,
                        enumUserType(data.created_users[i].user_type),
                        data.created_users[i].password
                    ]);
                }

                setSuccessfulCreation(user_success);
            }

            setCsvData([CSV_header, ...user_success]);
            resolve();
        });

        // Once the state variables are set, set initialDataSet to true -> force re-render.
        promise.then(() => {
            setInitialDataSet(true);
        });
    }

    const dummydata = {
        "errors": {
            "msg": "Some users were not created successfully!",
            "not_created_users": [
                {
                    "email": "testAdmin1@email.com",
                    "first_name": "TestAdmin",
                    "middle_name": "",
                    "last_name": "One",
                    "user_type": 4,
                    "error": {
                        "email": [
                            "user with this Email already exists."
                        ]
                    }
                }
            ],
            "created_users": [
                {
                    "id": 46,
                    "email": "testAdmin2@email.com",
                    "first_name": "TestAdmin",
                    "last_name": "Two",
                    "user_type": 4,
                    "middle_name": "",
                    "phone": null,
                    "password": "phfhfZTEUG686}+"
                },
                {
                    "id": 47,
                    "email": "testAdmin3@email.com",
                    "first_name": "TestAdmin",
                    "last_name": "Tres",
                    "user_type": 4,
                    "middle_name": "",
                    "phone": null,
                    "password": "fvqfuHDMKN548*#"
                }
            ]
        }
    }

    // Redirect user to login page or dashboard if they're not an admin.
    useEffect(() => {
        if (sessionStorage.getItem('token') === null) {
            alert("You must be logged in to view this page.");
            nav('/login');
        } 
        else if (sessionStorage.getItem('userType') !== "4") {
            alert("You must be an admin to view this page.");
            nav('/dashboard');
        }
        else if (loc.state === null) {
            alert("You must create a user before viewing their details.");
            nav('/usermanager');
        }
        else {
            setInitialState(loc.state.data);
        }
    }, []);

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow User Creator").then(response => setTabHeader(response));
            Translate('en', lang, "Download CSV").then(response => setCsvButton(response));
            Translate('en', lang, "User Registered").then(response => setSuccessHeader(response));
            Translate('en', lang, "Users Failed to Register").then(response => setFailedHeader(response));
        }
    });
    
    useEffect(() => {
        // Prevents page from being constantly translated.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }
    
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });


    return (
        <div className="bg">
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <DashNav/>
                <Card className='bg-light' style={{overflowX: "auto", position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <div>
                        <div>
                            { /* Display all successfully created users */ }
                            {successfulCreation.length > 0 && (
                                <div>
                                    <h3>{successHeader}</h3>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>User type</th>
                                                <th>Password</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {successfulCreation.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row[0]}</td>
                                                    <td>{row[1]}</td>
                                                    <td>{row[2]}</td>
                                                    <td>{row[3]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>        
                            )}
                            { /* Display all users that failed to be created */ }
                            {failedCreation.length > 0 && (
                                <div style={{marginTop: "60px"}}>
                                    <h3>{failedHeader}</h3>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>Errors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {failedCreation.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row[0]}</td>
                                                    <td>{row[1]}</td>
                                                    <td>{row[2]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>

                    <CSVLink data={csvData} filename={"Users_created.csv"}>
                        {<Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}}>{csvButton}</Button>}
                    </CSVLink>
                </Card>
            </Card>
        </div>
    );
}