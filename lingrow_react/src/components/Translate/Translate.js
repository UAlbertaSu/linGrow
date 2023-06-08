// Example translate call:
//
// // Setter for initial page translation.
// const [translated, setTranslated] = useState(0);
//
// const translateMessage = useCallback((e) => {
//     let lang = localStorage.getItem('lang');
//     if (lang) {
//         Translate('en', lang, "LinGrow Login").then(response => setHeader(response));
//         ...
//     }
// });
//
// useEffect(() => {
//     // Prevents page from being constantly translated.
//     if (!translated) {
//         translateMessage();
//         setTranslated(1);
//     }
//
//     window.addEventListener("New language set", translateMessage);
//     return () => window.removeEventListener("New language set", translateMessage);
// });

// Function for making translation requests.
export default async function Translate(source, lang, query) {
    let result = "...";
    let query_json = {
        "Text": query,
        "Target": lang,
        "Source": source
    }

    // Create request to the Django backend. This creates a promise object.
    let url = "http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/translate/";
    console.log("Query: ", query_json);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query_json)
    }).then(data => data.json()
    ).then(data => {
        console.log("Translate result: ", data);
        result = data;
        return result;
    }).catch(error => {
        console.log("Translation error: ", error);
    });
}