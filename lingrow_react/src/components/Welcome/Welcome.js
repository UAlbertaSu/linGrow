import React, { ImageBackground,useState, useEffect, useCallback }from 'react';
import { Card } from 'react-bootstrap';
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import './Welcome.css';
import clouds from '../Img/clouds.png';


//a welcome page


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
    // Landing page that prompts user to select a language and then enter the website.
    return (
        <div className='bg'>
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>Welcome to LinGrow!</title>
            </Helmet>
                    <Card className="welcome">
                        <LanguageList />
                        <h2 id="welcome_msg">{welcome_msg}</h2>
                        <a href="" id="welcome_link" onClick={handleSubmit}>{link_msg}</a>
                    </Card>
        </div>
    );
}