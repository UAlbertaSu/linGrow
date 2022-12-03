import { useRef, useEffect, useState } from 'react';
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
    const id_chat = JSON.parse(sessionStorage.getItem('id_chat'));
    const chat_type = JSON.parse(sessionStorage.getItem('chat_type'));
    var url = "http://127.0.0.1:8000/api/chat/private_chat/";
    if (chat_type === "group") {
        url = "http://127.0.0.1:8000/api/chat/group_chat_page/"
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
    const [dashboardString, setDashboardString] = useState(setDashboardType);
    const [home, setHome] = useState("Home");
    const [profile, setProfile] = useState("Profile");
    const [other_user, setOtherUser] = useState();
    const [chat, setChat] = useState([]);


    useEffect(
        () => {
            fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id_chat": id_chat
            })
            }).then(data => data.json()
            ).then(data => {
                if (data.hasOwnProperty('error')) {
                    throw Error("Failed to retrieve user due to invalid login credentials or database request error.");
                }
                else {
                    setChat([...chat,...data.messages]);
                    setOtherUser(data.user2);

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
                setChat([...chat,data.message]);
            }
        });
    }
    

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
                            <Nav.Link href="#home" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px"}}>{home}</Nav.Link>
                            <img src={user_icon} height="30px" width="30px" style={{marginTop:"15px",marginBottom:"15px"}}></img>
                            <Nav.Link href="userinfoadmin" style={{fontWeight:"bold", marginTop:"10px", marginRight:"40px", border:""}}>{profile}</Nav.Link>
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                    {/* Display chat messages */}
                    <div className="chat-display">
                        {chat.map((message) => (
                            <div className="message">
                                <div className="message-sender">{message.sender.email}</div>
                                <div className="message-content">{message.text}</div>
                            </div>
                        ))}
                    </div>
                    {/* Send message */}
                    <div className="chat-send">
                        <input type="text" id="message-input" placeholder="Type your message here..."/>
                        <button id="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </Card>
            </Card>
        </div>      
       
    );
}