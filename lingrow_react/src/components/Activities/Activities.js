import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';

import { Helmet } from 'react-helmet';
import logo from "../Img/blank_lingrow.png";
import './Activities.css';


// a page that displays all the language development activities
// it only redirects to the google page for now, and will redirect to the main activities page at
// https://bilingualacquisition.ca/covid-19-multilingual-families-talking-and-playing/ 

export default function Activities() {
    const nav = useNavigate();
    // Original phrases to be translated by translator, if not present translations become static
    const [tab_header, setTabHeader] = useState("LinGrow Activities");
    const [activities, setActivities] = useState("Language Learning Activities");
    const [activity1, setActivity1] = useState("Kitchen Activities");
    const [activity2, setActivity2] = useState("Bath Activities");
    const [activityPlus, setMoreActivities] = useState("More Activities");
    const [homepage, setHome] = useState("Homepage");
    

    // Setter for initial page translation.
    const [translated, setTranslated] = useState(0);
    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow Activities").then((response) => setTabHeader(response));
            Translate('en', lang, "Language Learning Activities").then(response => setActivities(response));
            Translate('en', lang, "Kitchen Activities").then(response => setActivity1(response));
            Translate('en', lang, "Bath Activities").then(response => setActivity2(response));
            Translate('en', lang, "More Activities").then(response => setMoreActivities(response));
            Translate('en', lang, "Homepage").then(response => setHome(response));
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
    // Helmet block creates tab headers, which are translatable
    return (
        <div className='bg'>
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                <Helmet>
                        <meta charSet="utf-8" />
                        <title>{tab_header}</title>
                </Helmet>
                <a href="https://bilingualacquisition.ca/"></a>
                <LanguageList />
                <h1>{activities}</h1>
                <Card className='bg-light' style={{position:"relative", left:"0%", marginBottom:"15px", width:"94%", padding:"25px"}}>
                <Button href="https://drive.google.com/drive/folders/1h4pmfp66la3ZBpEIwcfHb7TEY5QbUgOj" id="activity_btn_1" style={{minWidth:"150px"}}>{activity1}</Button>
                <Button href="https://drive.google.com/drive/folders/1Pbaax2cLWvOSO8sY2Lm8by0lE0G8njRJ" id="activity_btn_2" style={{minWidth:"150px"}}>{activity2}</Button>
                <Button href = "https://bilingualacquisition.ca/covid-19-multilingual-families-talking-and-playing/" id = "more_activities" style={{minWidth:"150px"}}>{activityPlus}</Button>
                <Button variant="secondary" href="dashboard" id="activity_btn_3" style={{minWidth:"150px"}}>{homepage}</Button>
                </Card>
            </Card>
        </div>
    )
}