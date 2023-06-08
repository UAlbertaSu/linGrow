import React, { setState, useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import {Helmet} from 'react-helmet';
import logo from "../Img/blank_lingrow.png";
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import DashNav from '../DashNav/DashNav';

// Allows users to create a new parent, teacher, or researcher group.
export default function GroupCreator({userType}) {
    const loc = useLocation();
    const nav = useNavigate();
    const [selected, setSelected] = useState(loc.state !== null ? loc.state.groupMembers : []);
    const [searchResult, setSearchResult] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [userChoice, setUserChoice] = useState(loc.state !== null ? loc.state.groupType : 1);

    const [tab_header, setTabHeader] = useState("LinGrow Group Creator");
    const [no_user_message, setNoUsersFound] = useState("No user found");
    const [group_create_header, setHeader] = useState("Group Creator");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [search_bar_placeholder, setSearchBarPlaceholder] = useState("");
    const [group_name, setGroupName] = useState(loc.state !== null ? loc.state.groupName : "Group Name");
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

            fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/researchers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    if (!searchResult.includes(item)) {
                        arr.push(item.user);
                    }
                })
            }).then(() => {
                setSearchResult([...searchResult, ...arr]);
            });
        }

        if (parseInt(userChoice) === 2) { // Admin and researcher can add teachers and parents into group.
            arr = [];

            fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/teachers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    if (!searchResult.includes(item)) {
                        arr.push(item.user);
                    }
                })
            }).then(() => {
                setSearchResult([...searchResult, ...arr]);
            });
        }

        if (parseInt(userChoice) === 1) { // Admin, researcher, and teacher can add parents into group.
            arr = [];

            fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/parents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(data => data.json()
            ).then(data => {
                data.map((item) => {
                    if (!searchResult.includes(item)) {
                        arr.push(item.user);
                    }
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

    const handleCreate = (e) => {
        e.preventDefault();

        let method = 'POST';
        if (loc.state !== null) {
            method = 'PATCH';
        }

        if (userChoice === 3) {
            var request = {
                'name': group_name,
                'researcher': selected
            }

            let url = 'http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/group/researchergroup/'

            if (loc.state !== null) {
                url += loc.state.groupID + '/';
            }

            fetch(url, {
                method: method,
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

            let url = 'http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/group/teachergroup/'

            if (loc.state !== null) {
                url += loc.state.groupID + '/';
            }

            fetch(url, {
                method: method,
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

            let url = 'http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/group/parentgroup/'

            if (loc.state !== null) {
                url += loc.state.groupID + '/';
            }

            fetch(url, {
                method: method,
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

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Group Creator").then((response) => setTabHeader(response));
            Translate('en', lang, "Group Creator").then(response => setHeader(response));
            Translate('en', lang, "Create Group").then(response => setSubmitBtn(response));
            Translate('en', lang, "Group Name").then(response => setGroupName(response));
            Translate('en', lang, "Group ID").then(response => setGroupID(response));
            Translate('en', lang, "Search User").then(response => setSearchBarPlaceholder(response));
            Translate('en', lang, "No users found").then(response => setNoUsersFound(response));
        }
    });

    // Translate the page and populate the list of users once the page load.
    useEffect(() => {

        // Prevent translation and list population from running multiple times.
        if (!translated) {
            populateList(userChoice);
            translateMessage();
            setTranslated(1);
        }

        // If the new language change is detected, translate the page.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    // Page for creating new groups, or viewing group details, redirects to another page to complete either action. 
    return (
        <div className="bg">
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <LanguageList />
                <DashNav/>
                <Card className="title_card">
                    <h1>{group_create_header}</h1>
                </Card>
                <input type="text" className="form-control" id="group_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
                <input type="text" className="form-control" id="group_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
                <select defaultValue={loc.state !== null ? loc.state.groupType : userChoice} className='form-select' id='language_dropdown' onChange={handleChange} style={{margin:"20px"}}>
                    <option value={1}>Parents</option>
                    <option disabled={userType > 2 ? false : true} value={2}>Teachers</option>
                    <option disabled={userType > 3 ? false : true} value={3}>Researchers</option>
                </select>
                <div style={{ display: 'block', width: 400, padding: 30 }}>
                    {
                        searchResult.length > 0 ? 
                            <ListGroup>
                            {searchResult.map((elem) => 
                                <ListGroup.Item action active={selected.includes(elem.id) ? true : false} onClick={() => selectListItem(elem.id)} key={elem.id} value={elem.id}>
                                    {[elem.first_name, " ", elem.last_name]}
                                </ListGroup.Item>)}
                            </ListGroup> 
                        : 
                            <ListGroup>{<ListGroup.Item disabled >{no_user_message}</ListGroup.Item>}</ListGroup>
                    }
                </div>
                <Button disabled={selected.length == 0 ? true : false} variant="primary" type="submit" id="submit" style={{minWidth:"100px"}} onClick={handleCreate}>{submit_btn}</Button>
            </Card>
        </div>
    );
}