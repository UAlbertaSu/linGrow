import React, { useState, useEffect } from 'react';
import LanguageList from '../Translate/LanguageList';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

// Group manager component.
export default function GroupManager(flag) {

    const [group_create_header, setHeader] = useState("Create New Group");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [search_bar, setSearchBar] = useState("");
    const [flagSet, setFlagSet] = useState(0);
    const [group_name, setGroupName] = useState("Group Name");
    const [group_id, setGroupID] = useState("Group ID");


    async function handleClick(event) {
        event.preventDefault();


    }


    useEffect(() => {
        if (!flagSet) {
            if (flag === 'user') {
                setSearchBar("Search User");
            }
            else if (flag === 'group') {
                setSearchBar("Search Group");
            }
            setFlagSet(1);
        }
    }, []);

    // TODO: Delete later, only for testing
    const DUMMY_DATA = [
        {
            "user": {
                "id": 3,
                "email": "parent@parent.com",
                "first_name": "parent",
                "middle_name": "",
                "last_name": "parentson",
                "user_type": 1
            }
        },
        {
            "user": {
                "id": 8,
                "email": "parent2@email.com",
                "first_name": "parent",
                "middle_name": "",
                "last_name": "parent",
                "user_type": 1
            }
        }
    ]

    return (
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />
            <h1>{group_create_header}</h1>
            <input type="text" className="form-control" id="group_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
            <input type="text" className="form-control" id="group_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
            <input type="text" className="form-control" id="search_bar" placeholder={search_bar} onChange={e => setSearchBar(e.target.value)} />
            <ListGroup>
                {DUMMY_DATA.map((elem) => 
                    <ListGroup.Item action onClick={(e) => e.addClass("active")} key={elem.user.id} value={elem.user.id}>
                        {[elem.user.first_name, " ", elem.user.last_name]}
                    </ListGroup.Item>)}
            </ListGroup>
            <Button variant="primary" type="submit" id="login" style={{minWidth:"100px"}}>{submit_btn}</Button>
        </Card>
    );
}