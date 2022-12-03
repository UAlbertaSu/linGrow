import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, ListGroup } from 'react-bootstrap';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";

import clouds from '../Img/clouds.png';

export default function GroupDetail() {
    let location = useLocation();
    let navigate = useNavigate();

    const [error, setError] = useState(0);
    const [group_name, setGroupName] = useState("");
    const [members, setMembers] = useState([]);
    const [flag, setFlag] = useState(0);
    const [edit, setEditMsg] = useState("Edit");

    const enumGroupType = (groupType) => {
        if (groupType === 'parent') {
            return 1;
        }
        else if (groupType === 'teacher') {
            return 2;
        }
        else if (groupType === 'researcher') {
            return 3;
        }
        else {
            return 0;
        }
    }

    useEffect(() => {
        if (!flag) {
            if (location.state !== null) {
                let arr = [];
                let groupID = location.state.groupID;
                let groupType = location.state.groupType;
                let token = JSON.parse(sessionStorage.getItem('token'));
                        
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
                            arr.push(elem.user);
                        });
                    }
                    else if (groupType === 'teacher') {
                        data.teacher.map((elem) => {
                            arr.push(elem.user);
                        });
                    }
                    else if (groupType === 'parent') {
                        data.parent.map((elem) => {
                            arr.push(elem.user);
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

    const editGroup = () => {
        let arr = [];

        members.map((elem) => {
            arr.push(elem.id);
        });

        navigate('/groupcreator', {state: {
            groupName: group_name,
            groupID: location.state.groupID, 
            groupType: enumGroupType(location.state.groupType),
            groupMembers: arr,
        }});
    }

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
            <Card className="background_cloud_card">
                <Card.Img src={clouds} alt="Cloud Background" style={{width:"100%", height:"100%", objectFit: "cover"}}/>
                <Card.ImgOverlay>
                    <Card style={{minHeight:"fit-content"}}>
                        <LanguageList />
                        <h1>{group_name}</h1>
                        <div style={{ display: 'block', width: 400, padding: 30 }}>
                            <ListGroup>
                                {members.map((elem) => 
                                    <ListGroup.Item key={elem} value={elem}>
                                        {`${elem.first_name} ${elem.last_name}`}
                                    </ListGroup.Item>)}
                            </ListGroup>
                        </div>
                        <Button variant="primary" onClick={editGroup}>{edit}</Button>
                    </Card>
                </Card.ImgOverlay>
            </Card>
        )
    }
}