// Example translate call:
//
// // Setter for initial page translation.
// const [translated, setTranslated] = useState(0);

// const translateMessage = useCallback((e) => {
//     let lang = localStorage.getItem('lang');
//     if (lang) {
//         Translate(lang, "LinGrow Login").then(response => setHeader(response));
//         Translate(lang, "Email address").then(response => setEmailMsg(response));
//         Translate(lang, "Password").then(response => setPassMsg(response));
//         Translate(lang, "Login").then(response => setLoginBtn(response));
//         Translate(lang, "Signup").then(response => setSignupBtn(response));
//         Translate(lang, "Invalid email or password").then(response => setErrorMsg(response));
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

export default async function Translate(lang, query) {
    let API_KEY = 'AIzaSyC1UIimGmDHQfFesxsum3ifUObJuQo-W6U';
    let url = "https://translation.googleapis.com/language/translate/v2";

    let result = "...";
    let translateTextUrl = url + "?key=" + API_KEY + "&format=text";
    let query_json = {
        "q": query,
        "target": lang
    }

    console.log("Query: ", query_json);
    return fetch(translateTextUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query_json)
    }).then(data => data.json()
    ).then(data => {
        result = data.data.translations['0'].translatedText;
        // console.log("Translate result: ", result);
        return result;
    }).catch(error => {
        // console.log("Translation error: ", error);
    });
}