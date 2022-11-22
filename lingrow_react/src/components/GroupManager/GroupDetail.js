import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, ListGroup } from 'react-bootstrap';

import LanguageList from "../Translate/LanguageList";

export default function GroupDetail() {
    let location = useLocation();

    const [error, setError] = useState(0);
    const [group_name, setGroupName] = useState("");
    const [members, setMembers] = useState([]);
    const [flag, setFlag] = useState(0);

    useEffect(() => {
        if (!flag) {
            if (location.state !== null) {
                let arr = [];
                let groupID = location.state.groupID;
                let groupType = location.state.groupType;
                let token = JSON.parse(sessionStorage.getItem('token'));
    
                console.log(`http://127.0.0.1:8000/api/group/${groupType}group/${groupID}`);
        
                fetch(`http://127.0.0.1:8000/api/group/${groupType}group/${groupID}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }).then(data => data.json()
                ).then(data => {
                    setGroupName(data.name);
                    if (groupType === 'researcher') {
                        data.researcher.map((elem) => {
                            arr.push(`${elem.user.first_name} ${elem.user.last_name}`);
                        });
                    }
                    else if (groupType === 'teacher') {
                        data.teacher.map((elem) => {
                            arr.push(`${elem.user.first_name} ${elem.user.last_name}`);
                        });
                    }
                    else if (groupType === 'parent') {
                        data.parent.map((elem) => {
                            arr.push(`${elem.user.first_name} ${elem.user.last_name}`);
                        });
                    }
                }).then(() => {
                    setMembers([...members, ...arr]);
                }).catch(error => {
                    console.log(error);
                });
            }
            else {
                setError(1);
            }
        }
        setFlag(1);
    }, [])


    if (error) {
        return (
            <div>            
                <h1>Page does not exist</h1>
                <a href="/dashboard">Return to Dashboard</a>
            </div>
        )
    }
    else {
        return (
            <Card style={{minHeight:"fit-content"}}>
                <LanguageList />
                <h1>{group_name}</h1>
                <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {members.map((elem) => 
                        <ListGroup.Item key={elem} value={elem}>
                            {[elem]}
                        </ListGroup.Item>)}
                </ListGroup>
            </div>
            </Card>
        )
    }
}