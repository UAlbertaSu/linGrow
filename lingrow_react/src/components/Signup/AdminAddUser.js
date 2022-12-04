import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { CSVLink, CSVDownload } from 'react-csv';
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import StyledDropzone from './Dropzone';
import Authenticate from '../Authenticate/Authenticate';

// Component to prompt admin users to add users one by one, or mass-create users via xlsx/csv file.
export default function AdminAddUser() {

    // For redirecting user after submission.
    const nav = useNavigate();

    // states for school retrieval.
    const [token] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [no_schools_message, setNoSchoolsFound] = useState("No schools found...");
    const [no_classrooms_message, setNoClassroomsFound] = useState("No classrooms found...");
    const [schools, setSchools] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [schoolID, setSchoolID] = useState();
    const [selected, setSelected] = useState([]);

    // States needed for translation.
    const [tab_header, setTabHeader] = useState("LinGrow User Creator");
    const [translated, setTranslated] = useState(0);
    const [dropbox, setDropbox] = useState();
    const [header, setHeader] = useState();
    const [addUserMsg, setAddUserMsg] = useState();
    const [email, setEmail] = useState();
    const [firstName, setFirstName] = useState();
    const [middleName, setMiddleName] = useState();
    const [lastName, setLastName] = useState();
    const [userType, setUserType] = useState();
    const [enter_type_msg, setEnterTypeMsg] = useState();
    const [parent_msg, setParentMsg] = useState();
    const [teacher_msg, setTeacherMsg] = useState();
    const [researcher_msg, setResearcherMsg] = useState();
    const [admin_msg, setAdminMsg] = useState();
    const [example, setExample] = useState();
    const [addUserBtn, setAddUserBtn] = useState();

    // States needed to create new user.
    const [current_userType, setCurrentUserType] = useState();
    const [current_firstName, setCurrentFirstName] = useState();
    const [current_middleName, setCurrentMiddleName] = useState();
    const [current_lastName, setCurrentLastName] = useState();
    const [current_email, setCurrentEmail] = useState();

    const example_data = [
        ["email", "first_name", "middle_name", "last_name", "user_type", "school", "classroom"],
        ["tribiani@email.com", "Joey", "", "Tribiani", "Admin", "", ""],
        ["geller@email.com", "Geller", "", "Ross", "Researcher", "", ""],
        ["chandler@email.com", "Chandler", "Muriel", "Bing", "Teacher", "Central Perk Elementary", "1A"],
        ["rachel@email.com", "Rachel", "", "Green", "Parent", "Central Perk Elementary", "1A"]
    ];
    
    const handleUserType = (event) => {
        setCurrentUserType(event.target.value);
    }

    const handleEmail = (event) => {
        setCurrentEmail(event.target.value);
    }

    const handleFirstName = (event) => {
        setCurrentFirstName(event.target.value);
    }

    const handleMiddleName = (event) => {
        setCurrentMiddleName(event.target.value);
    }

    const handleLastName = (event) => {
        setCurrentLastName(event.target.value);
    }


    // used for getting initial schools 
    const setInitialState = () => {
        let arr = [];

        fetch('http://127.0.0.1:8000/api/school', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                arr.push(item);
            })
        }).then(() => {
            setSchools([...schools, ...arr]);
        });
    }

    // get classrooms of selected school
    const handleDetail = (elem) => {
        let arr = [];

        fetch(`http://127.0.0.1:8000/api/school/${elem.id}/classroom`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                arr.push(item);
            })
        }).then(() => {
            setClassrooms(arr);
        }).then(() => {
            setSchoolID(elem.id);
        }).then(() => {
            setSelected([]);  // need to clear selected classrooms when new school selected
        });
    }

    // get selected classrooms 
    // TODO: teachers can be in multiple classrooms, but not children, should we make a separate single selector for children?
    const selectListItem = (item) => {
        if (selected.includes(item)) {
            setSelected(selected.filter((i) => i !== item));
        }
        else {
            setSelected(
                [...selected,
                item]
            )
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let token = JSON.parse(sessionStorage.getItem('token'));

        let user = {
            "user_type": current_userType,
            "email": current_email,
            "first_name": current_firstName,
            "middle_name": current_middleName,
            "last_name": current_lastName,
        }

        if (current_userType === "2") {
            // indexing is off by 1
            user['school'] = schools[schoolID-1];
            user['classroom'] = classrooms[selected-1];
        }

        console.log(user);

        let request = {
            "users": [user]
        }

        return fetch('http://127.0.0.1:8000/api/user/admin-add-users/', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(request)
        }).then(data => data.json()
        ).then(data => {
            console.log(data);
        }).catch(error => {
            console.log(error);
        });
    }

    // Translate messages using language code retrieved from localstorage.
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow User Creator").then((response) => setTabHeader(response));
            Translate('en', lang, "Add Multiple Users Via .csv file").then(response => setHeader(response));
            Translate('en', lang, "Add Users Manually").then(response => setAddUserMsg(response));
            Translate('en', lang, "Drop .csv file here, or click to upload!").then(response => setDropbox(response));
            Translate('en', lang, "Email address").then(response => setEmail(response));
            Translate('en', lang, "First name").then(response => setFirstName(response));
            Translate('en', lang, "Middle name").then(response => setMiddleName(response));
            Translate('en', lang, "Last name").then(response => setLastName(response));
            Translate('en', lang, "Add user").then(response => setAddUserBtn(response));
            Translate('en', lang, "Enter user type").then(response => setEnterTypeMsg(response));
            Translate('en', lang, "Parent").then(response => setParentMsg(response));
            Translate('en', lang, "Teacher").then(response => setTeacherMsg(response));
            Translate('en', lang, "Researcher").then(response => setResearcherMsg(response));
            Translate('en', lang, "Admin").then(response => setAdminMsg(response));
            Translate('en', lang, "Download example .csv file").then(response => setExample(response));
            Translate('en', lang, "No schools found...").then(response => setNoSchoolsFound(response));
            Translate('en', lang, "No classrooms found...").then(response => setNoClassroomsFound(response));
        }
    });

    // Redirect user to login page or dashboard if they're not an admin.
    useEffect(() => {
        if (sessionStorage.getItem('token') === null) {
            alert("You must be logged in to view this page.");
            nav('/login');
        } 
        else {
            Authenticate(JSON.parse(sessionStorage.getItem('token'))).then(response => {
                if (response.user.user_type !== 4) {
                    alert("You must be an admin to view this page.");
                    nav('/dashboard');
                }
            });
        }
    }, []);



    useEffect(() => {
        // Prevents page from being constantly translated.
        if (!translated) {
            setInitialState();
            translateMessage();
            setTranslated(1);
        }

        // Eventlistener for when new language code is set from LanguageList component.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);

    });


    // Return the admin add user page.
    return (
        <div className='bg'>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card className='function_card'>
                <LanguageList />
                <Card className="title_card">
                    <h1>{header}</h1>
                </Card>
                
                <div style={{padding: 20}}>
                    <StyledDropzone dropbox_message={dropbox} />
                </div>
                <CSVLink data={example_data} filename={"LinGrow_example.csv"}>{
                    <Button variant="primary" style={{marginBottom: "60px"}}>{example}</Button>
                }</CSVLink>

                <Card className="title_card">
                    <h1>{addUserMsg}</h1>
                </Card>
                <input className='form-control' type="text" placeholder={email} id="email" onChange={handleEmail} />
                <select className="form-select" id="user_type" onChange={handleUserType} >
                    <option value="" disabled selected>{enter_type_msg}</option>
                    <option value={1}>{parent_msg}</option>
                    <option value={2}>{teacher_msg}</option>
                    <option value={3}>{researcher_msg}</option>
                    <option value={4}>{admin_msg}</option>
                </select>
                <input className='form-control' type="text" placeholder={firstName} id="first_name" onChange={handleFirstName} />
                <input className='form-control' type="text" placeholder={middleName} id="middle_name" onChange={handleMiddleName} />
                <input className='form-control' type="text" placeholder={lastName} id="last_name" onChange={handleLastName} />
                    <div style={{ display: 'block', width: 400, padding: 15 }}>  
                    {
                        <div> 
                        {current_userType === "1" || current_userType === "2" ? 
                            <div>
                            {
                                schools.length > 0 ? 
                                    <ListGroup>
                                        {schools.map((elem) => 
                                        <ListGroup.Item action onClick={() => handleDetail(elem)} id={elem.id} key={elem.id} value={elem.id}>
                                            {[elem.name]}
                                        </ListGroup.Item>)}
                                    </ListGroup> 
                                :
                                    <ListGroup>{<ListGroup.Item disabled >{no_schools_message}</ListGroup.Item>}</ListGroup>
                            }
                            </div>
                         : null}
                        </div>
                    }
                    </div>
                    <div style={{ display: 'block', width: 400, padding: 15 }}>
                    {
                        <div> 
                        {(current_userType === "1" && schoolID !== undefined) || (current_userType === "2" && schoolID !== undefined) ? 
                            <div>
                            {
                                classrooms.length > 0 ? 
                                    <ListGroup>
                                        {classrooms.map((elem) => 
                                        <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} id={elem.id} key={elem.id} value={elem.id}>
                                            {[elem.name]}
                                        </ListGroup.Item>)}
                                    </ListGroup> 
                                :
                                    <ListGroup>{<ListGroup.Item disabled >{no_classrooms_message}</ListGroup.Item>}</ListGroup>
                            }
                            </div>
                         : null}
                        </div>
                    }
                    </div> 
                
                <div style={{padding: 20}}>
                    <Button variant="primary" type="submit" id="submit" onClick={handleSubmit} >{addUserBtn}</Button>
                </div>
            </Card>
        </div>
    )
}