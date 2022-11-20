import React, { setState, useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Allows users to create a new parent, teacher, or researcher group.
export default function GroupCreator({userType}) {

    const nav = useNavigate();

    const [selected, setSelected] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [flagSet, setFlagSet] = useState(0);
    const [userChoice, setUserChoice] = useState(1);

    const [group_create_header, setHeader] = useState("Create New Group");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [search_bar_placeholder, setSearchBarPlaceholder] = useState("");
    const [group_name, setGroupName] = useState("Group Name");
    const [group_id, setGroupID] = useState("Group ID");

    // Sets the initial state of search results.

    const handleChange = async (e) => {
        e.preventDefault();

        setUserChoice(parseInt(e.target.value));
        setSearchResult([]);
        setSelected([]);
    }

    useEffect(() => {
        populateList(userChoice);
    }, [userChoice]);

    const populateList = (userChoice) => {
        let arr = [];

        if (parseInt(userChoice) === 3) { // Admin can add all users into group.
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

        if (parseInt(userChoice) === 2) { // Admin and researcher can add teachers and parents into group.
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

        if (parseInt(userChoice) === 1) { // Admin, researcher, and teacher can add parents into group.
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (userChoice === 3) {
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
            }).then(() => {
                nav('/groupmanager');
            }).catch(error => {
                console.log(error);
            })
        }

        else if (userChoice === 2) {
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
            }).then(() => {
                nav('/groupmanager');
            }).catch(error => {
                console.log(error);
            })
        }

        else if (userChoice === 1) {
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
            }).then(() => {
                nav('/groupmanager');
            }).catch(error => {
                console.log(error);
            })
        }
    }

    useEffect(() => {
        if (!flagSet) {
            populateList(userChoice);
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
            <select defaultValue={1} className='form-select' id='language_dropdown' onChange={handleChange} style={{margin:"20px"}}>
                <option value={1}>Parents</option>
                <option disabled={userType > 2 ? false : true} value={2}>Teachers</option>
                <option disabled={userType > 3 ? false : true} value={3}>Researchers</option>
            </select>
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {searchResult.map((elem) => 
                        <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} key={elem.id} value={elem.id}>
                            {[elem.first_name, " ", elem.last_name]}
                        </ListGroup.Item>)}
                </ListGroup>
            </div>
            <Button variant="primary" type="submit" id="submit" style={{minWidth:"100px"}} onClick={handleSubmit}>{submit_btn}</Button>
        </Card>
    );
}