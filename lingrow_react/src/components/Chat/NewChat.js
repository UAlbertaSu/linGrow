import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import {Card, ListGroup} from 'react-bootstrap';
import LanguageList from '../Translate/LanguageList';
import { Helmet } from 'react-helmet';
import Translate from '../Translate/Translate';
import DashNav from '../DashNav/DashNav';
import logo from "../Img/blank_lingrow.png";

export default function DirectChat() {
    const nav = useNavigate();
    const token = JSON.parse(sessionStorage.getItem('token'));
    const [members, setMembers] = useState([]);
    const [tab_header, setTabHeader] = useState("LinGrow New Chat");
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow New Chat").then((response) => setTabHeader(response));
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

    console.log(token);
    useEffect(
        () => {
            fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/chat/new_chat/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
            }).then(data => data.json()
            ).then(data => {
                if (data.hasOwnProperty('error')) {
                    throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
                }
                else {
                    setMembers([...members,...data]);

                }
            });
        }, []
    )
    const createChatFunc = (email) => {
        console.log("HERE")
        fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/chat/create_chat/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "other_username": email
            })
        }).then(data => data.json()
        ).then(data => {
            console.log(data.id_chat);
            sessionStorage.setItem('id_chat', JSON.stringify(data.id_chat));
            sessionStorage.setItem('chat_type', JSON.stringify('private'));
            nav('/viewchat');
        });

    }
    // page that lets the user start chats with other users
    return (
        <div className="bg">
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
                </Helmet>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <DashNav/>
                <div style={{ display: 'block', width: 400, padding: 30 }}>
                    <ListGroup>
                        {members.map((elem) => 
                            <ListGroup.Item action key={elem} value={elem} onClick={() => {createChatFunc(elem.email)}}>
                                {`${elem.email}`}
                            </ListGroup.Item>)}
                    </ListGroup>
                </div>
            </Card>
        </div>
    );
}