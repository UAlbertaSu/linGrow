import React, { setState, useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import Helmet from 'react-helmet';
import logo from "../Img/blank_lingrow.png";
import DashNav from '../DashNav/DashNav';

// Allows users to create a new school
export default function SchoolCreator({}) {
    const loc = useLocation();
    const nav = useNavigate();

    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));

    const [tab_header, setTabHeader] = useState("LinGrow School Creator");
    const [group_create_header, setHeader] = useState("School Creator");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [group_name, setGroupName] = useState(loc.state !== null ? loc.state.groupName : "Group Name");
    const [email_name, setEmailName] = useState(loc.state !== null ? loc.state.groupName : "Email");
    const [group_id, setGroupID] = useState("Group ID");

    // Sets the initial state of search results.

    const handleCreate = (e) => {
        e.preventDefault();

        let method = 'POST';
        if (loc.state !== null) {
            method = 'PATCH';
        }

        var request = {
            'name': group_name,
            'email': email_name,
        }

        let url = 'http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/school/'

        if (loc.state !== null) {
            url += loc.state.schoolID + '/';
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(request),
        }).then(() => {
            nav('/schoolmanager');
        }).catch(error => {
            console.log(error);
        })
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow School Creator").then((response) => setTabHeader(response));
            Translate('en', lang, "School Creator").then(response => setHeader(response));
            Translate('en', lang, "Create New School").then(response => setHeader(response));
            Translate('en', lang, "Create School").then(response => setSubmitBtn(response));
            Translate('en', lang, "School Name").then(response => setGroupName(response));
            Translate('en', lang, "School Email").then(response => setEmailName(response));
            Translate('en', lang, "School ID").then(response => setGroupID(response));
        }
    });

    // Translate the page and populate the list of users once the page load.
    useEffect(() => {

        // Prevent translation from running multiple times.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        // If the new language change is detected, translate the page.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

    // page for creation of schools
    return (
        <div className="bg">
        <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
        <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <LanguageList />
            <DashNav/>
            <Card className="title_card">
                <h1>{group_create_header}</h1>
            </Card>
            
            <input type="text" className="form-control" id="school_name" placeholder={group_name} onChange={e => setGroupName(e.target.value)}/>
            <input type="text" className="form-control" id="school_email" placeholder={email_name} onChange={e => setEmailName(e.target.value)}/>
            <input type="text" className="form-control" id="school_id" placeholder={group_id} onChange={e => setGroupID(e.target.value)} />
            <Button variant="primary" type="submit" id="submit" style={{minWidth:"100px"}} onClick={handleCreate}>{submit_btn}</Button>
        </Card>
        </div>
    );
}