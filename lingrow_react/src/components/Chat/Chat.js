import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';
// import ChatDisplay from './ChatDisplay';
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";
// import Validation from '../Validation/Validation';


    // write message and post it to display + database
    // should know who is sending it aka validate which user is logged in
    // knows who it sends it to
    // should be able to send it to multiple people **** (IF THERE IS TIME)

export default function Chat() {

    const nav = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }

    }, []);
    const userType = JSON.parse(sessionStorage.getItem('userType'));
    const setDashboardType = () => {
        if (userType === 1) {
            return 'LinGrow Parent Dashboard';
        }
        else if (userType === 2) {
            return 'LinGrow Teacher Dashboard';
        }
        else if (userType === 3) {
            return 'LinGrow Researcher Dashboard';
        }
        else if (userType === 4) {
            return 'LinGrow Admin Dashboard';
        }
    }

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

    const [dashboard, setDashboard] = useState(setDashboardType);
    const [dashboardString, setDashboardString] = useState();
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [directChat, setDirectChat] = useState('Direct Chat');
    const [groupChat, setGroupChat] = useState('Group Chat');
    const [newChat, setNewChat] = useState('New Chat');
    const [activities, setLanguageLearningActivitiesMsg] = useState("Language Learning Activities");
    const [logout_msg, setLogoutMsg] = useState("Logout");
        
    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, dashboard).then(response => setDashboardString(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
            Translate('en', lang, "Language Learning Activities").then(response => setLanguageLearningActivitiesMsg(response));
            Translate('en', lang, "Logout").then(response => setLogoutMsg(response));
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

    return (
        <div className="dashboard-wrapper">
            <Card style={{minHeight:"fit-content", paddingBottom:"20px"}}>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <Navbar bg="light" expand="lg" style={{width:"94%", margin: "20px 0px 10px 0px"}}>
                    <Container>
                        <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{dashboardString}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <img src={home_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="/dashboard" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>
                            <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="/userinfo" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", border:""}}>{profile}</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    <Button variant="primary" type="submit" id="directChat" onClick={directChatHandler} style={{minWidth:"150px"}}>{directChat}</Button>  
                    <Button variant="primary" type="submit" id="groupChat" onClick={groupChatHandler} style={{minWidth:"150px"}}>{groupChat}</Button>
                    <Button variant="primary" type="submit" id="newChat" onClick={newChatHandler} style={{minWidth:"150px"}}>{newChat}</Button>
                    <Button variant="secondary" type="submit" id="activities" onClick={redirectToActivities} style={{minWidth:"150px"}}>{activities}</Button>
                    <Button variant="danger" type="submit" id="logout" onClick={clearSession} style={{minWidth:"150px"}}>{logout_msg}</Button>
                </Card>
            </Card>
        </div>      
       
    );
}