import React, { setState, useState, useEffect, useCallback } from 'react';
import { Card, Button} from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageList from '../Translate/LanguageList';
import logo from "../Img/lingrow.png";
import { Helmet } from 'react-helmet';
import Translate from '../Translate/Translate';
import DashNav from '../DashNav/DashNav';

// Allows users to create a new parent, teacher, or researcher group.
export default function ClassroomCreator({userType}) {
    const loc = useLocation();
    const nav = useNavigate();

    const [selected, setSelected] = useState(loc.state !== null ? loc.state.groupMembers : []);
    const [searchResult, setSearchResult] = useState([]);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [userChoice, setUserChoice] = useState(loc.state !== null ? loc.state.groupType : 1);

    const [tab_header, setTabHeader] = useState("LinGrow Class Creator");
    const [no_user_message, setNoUsersFound] = useState("No users found");
    const [group_create_header, setHeader] = useState("Create New Classroom");
    const [submit_btn, setSubmitBtn] = useState("Create Classroom");
    const [group_name, setGroupName] = useState(loc.state !== null ? loc.state.groupName : "Classroom Name");
    const [group_id, setGroupID] = useState("Classroom ID");

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

    const populateList = () => {
        let arr = [];

        // get all parents and teachers
        fetch('http://127.0.0.1:8000/api/search/teachers', {
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
    
        fetch('http://127.0.0.1:8000/api/search/parents', {
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

        console.log(method);


        var request = {
            'name': group_name,
            // TODO: do we need to pass state in or is it guaranteed set

            'school': loc.state.schoolID,
            'users': selected  //TODO: need to create classroom with users
        }



        let url = 'http://127.0.0.1:8000/api/school/${schoolID}'

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

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Class Creator").then((response) => setTabHeader(response));
            Translate('en', lang, "Create New Classroom").then(response => setHeader(response));
            Translate('en', lang, "Create Classroom").then(response => setSubmitBtn(response));
            Translate('en', lang, "Classroom Name").then(response => setGroupName(response));
            Translate('en', lang, "Classroom ID").then(response => setGroupID(response));
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
    return (
        <div className="bg">
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <DashNav/>
                <h1>{group_create_header}</h1>
                <input type="text" className="form-control" id="group_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
                <input type="text" className="form-control" id="group_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
                
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