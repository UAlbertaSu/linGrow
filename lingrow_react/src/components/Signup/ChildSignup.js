import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import './Signup.css';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Register child component.
export default function RegisterChild() {

    const nav = useNavigate();

    // Declare state variables.
    const [selected, setSelected] = useState([]);
    const [schools, setSchools] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [schoolID, setSchoolID] = useState('');


    // Fetch schools from database.
    const setInitialState = () => {
        let token = JSON.parse(sessionStorage.getItem('token'));
        console.log(token);
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
        let token = JSON.parse(sessionStorage.getItem('token'));
        console.log(token);
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

    // Children can belong to only one classroom unlike teachers.
    const selectListItem = (item) => {
        setSelected([item]);
    }

    async function retrieveParentID () {
        let token = JSON.parse(sessionStorage.getItem('token'));

        return fetch('http://127.0.0.1:8000/api/user/profile/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(data => data.json()
        ).then(data => {
            console.log(data);
            return data.user.id;
        });
    }

    const handleSubmit = async (event) => {
        let token = JSON.parse(sessionStorage.getItem('token'));
        event.preventDefault();
        let request;
        let parentID = '';

        let promise = new Promise ((resolve, reject) => {
            // Retrieve parent detail.
            retrieveParentID().then((data) => {
                parentID = data;
                resolve(data);
            });
        });

        promise.then(async () => {
            if (document.getElementById("child_middle_name").value !== "") {
                request = {
                    "parent": parentID,
                    "first_name": document.getElementById("child_first_name").value,
                    "middle_name": document.getElementById("child_middle_name").value,
                    "last_name": document.getElementById("child_last_name").value,
                    "student_id": document.getElementById("child_student_id").value,
                    "school": document.getElementById("school_id").value,
                    "classroom": document.getElementById("classroom_id").value
                }
            }
            else {
                request = {
                    "parent": parentID,
                    "first_name": document.getElementById("child_first_name").value,
                    "last_name": document.getElementById("child_last_name").value,
                    "student_id": document.getElementById("child_student_id").value,
                    "school": document.getElementById("school_id").value,
                    "classroom": document.getElementById("classroom_id").value
                }
            }

            return fetch(`http://127.0.0.1:8000/api/user/child/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request)
            }).then(data => data.json()
            ).then(data => {
                console.log(data);
                nav('/dashboard');
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    const [tab_header, setTabHeader] = useState('LinGrow Child Registration');
    const [header, setHeader] = useState('Child Registration');
    const [register_btn, setRegisterBtn] = useState('Register');
    const [first_name, setFirstName] = useState('First Name');
    const [middle_name, setMiddleName] = useState('Middle Name');
    const [last_name, setLastName] = useState('Last Name');
    const [student_id, setStudentID] = useState('Student ID');
    const [school, setSchool] = useState('School');
    const [classroom, setClassroom] = useState('Classroom');

    const [first_name_placeholder, setFirstNamePlaceholder] = useState("Enter Child's First Name");
    const [middle_name_placeholder, setMiddleNamePlaceholder] = useState("Enter Child's Middle Name");
    const [last_name_placeholder, setLastNamePlaceholder] = useState("Enter Child's Last Name");
    const [student_id_placeholder, setStudentIDPlaceholder] = useState("Enter Child's Student ID");

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);
    
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, 'LinGrow Child Registration').then(response => setTabHeader(response));
            Translate('en', lang, 'Child Registration').then(response => setHeader(response));
            Translate('en', lang, 'Register').then(response => setRegisterBtn(response));
            Translate('en', lang, 'First Name').then(response => setFirstName(response));
            Translate('en', lang, 'Middle Name').then(response => setMiddleName(response));
            Translate('en', lang, 'Last Name').then(response => setLastName(response));
            Translate('en', lang, 'Student ID').then(response => setStudentID(response));
            Translate('en', lang, 'School').then(response => setSchool(response));
            Translate('en', lang, 'Classroom').then(response => setClassroom(response));
            Translate('en', lang, "Enter Child's First Name").then(response => setFirstNamePlaceholder(response));
            Translate('en', lang, "Enter Child's Middle Name").then(response => setMiddleNamePlaceholder(response));
            Translate('en', lang, "Enter Child's Last Name").then(response => setLastNamePlaceholder(response));
            Translate('en', lang, "Enter Child's Student ID").then(response => setStudentIDPlaceholder(response));
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

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            setInitialState();
            setLoaded(true);
        }
    });



    return (
        <div className="bg">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tab_header}</title>
            </Helmet>
            <Card className="signup" style={{}}>
                <LanguageList />
                { /* Child signup details */ }
                <h1>{header}</h1>
                <label className="label">{first_name}</label>
                <input className="form-control" type="text" id="child_first_name" placeholder={first_name_placeholder} />
                <label className="label">{middle_name}</label>
                <input className="form-control" type="text" id="child_middle_name" placeholder={middle_name_placeholder} />
                <label className="label">{last_name}</label>
                <input className="form-control" type="text" id="child_last_name" placeholder={last_name_placeholder} />
                <label className="label">{student_id}</label>
                <input className="form-control" type="text" id="child_student_id" placeholder={student_id_placeholder} />
                <div style={{padding: 10}} />
                <label className="label">School</label>
                <ListGroup>
                    {schools.map((elem) => 
                    <ListGroup.Item action onClick={() => handleDetail(elem)} id="school_id" key={elem.id} value={elem.id}>
                        {[elem.name]}
                    </ListGroup.Item>)}
                </ListGroup> 
                <div style={{padding: 10}}>
                    {
                        classrooms.length > 0 ? (
                        <div>
                            <label className="label">Classroom</label>
                            <ListGroup>
                                {classrooms.map((elem) => 
                                <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} id="classroom_id" key={elem.id} value={elem.id}>
                                    {[elem.name]}
                                </ListGroup.Item>)}
                            </ListGroup>
                        </div>
                        ) : null
                    }
                </div>
                <Button variant="primary" type="submit" id="submit_button" onClick={handleSubmit}>{register_btn}</Button>{''}
            </Card>
        </div>
    )
}
    
    




