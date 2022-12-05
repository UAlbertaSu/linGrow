import react, {useEffect, useState, useCallback} from 'react';
import {Nav, Container, Navbar} from 'react-bootstrap';
import {useLocation, useNavigate} from "react-router-dom";
import './DashNav.css';
import Translate from '../Translate/Translate';
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";


export default function DashNav() {
    const nav = useNavigate();
    const userType = JSON.parse(sessionStorage.getItem('userType'));
    const currentURL = window.location.pathname;
    const [pdashboard, setPDashboard] = useState("LinGrow Parent Dashboard");
    const [tdashboard, setTDashboard] = useState("LinGrow Teacher Dashboard");
    const [rdashboard, setRDashboard] = useState("LinGrow Researcher Dashboard");
    const [adashboard, setADashboard] = useState("LinGrow Admin Dashboard");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");

    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, 'LinGrow Parent Dashboard').then((response) => setPDashboard(response));
            Translate('en', lang, 'LinGrow Teacher Dashboard').then((response) => setTDashboard(response));
            Translate('en', lang, 'LinGrow Researcher Dashboard').then((response) => setRDashboard(response));
            Translate('en', lang, 'LinGrow Admin Dashboard').then((response) => setADashboard(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
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
    }, []);

    const navDashboard = (event) => {
        event.preventDefault();
        nav('/dashboard');
    }

    const navProfile = (event) => {
        event.preventDefault();
        nav('/userinfo');
    }

    // navigation bar that allows navigation to the home or user info page.
    // Highlights respective option and disables it when on that page
    // shows the user's type in the navbar
    // translated with the parent page
    return (
    <Navbar bg="light" expand="lg" style={{width:"94%", margin: "20px 0px 10px 0px"}}>
        <Container>
            <div>{userType === 1 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{pdashboard}</Navbar.Brand> : null}</div>
            <div>{userType === 2 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{tdashboard}</Navbar.Brand> : null}</div>
            <div>{userType === 3 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{rdashboard}</Navbar.Brand> : null}</div>
            <div>{userType === 4 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{adashboard}</Navbar.Brand> : null}</div>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <img src={home_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                <div>{currentURL === "/dashboard" ? 
                    <Nav.Link style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px",  color:"black"}}>{home}</Nav.Link> :
                    <Nav.Link onClick={navDashboard} style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>}
                </div>
                <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                <div>{currentURL === "/userinfo" ? 
                    <Nav.Link style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", color:"black"}}>{profile}</Nav.Link>: 
                    <Nav.Link onClick={navProfile} style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{profile}</Nav.Link>}
                </div>
            </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}

