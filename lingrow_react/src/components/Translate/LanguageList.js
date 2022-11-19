import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import LANGUAGES_LIST from './LanguageCode';

import globe_icon from "../Img/globe_icon.png";

// Checks whether language exists in the LANGUAGE_LIST defined in LanguageCode.js.
function validate(code) {
    return LANGUAGES_LIST.hasOwnProperty(code);
}

// Returns endonym is language code is defined. Otherwise return English name defined by Google.
function getNativeName(code, non_native_name) {
    return validate(code) ? LANGUAGES_LIST[code].nativeName : non_native_name;
}

// Creates dropdown menu used for other components of frontend.
export default function LanguageList() {
    let [language_list, setList] = useState();

    // Make request to the Django backend for language list retrieval.
    let url = "http://127.0.0.1:8000/api/translate/";
    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => data.json()
        ).then(data => {
            setList(data.data.languages);
            console.log("Response from google: ", data.data.languages);
        }).catch(error => {
            console.log("Error caught: ", error);
        })
    }, []);

    // Sets language in local storage and dispatches event to other components.
    const handleChange = (e) => {
        console.log("New target language: ", e.target.value);
        localStorage.setItem('lang', e.target.value);
        dispatchEvent(new Event("New language set"));
    }

    // Return the language dropdown list iff language is defined.
    if (typeof language_list !== "undefined") {
        return (
            <Card style={{position:"relative", height:"50px", width:"fit-content", flexDirection:"row", left:"0%", backgroundColor:"lightblue", margin:"10px"}}>
                <img src={globe_icon} height="30px" width="30px" style={{margin:"5px -15px 5px 5px"}}></img>
                <select defaultValue={localStorage.getItem('lang')} className='form-select' id='language_dropdown' onChange={handleChange} style={{margin:"20px"}}>
                    {language_list.map((lang) => <option key={lang.language} value={lang.language}>{getNativeName(lang.language, lang.name)}</option>)}
                </select>
            </Card>
        );
    }
}