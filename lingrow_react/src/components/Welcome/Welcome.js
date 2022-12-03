import React, { useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import clouds from '../Img/clouds.png';

import './Welcome.css';

export default function Welcome() {

    let [welcome_msg, setWelcome] = useState("Hello!");
    let [link_msg, setLink] = useState("Enter Website");

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.reload();
    }

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        if (localStorage.getItem('lang')) {
            Translate('en', localStorage.getItem('lang'), "Hello!").then(response => setWelcome(response));
            Translate('en', localStorage.getItem('lang'), "Enter Website").then(response => setLink(response));
        }
        else {
            localStorage.setItem('lang', 'en');
        }
    });

    useEffect(() => {
        const keyDownHandler = event => {
          console.log('User pressed: ', event.key);
    
          if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(event);
          }
        };
    
        window.addEventListener('keydown', keyDownHandler);
    
        return () => {
          window.removeEventListener('keydown', keyDownHandler);
        };
      }, []
    );

    useEffect(() => {
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });
    
    return (
<<<<<<< HEAD
        <div>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>Welcome to linGrow-A Multilingual Families Lab</title>
            </Helmet>
            <Card className="bg-light" style={{left:"0%",width:"100%", height:"100%", borderRadius:"0px"}}>
                    <Card className="welcome">
                        <LanguageList />
                        <h2 id="welcome_msg">{welcome_msg}</h2>
                        <a href="" id="welcome_link" onClick={handleSubmit}>{link_msg}</a>
                    </Card>
            </Card>
        </div>
=======
        <Card className="background_cloud_card">
            <Card.Img src={clouds} alt="Cloud Background" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
            <Card.ImgOverlay>
                <Card className="welcome">
                    <LanguageList />
                    <h2 id="welcome_msg" style={{marginTop:"10px"}}>{welcome_msg}</h2>
                    <a href="" id="welcome_link" onClick={handleSubmit}>{link_msg}</a>
                </Card>
            </Card.ImgOverlay>
        </Card>
>>>>>>> 4f87513d655a0599306c4dae0e91b8b8031afe6d
    );
}