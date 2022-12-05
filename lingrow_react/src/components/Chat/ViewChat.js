import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import { Card, Button, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';
// import ChatDisplay from './ChatDisplay';
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/blank_lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";
import { Helmet } from 'react-helmet';
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
    const id_chat = JSON.parse(sessionStorage.getItem('id_chat'));
    const chat_type = JSON.parse(sessionStorage.getItem('chat_type'));
    var url = "http://127.0.0.1:8000/api/chat/get_private_chat_messages/";
    if (chat_type === "group") {
        url = "http://127.0.0.1:8000/api/chat/get_group_chat_messages/";
    }

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
    const token = JSON.parse(sessionStorage.getItem('token'));
    const [dashboardString, setDashboardString] = useState();
    const [dashboard, setDashboard] = useState(setDashboardType);
    const [send, setSend] = useState("Send");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [placeholder, setPlaceholder] = useState("Type your message here...");

    const [curr_user] = useState(sessionStorage.getItem('user_id'));
    const [lang, setLang] = useState(localStorage.getItem('lang'));
    // const [other_user, setOtherUser] = useState();
    const [chat, setChat] = useState([]);
    const [chat_original, setChatOriginal] = useState([]);
    const [current_lang, setCurrentLang] = useState(localStorage.getItem('lang'));

    // Initialize chat message with previous chats, set who is the other user.
    useEffect(
        () => {
            const curr_lang = localStorage.getItem('lang');

            fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id_chat": id_chat,
                "lang": curr_lang
            })
            }).then(data => data.json()
            ).then(data => {
                if (data.hasOwnProperty('error')) {
                    throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
                }
                else {
                    setChat([...chat, ...data]);
                    // setOtherUser(data.user2);
                }
            });
        }, []
    )

    const sendMessage = async (event) => { 
        // get message from input
        // post message to database
        // update chat display
        event.preventDefault();
        const message = document.getElementById("message-input").value;
        console.log(id_chat);
        console.log(message);
        fetch("http://127.0.0.1:8000/api/chat/send_message/",{
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id_chat": id_chat,
                "message": message
            })
        })
        .then(data => data.json()
        ).then(data => {
            if (data.hasOwnProperty('error')) {
                throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
            }
            else {
                setChat([...chat, data.message]);
            }
        });
    }

    // Retrieve current chat message list, and update with new messages
    const updateMessages = async () => {
        const curr_lang = localStorage.getItem('lang');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "id_chat": id_chat,
                "lang": curr_lang
            })
        }).then(data => data.json()
        ).then(data => {
            if (data.hasOwnProperty('error')) {
                throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
            }
            else {
                setChat([...chat, ...data]);
            }
        });
    }

    // Update chat messages in 500 milliseconds interval.
    useEffect(() => {
        setInterval(() => {
            updateMessages();
        }, 500);
    }, []);

    // State for checking initial translation.
    const [translated, setTranslated] = useState(0);

    // Translate message to the user's language.
    const translateMessage = useCallback((e) => {
        let curr_lang = localStorage.getItem('lang');

        if (curr_lang) {
            console.log(curr_lang);
            Translate('en', curr_lang, dashboard).then(response => setDashboardString(response));
            Translate('en', curr_lang, "Send").then(response => setSend(response));
            Translate('en', curr_lang, "Home").then(response => setHome(response));
            Translate('en', curr_lang, "Profile").then(response => setProfile(response));
            Translate('en', curr_lang, "Type your message here...").then(response => setPlaceholder(response));
        }

        setLang(localStorage.getItem('lang'));
    });
    
    useEffect(() => {
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        // Translate chat messages if user modifies language from the list.
        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });

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
                    <div className="chat-display">
                        {chat.map((message) => (
                            <div className="message">
                                { /* Display username */ }
                                { message.username === curr_user ? (
                                    <div className="message-username-right">
                                        {message.username}
                                    </div>
                                ) : (
                                    <div className="message-username-left">
                                        {message.username}
                                    </div>
                                )}
                                { message.username === curr_user ? (
                                    <div className="message-right">

                                        <div className="message-text-right">
                                            {message.text}
                                        </div>
                                        <div className="message-time-right">
                                            {message.timestamp}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message-left">
                                        <div className="message-text-left">
                                            {message.text}
                                        </div>
                                        <div className="message-time-left">
                                            {message.timestamp}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="chat-send">
                        <input type="text" id="message-input" placeholder={placeholder}/>
                        <Button id="send-button" onClick={sendMessage}>{send}</Button>
                    </div>
                </Card>
            </Card>
        </div>      
       
    );
}