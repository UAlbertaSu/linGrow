import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Chat.css';
import { Button, Card, ListGroup, Nav, NavDropdown, Container, Navbar} from 'react-bootstrap';
import LanguageList from '../Translate/LanguageList';
import { Helmet } from 'react-helmet';
import Translate from '../Translate/Translate';
import logo from "../Img/lingrow.png";
import home_icon from "../Img/home_icon.png";
import user_icon from "../Img/user_icon.png";

export default function DirectChat() {
    const nav = useNavigate();
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
    const token = JSON.parse(sessionStorage.getItem('token'));
    const [members, setMembers] = useState([]);
    const [viewChat] = useState('View Chat');
    // const [chat_name, setChatName] = useState("");
    console.log(token);
    useEffect(
        () => {
            fetch('http://127.0.0.1:8000/api/chat/new_chat/', {
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
                    setMembers([...members,...data]);

                }
            });
        }, []
    )
    const createChatFunc = (email) => {
        // console.log(id_chat);
        console.log("HERE")
        fetch('http://127.0.0.1:8000/api/chat/create_chat/', {
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
        // sessionStorage.setItem('id_chat', JSON.stringify(id_chat));
        // nav('/viewchat');

    }
    return (
        <Card style={{minHeight: "fit-content"}}>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>LinGrow Chat Creation</title>
            </Helmet>
            <LanguageList />
            <div style={{ display: 'block', width: 400, padding: 30 }}>
                <ListGroup>
                    {members.map((elem) => 
                        <ListGroup.Item action key={elem} value={elem} onClick={() => {createChatFunc(elem.email)}}>
                            {`${elem.email}`}
                        </ListGroup.Item>)}
                </ListGroup>
            </div>
        </Card>
    );
}