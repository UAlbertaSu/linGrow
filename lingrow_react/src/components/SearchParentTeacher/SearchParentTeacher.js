// TODO: taken from user manager, could probably really easily just call that instead

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LanguageList from "../Translate/LanguageList";
import Translate from "../Translate/Translate";

// Allows admin users to look at the list of users.
export default function UserManager() {
    const nav = useNavigate();

    // State variables.
    const [token] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [groups, setGroups] = useState([]);
    const [header, setHeader] = useState("User Manager");
    const [no_user_message, setNoUsersFound] = useState("No users found...");
    const [addUsers, setAddUsers] = useState("Add New Users");
    const [translated, setTranslated] = useState(0);

    // If user clicks a group creation button, navigate user to the group creation page.
    const handleNavigate = async (e) => {
        nav('/adminadduser');
    }

    // Sets up the list of users for admin to see.
    const setInitialState = () => {
        let user_cats = ["parents", "teachers", "researchers"];
        let arr = [];

        // Iterates between parents, teachers, and researchers.
        user_cats.forEach((user_cat) => {
            let url = `http://127.0.0.1:8000/api/user/profile/${user_cat}/`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    console.log(item.user);
                    arr.push(item.user);
                })
            }).then(() => {
                setGroups([...groups, ...arr]);
            });
        });
    }

    // Translate message, given language code from localStorage.
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "User Manager").then(response => setHeader(response));
            Translate('en', lang, "No users found...").then(response => setNoUsersFound(response));
            Translate('en', lang, "Add New Users").then(response => setAddUsers(response));
        }
    });

    // Translate message and set up list of users when page loads.
    useEffect(() => {

        // Prevent translation and list setup from running multiple times.
        if (!translated) {
            setInitialState();
            translateMessage();
            setTranslated(1);
        }

        // If the new language change is detected, translate the page.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    return (
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />
            <h1>{header}</h1>
            <Button variant="primary" type="submit" id="create" style={{minWidth:"100px"}} onClick={handleNavigate}>{addUsers}</Button>
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                {
                    groups.length > 0 ? 
                        <ListGroup>
                            {groups.map((elem) => 
                            <ListGroup.Item action id={elem.id} key={elem.id} value={elem.id}>
                                {[elem.first_name, elem.middle_name, elem.last_name].join(" ")}
                            </ListGroup.Item>)}
                        </ListGroup> 
                    :
                        <ListGroup>{<ListGroup.Item disabled >{no_user_message}</ListGroup.Item>}</ListGroup>
                }
            </div>
        </Card>
    );
}