import { useState, useRef } from 'react';


function UserSearch({userType}){

    const userSearchRef = useRef();
    const [searchResult, setSearchResult] = useState('');

    function searchHandler(event){
        
        event.preventDefault();

        const enteredUser = userSearchRef.current.value;
        console.log(enteredUser);

        if (userType === 4){
            fetch(
                'http://127.0.0.1:8000/api/search/users/', {
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
                data => data.json()
            ).then(data => {
                setSearchResult(data);
            })
        }

        // if userType Teacher or Researcher 

        // if userType == parent.

        
    }

    return(
        <div>
            <div>
                <input type = 'text'  placeholder='Enter a User' ref = {userSearchRef}/>
                <button onClick ={searchHandler}>Search</button>
            </div> 
            <div>
                <p>{searchResult}</p>
            </div>
        </div>
        );

}

export default UserSearch;