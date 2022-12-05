import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import './Signup.css';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Register child component.
export default function RegisterChild() {

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
                console.log(data);
                parentID = data; 
                resolve(data);
            });
        });

        promise.then(() => {
            console.log(parentID);

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
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    const [tab_header, setTabHeader] = useState('Child Registration');
    const [register_btn, setRegisterBtn] = useState('Register');

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
                <h1>Child Registration</h1>
                <label className="label">First Name</label>
                <input className="form-control" type="text" id="child_first_name" placeholder="Enter Child's First Name" />
                <label className="label">Middle Name</label>
                <input className="form-control" type="text" id="child_middle_name" placeholder="Enter Child's Middle Name" />
                <label className="label">Last Name</label>
                <input className="form-control" type="text" id="child_last_name" placeholder="Enter Child's Last Name" />
                <label className="label">Student ID</label>
                <input className="form-control" type="text" id="child_student_id" placeholder="Enter Child's Student ID" />
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
    
    




