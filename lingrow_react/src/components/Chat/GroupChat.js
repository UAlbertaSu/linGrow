import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import {Card, ListGroup} from 'react-bootstrap';
import LanguageList from '../Translate/LanguageList';
import { Helmet } from 'react-helmet';
import Translate from '../Translate/Translate';
import logo from "../Img/blank_lingrow.png";
import DashNav from '../DashNav/DashNav';

export default function DirectChat() {
    const nav = useNavigate();
    const userType = JSON.parse(sessionStorage.getItem('userType'));
    const token = JSON.parse(sessionStorage.getItem('token'));
    const [members, setMembers] = useState([]);
    const [viewChat] = useState('View Chat');

    const [tab_header, setTabHeader] = useState("LinGrow Group Chat");


    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Group Chat").then((response) => setTabHeader(response));
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
            fetch('http://127.0.0.1:8000/api/chat/group_chat/', {
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
                    // console.log(data);
                    // return data;
                    // setChatName(data)
                    setMembers([...members,...data.group_chats]);

                }
            });
        }, []
    )
    const viewChatFunc = (id_chat) => {
        console.log(id_chat);
        sessionStorage.setItem('id_chat', JSON.stringify(id_chat));
        sessionStorage.setItem('chat_type', JSON.stringify('group'));
        nav('/viewchat');

    }
    // page to select between active group chats
    return (
        <div className='bg'>
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <a href="https://bilingualacquisition.ca/"></a>
                    <LanguageList />
                    <DashNav/>
                <div style={{ display: 'block', width: 400, padding: 30 }}>
                    <ListGroup>
                        {members.map((elem) => 
                            <ListGroup.Item action key={elem} value={elem} onClick={() => {viewChatFunc(elem.id_chat)}}>
                                {`${elem.group.name}`}
                            </ListGroup.Item>)}
                    </ListGroup>
                </div>
            </Card>
        </div>
    );
}