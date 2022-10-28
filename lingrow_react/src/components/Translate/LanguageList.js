import React, { useState, useEffect } from 'react';

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
            <select defaultValue={localStorage.getItem('lang')} className='form-select' data-testid='language_dropdown' onChange={handleChange} style={{margin:"20px"}}>
                {language_list.map((lang) => <option key={lang.language} value={lang.language}>{lang.name}</option>)}
            </select>
        );
    }
}