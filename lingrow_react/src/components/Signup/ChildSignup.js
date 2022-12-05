import React, { useState } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import './Signup.css';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Register child component.
export default function RegisterChild() {

    // Declare state variables.
    const [token] = useState(localStorage.getItem('token'));
    const [selected, setSelected] = useState([]);
    const [schools, setSchools] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [schoolID, setSchoolID] = useState('');


    // Fetch schools from database.
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

    const handleSubmit = () => {
    
    }

    const [tab_header, setTabHeader] = useState('Child Registration');
    const [register_btn, setRegisterBtn] = useState('Register');

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
                <Button variant="primary" type="submit" id="submit_button" onClick={handleSubmit}>{register_btn}</Button>{''}
                <div>  
                    <ListGroup>
                        {schools.map((elem) => 
                        <ListGroup.Item action onClick={() => handleDetail(elem)} id="school_id" key={elem.id} value={elem.id}>
                            {[elem.name]}
                        </ListGroup.Item>)}
                    </ListGroup> 
                    <ListGroup>
                        {classrooms.map((elem) => 
                        <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} id="classroom_id" key={elem.id} value={elem.id}>
                            {[elem.name]}
                        </ListGroup.Item>)}
                    </ListGroup>
                </div>
            </Card>
        </div>
    )
}
    
    




