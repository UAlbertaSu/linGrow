import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import { Card, Button, Nav, Container, Navbar} from 'react-bootstrap';
import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";
import { Helmet } from 'react-helmet';

export default function Chat() {
    const bottomRef = useRef();
    const nav = useNavigate();

    // Retrieve token from the sessionStorage.
    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }

    }, []);

    // State variables.
    const userType = JSON.parse(sessionStorage.getItem('userType'));
    const id_chat = JSON.parse(sessionStorage.getItem('id_chat'));
    const chat_type = JSON.parse(sessionStorage.getItem('chat_type'));
    var url = "http://127.0.0.1:8000/api/chat/get_private_chat_messages/";
    if (chat_type === "group") {
        url = "http://127.0.0.1:8000/api/chat/get_group_chat_messages/";
    }
    const token = JSON.parse(sessionStorage.getItem('token'));

    const [tab_header, setTabHeader] = useState("LinGrow Chat");
    const [pdashboard, setPDashboard] = useState("LinGrow Parent Dashboard");
    const [tdashboard, setTDashboard] = useState("LinGrow Teacher Dashboard");
    const [rdashboard, setRDashboard] = useState("LinGrow Researcher Dashboard");
    const [adashboard, setADashboard] = useState("LinGrow Admin Dashboard");
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [send, setSend] = useState("Send");
    const [placeholder, setPlaceholder] = useState("Type your message here...");
    const [curr_user] = useState(sessionStorage.getItem('user_id'));
    const [lang, setLang] = useState(localStorage.getItem('lang'));
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatRef, setChatRef] = useState([]);

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
                }
            });
        }, []
    )

    // 
    const sendMessage = async (event) => { 
        event.preventDefault();
        setLoading(true);
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
                setChatRef([...chatRef, ...data]);
            }
        }).then(() => {
            setLoading(false);
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

    // If the chat is updated, then scroll to the bottom of the chat.
    useEffect(() => {
        if (chatRef.length !== chat.length) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
            setChatRef(chat);
        }
    }, [chat]);

    // State for checking initial translation.
    const [translated, setTranslated] = useState(0);

    // Translate message to the user's language.
    const translateMessage = useCallback((e) => {
        let curr_lang = localStorage.getItem('lang');

        if (curr_lang) {
            console.log(curr_lang);
            Translate('en', lang, "LinGrow Chat").then((response) => setTabHeader(response));
            Translate('en', lang, 'LinGrow Parent Dashboard').then((response) => setPDashboard(response));
            Translate('en', lang, 'LinGrow Teacher Dashboard').then((response) => setTDashboard(response));
            Translate('en', lang, 'LinGrow Researcher Dashboard').then((response) => setRDashboard(response));
            Translate('en', lang, 'LinGrow Admin Dashboard').then((response) => setADashboard(response));
            Translate('en', lang, "Home").then(response => setHome(response));
            Translate('en', lang, "Profile").then(response => setProfile(response));
            Translate('en', curr_lang, "Send").then(response => setSend(response));
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

    // page that lets a user view a previously selected chat, and send messages within the chat
    return (
        <div className="bg">
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"15px"}}>
                <a href="https://bilingualacquisition.ca/"><img src={logo}  class="rounded img-fluid" alt="Lingrow Logo" style={{marginTop:"20px",marginBottom:"20px", maxHeight:"250px"}}/></a>
                <LanguageList />
                <Navbar bg="light" expand="lg" style={{width:"94%", margin: "20px 0px 10px 0px", borderRadius: "5px"}}>
                    <Container>
                        <div>{userType === 1 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{pdashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 2 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{tdashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 3 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{rdashboard}</Navbar.Brand> : null}</div>
                        <div>{userType === 4 ? <Navbar.Brand style={{fontWeight:"bold",fontSize:"22px",margin:"10px 50px 10px 20px"}}>{adashboard}</Navbar.Brand> : null}</div>
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
                                {
                            loading ? 
                            (<div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>) 
                            : 
                            (<div>
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
                                        { /* Display message with timestamp */ }
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
                            )}
                            { /* Reference to the bottom of the chat box */}
                            <div ref={bottomRef} />
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