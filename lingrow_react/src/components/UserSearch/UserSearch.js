import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import {Helmet} from 'react-helmet';

import LanguageList from '../Translate/LanguageList';
import Translate from '../Translate/Translate';
import logo from "../Img/blank_lingrow.png";
import DashNav from '../DashNav/DashNav';

//A user search component that allows users to search for certain users depending on user type

function UserSearch(){

    const loc = useLocation();
    const nav = useNavigate();

    const refUserSearch = useRef();

    const [selected, setSelected] = useState(loc.state !== null ? loc.state.user : []);
    const [searchString, setSearchString] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [userChoice, setUserChoice] = useState(1);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
    const [userType, setUserType] = useState(JSON.parse(sessionStorage.getItem('userType')));
    const [searchUserId, setSearchUserId] = useState("");

    const [tab_header, setTabHeader] = useState("LinGrow User Search");
    const [searchUserHeader, setSearchUserHeader] = useState("Search User");
    const [noUserFoundMessage, setNoUserFoundMessage] = useState("No User Found");
    const [searchBtn, setSearchBtn] = useState("Search");
    const [enterName, setEnterName] = useState("Enter name");
    const [parentLang, setParentLang] = useState("Parent");
    const [researcherLang, setResearcherLang]= useState("Researcher");
    const [teacherLang, setTeacherLang] = useState("Teacher");
   
    

    // update to the user type selection will update the search result. (Refresh)
    function changeHandler(event){
        
        event.preventDefault();

        setUserChoice(parseInt(event.target.value));
        setSearchResult([]);
        setSelected([]);
        
    }

    const selectListItem = (item) => {
        
        //const userId = item.user.id; 
        console.log(item.id);
        nav('/userprofile', {
            state: {userId : item.id}
        });
    }


    // Search user
    function searchHandler(){

        const userList = [];
       
        var enteredUserSearch = refUserSearch.current.value;
        
        if (enteredUserSearch !== '') {
            enteredUserSearch = enteredUserSearch +'/';
        }
        
        
        // if account is admin, search all users
        if (userType === 4){
            
            fetch(
                `http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/users/${enteredUserSearch}`,{
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                if(!searchResult.includes(item)){
                    userList.push(item);
                    console.log(userList);
                }
            })
        }).then(() => {
            setSearchResult([...userList]);
        })
        }

        //if search criteria is for parents, search only parents
        if (userChoice === 1){
          
            fetch(
                `http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/parents/${enteredUserSearch}`,{
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
        }).then(data => data.json()
        ).then(data => {
            
            data.map((item) => {
                if(!searchResult.includes(item)){
                    userList.push(item.user);
                    console.log(userList);
                }
            })
        }).then(() => {
            setSearchResult([...userList]);
        })
        }
         
        // if search criteria is for teachers, search only teachers
        if (userChoice === 2){
            let url = `http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/teachers/${enteredUserSearch}`;
            fetch(
                url,{
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                if(!searchResult.includes(item)){

                    userList.push(item.user);
                    console.log(userList);
                }
            })
        }).then(() => {
            setSearchResult([...userList]);
        })
        }

        // if search criteria is researchers, search only researchers
        if (userChoice === 3){
          
            fetch(
                `http://[2605:fd00:4:1001:f816:3eff:fe76:4a8a]/api/search/researchers/${enteredUserSearch}`,{
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
        }).then(data => data.json()
        ).then(data => {
            data.map((item) => {
                if(!searchResult.includes(item)){

                    userList.push(item.user);
                    console.log(userList);
                }
            })
        }).then(() => {
            setSearchResult([...userList]);
        })
        }
    }

    const [translated, setTranslated] = useState(0);

    const translateMessage = useCallback((e) => {
        let lang = localStorage.getItem('lang');
        if (lang) {
            Translate('en', lang, "LinGrow User Search").then((response) => setTabHeader(response));
            Translate('en', lang, "Search User").then(response => setSearchUserHeader(response));
            Translate('en', lang, "No User Found").then(response => setNoUserFoundMessage(response));
            Translate('en', lang, "Search").then(response => setSearchBtn(response));
            Translate('en', lang, "Enter name").then(response => setEnterName(response));
            Translate('en', lang, "Parent").then(response => setParentLang(response));
            Translate('en', lang, "Researcher").then(response => setResearcherLang(response));
            Translate('en', lang, "Teacher").then(response => setTeacherLang(response));
        }
    });

    useEffect(() => {
        // Prevents page from being constantly translated.
        if (!translated) {
            translateMessage();
            setTranslated(1);
        }

        window.addEventListener("New language set", translateMessage);
        return () => window.removeEventListener("New language set", translateMessage);
    });


    return(
        <div className='bg'>
            <img src={logo}  class="center" alt="Lingrow Logo" style={{marginTop:"10px",marginBottom:"20px", maxHeight:"350px", maxWidth:"350px"}}/>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tab_header}</title>
            </Helmet>
            <Card style={{paddingBottom:"10px", marginTop: "250px"}}>
                
                <LanguageList />
                <DashNav/>
                <Card className="title_card">
                    <h1>{searchUserHeader}</h1>
                </Card>
                <div>{userType !==4 ? <select defaultValue = {userChoice} onChange = {changeHandler}>
                        <option value = {1}>{parentLang}</option>
                        <option disabled = {userType > 2 ? false : true} value = {2}>{teacherLang}</option>
                        <option disabled = {userType > 3 ? false : true} value = {3}>{researcherLang}</option>
                    </select> : null  }
                </div>
                <input id ='searchUsername' type ='text' className = "form-control" placeholder = {enterName} ref = {refUserSearch} />
                <Button id ='searchstart' onClick = {searchHandler}>{searchBtn}</Button>

                <div style = {{display : 'block', width: 400, padding: 30 }}>
                    {
                        searchResult.length > 0 ?
                        <ListGroup>
                            {searchResult.map((elem) =>
                                <ListGroup.Item action active = {selected.includes(elem) ? true : false} onClick = {() => selectListItem(elem)} key = {elem.id} value = {elem}>
                                    {[elem.first_name, " ", elem.last_name]}
                                </ListGroup.Item>)}
                        </ListGroup>
                        :
                        <ListGroup>{<ListGroup.Item disabled >{noUserFoundMessage}</ListGroup.Item>}
                        </ListGroup>
                    }
                </div>
            </Card>
        </div>
        );

}

export default UserSearch;
