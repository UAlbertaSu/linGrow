import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import globe_icon from "../Img/globe_icon.png";

export default function LanguageList() {
    let [language_list, setList] = useState();

    let API_KEY = 'AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U';
    let url = `https://translation.googleapis.com/language/translate/v2`;
    
    useEffect(() => {
        let fetchUrl = url + `/languages` + `?key=${API_KEY}` + `&target=en`;

        fetch(fetchUrl, {
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

    const handleChange = (e) => {
        console.log("New target language: ", e.target.value);
        localStorage.setItem('lang', e.target.value);
        dispatchEvent(new Event("New language set"));
    }

    if (typeof language_list !== "undefined") {
        return (
            <Card style={{position:"relative", height:"50px", width:"fit-content", flexDirection:"row", left:"0%", backgroundColor:"lightblue", margin:"10px"}}>
                <img src={globe_icon} height="30px" width="30px" style={{margin:"5px -15px 5px 5px"}}></img>
                <select defaultValue={localStorage.getItem('lang')} className='form-select' id='language_dropdown' onChange={handleChange} style={{margin:"20px"}}>
                    {language_list.map((lang) => <option key={lang.language} value={lang.language}>{lang.name}</option>)}
                </select>
            </Card>
        );
    }
}