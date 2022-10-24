import { useEffect } from "react";

export default async function Translate(lang, query) {
    let API_KEY = 'AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U';
    let url = `https://translation.googleapis.com/language/translate/v2`;

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