import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import { Card, Button} from 'react-bootstrap';
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/blank_lingrow.png";
import { Helmet } from 'react-helmet';
import DashNav from '../DashNav/DashNav';


export default function Chat() {

    const nav = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }

    }, []);
    const userType = JSON.parse(sessionStorage.getItem('userType'));

    const directChatHandler = async (event) => {
        event.preventDefault();
        nav('/directchat');
    }

    const groupChatHandler = async (event) => {
        event.preventDefault();
        nav('/groupchat');
    }

    const newChatHandler = async (event) => {
        event.preventDefault();
        nav('/newchat');
    }

    const redirectToActivities = async (event) => {
        event.preventDefault();
        nav("/activities");
    }

    const clearSession = async (event) => {
        sessionStorage.clear();
        nav("/");
    }

    // text headers
    const [tab_header, setTabHeader] = useState("LinGrow Chat");
    const [directChat, setDirectChat] = useState('Direct Chat');
    const [groupChat, setGroupChat] = useState('Group Chat');
    const [newChat, setNewChat] = useState('New Chat');
    const [activities, setLanguageLearningActivitiesMsg] = useState("Language Learning Activities");
        
    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Chat").then((response) => setTabHeader(response));
            Translate('en', lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate('en', lang, "Direct Chat").then(response => setDirectChat(response));
            Translate('en', lang, "Group Chat").then(response => setGroupChat(response));
            Translate('en', lang, "New Chat").then(response => setNewChat(response));
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

    // main chat page that allows selection of Direct, Group, or New Chat
    return (
        <div className="bg">
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <DashNav/>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <Button variant="primary" type="submit" id="directChat" onClick={directChatHandler} style={{minWidth:"150px"}}>{directChat}</Button>  
                    <Button variant="primary" type="submit" id="groupChat" onClick={groupChatHandler} style={{minWidth:"150px"}}>{groupChat}</Button>
                    <Button variant="primary" type="submit" id="newChat" onClick={newChatHandler} style={{minWidth:"150px"}}>{newChat}</Button>
                    <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities} style={{minWidth:"150px"}}>{activities}</Button>
                </Card>
            </Card>
        </div>      
    );
}