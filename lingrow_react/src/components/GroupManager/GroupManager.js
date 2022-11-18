import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

// Group manager component.
export default function GroupManager(flag) {

    flag = 'user';


    // const selected = [];

    const [selected, setSelected] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    const [group_create_header, setHeader] = useState("Create New Group");
    const [submit_btn, setSubmitBtn] = useState("Create Group");
    const [search_bar, setSearchBar] = useState("");
    const [search_bar_placeholder, setSearchBarPlaceholder] = useState("");
    const [flagSet, setFlagSet] = useState(0);
    const [group_name, setGroupName] = useState("Group Name");
    const [group_id, setGroupID] = useState("Group ID");

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

    const setInitialState = (e) => {
        setSearchResult(DUMMY_DATA);
    }

    const handleSearchResult = (e) => {
        dispatchEvent(new Event("Search result changed"));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Selected users: ", selected);
    }

    useEffect(() => {
        if (!flagSet) {
            if (flag === 'user') {
                setSearchBarPlaceholder("Search User");
            }
            else if (flag === 'group') {
                setSearchBarPlaceholder("Search Group");
            }
            setFlagSet(1);

            setInitialState();
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
        },
        {
            "user": {
                "id": 9,
                "email": "parent3@email.com",
                "first_name": "parent3",
                "middle_name": "",
                "last_name": "thirdParent",
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
            <input type="text" className="form-control" id="search_bar" placeholder={search_bar_placeholder} onChange={e => handleSearchResult(e.target.value)} />
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {searchResult.map((elem) => 
                        <ListGroup.Item action active={selected.includes(elem.user.id) ? true : false} onClick={() => selectListItem(elem.user.id)} key={elem.user.id} value={elem.user.id}>
                            {[elem.user.first_name, " ", elem.user.last_name]}
                        </ListGroup.Item>)}
                </ListGroup>
            </div>
            <Button variant="primary" type="submit" id="login" style={{minWidth:"100px"}} onClick={handleSubmit}>{submit_btn}</Button>
        </Card>
    );
}