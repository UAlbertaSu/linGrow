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
    let url = "http://127.0.0.1:8000/api/translate/";

    let result = "...";
    let query_json = {
        "Text": query,
        "Target": lang
    }

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