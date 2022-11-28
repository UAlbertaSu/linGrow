// Check whether the current access token is valid.
export default async function Authenticate(token) {

    return fetch('http://127.0.0.1:8000/api/user/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(data => data.json()
    ).then(data => {
        if (data.hasOwnProperty("errors")) {
            sessionStorage.removeItem('token');
        }
        return data;
    }).catch(error => {
        console.log("Validation failed in Authenticate component: ", error);
    });
}