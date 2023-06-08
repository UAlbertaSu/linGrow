import { useEffect } from 'react';
function Inbox() {

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }
    }, []);
}

export default Inbox;