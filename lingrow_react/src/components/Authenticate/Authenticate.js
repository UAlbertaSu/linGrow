// Check whether the current access token is valid.
export default async function Authenticate(token) {

    return fetch('http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/user/profile/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(data => data.json()
    ).then(data => {
        if (data.hasOwnProperty("errors")) {
            sessionStorage.removeItem('token');
        }
        sessionStorage.setItem('userType', data.user.user_type);
        sessionStorage.setItem('user_id', data.user.email);
        return data;
    }).catch(error => {
        console.log("Validation failed in Authenticate component: ", error);
    });
}