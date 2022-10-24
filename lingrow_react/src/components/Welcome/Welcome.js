import React, { useState, useEffect }from 'react';
import { Card } from 'react-bootstrap';

export default function Welcome() {
    let [language_list, setList] = useState();
    let [language_selected, setLang] = useState();
    let [welcome, setWelcome] = useState("Welcome!");
    let [link, setLink] = useState("Login to LinGrow");
    let [API_KEY, setAPI] = useState('AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U');
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

    function translate(lang, query) {
        let result = "...";
        console.log("Target language: ", lang);
        console.log("Target message: ", query);
        
        let translateTextUrl = url + `?key=${API_KEY}`;
        let query_json = {
            "q": query,
            "target": lang
        }

        return fetch(translateTextUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query_json)
        }).then(data => data.json()
        ).then(data => {
            result = data.data.translations['0'].translatedText;
            console.log("Translate result: ", result);
            return result;
        }).catch(error => {
            console.log("Translation error: ", error);
        });
    }

    const handleChange = (e) => {
        e.preventDefault();
        setWelcome("..."); // Temporary message
        translate(e.target.value, "Welcome!").then(response => setWelcome(response));
        translate(e.target.value, "go to LinGrow").then(response => setLink(response));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    if (typeof language_list !== 'undefined') {
        return (
            <Card>
                <select className='form-control' data-testid='language_dropdown' onChange={handleChange}>
                    <option id="default_option" value="undefined" disabled>-- Select a language --</option>
                    {language_list.map((lang) => <option key={lang.language} value={lang.language}>{lang.name}</option>)}
                </select>
                <h2>{welcome}</h2>
                <a href="" data-testid="welcome_link" onClick={handleSubmit}>{link}</a>
            </Card>
        );
    }

}