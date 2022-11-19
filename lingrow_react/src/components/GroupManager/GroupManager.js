import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Group manager component.
export default function GroupManager({userType}) {

    const [selected, setSelected] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));

    const [group_create_header, setHeader] = useState("Create New Group");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [search_bar_placeholder, setSearchBarPlaceholder] = useState("");
    const [flagSet, setFlagSet] = useState(0);
    const [group_name, setGroupName] = useState("Group Name");
    const [group_id, setGroupID] = useState("Group ID");

    // Sets the initial state of search results.
    const setInitialState = (e) => {
        let userType = parseInt(sessionStorage.getItem('userType'));
        let arr = [];

        if (userType === 4) { // Admin can add all users into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/search/researchers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    arr.push(item.user);
                })
            }).then(() => {
                setSearchResult([...searchResult, ...arr]);
            });
        }

        if (userType === 3) { // Admin and researcher can add teachers and parents into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/search/teachers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    arr.push(item.user);
                })
            }).then(() => {
                setSearchResult([...searchResult, ...arr]);
            });
        }

        if (userType === 2) { // Admin, researcher, and teacher can add parents into group.
            arr = [];

            fetch('http://127.0.0.1:8000/api/search/parents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    arr.push(item.user);
                })
            }).then(() => {
                setSearchResult([...searchResult, ...arr]);
            });
        }
    }

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

    const handleSearchResult = (e) => {
        dispatchEvent(new Event("Search result changed"));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userType === 4) { // Admin can add all users into group.
            var request = {
                'name': group_name,
                'researcher': selected
            }

            fetch('http://127.0.0.1:8000/api/group/researchergroup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            }).catch(error => {
                console.log(error);
            })
        }

        else if (userType === 3) {
            var request = {
                'name': group_name,
                'teacher': selected
            }

            fetch('http://127.0.0.1:8000/api/group/teachergroup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            }).catch(error => {
                console.log(error);
            })
        }

        else if (userType === 2) {
            var request = {
                'name': group_name,
                'parent': selected
            }

            fetch('http://127.0.0.1:8000/api/group/parentgroup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            }).catch(error => {
                console.log(error);
            })
        }
    }

    useEffect(() => {
        if (!flagSet) {
            setInitialState();
            setFlagSet(1);
        }
    }, []);

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "Create New Group").then(response => setHeader(response));
            Translate('en', lang, "Create Group").then(response => setSubmitBtn(response));
            Translate('en', lang, "Group Name").then(response => setGroupName(response));
            Translate('en', lang, "Group ID").then(response => setGroupID(response));
            Translate('en', lang, "Search User").then(response => setSearchBarPlaceholder(response));
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
        <Card style={{minHeight:"fit-content"}}>
            <LanguageList />
            <h1>{group_create_header}</h1>
            <input type="text" className="form-control" id="group_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
            <input type="text" className="form-control" id="group_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
            <input type="text" className="form-control" id="search_bar" placeholder={search_bar_placeholder} onChange={e => handleSearchResult(e.target.value)} />
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {searchResult.map((elem) => 
                        <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} key={elem.id} value={elem.id}>
                            {[elem.first_name, " ", elem.last_name]}
                        </ListGroup.Item>)}
                </ListGroup>
            </div>
            <Button variant="primary" type="submit" id="login" style={{minWidth:"100px"}} onClick={handleSubmit}>{submit_btn}</Button>
        </Card>
    );
}