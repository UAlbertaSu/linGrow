import { useRef, useEffect, useState } from 'react';

import './Chat.css';
import ChatDisplay from './ChatDisplay';

import Validation from '../Validation/Validation';


    // write message and post it to display + database
    // should know who is sending it aka validate which user is logged in
    // knows who it sends it to
    // should be able to send it to multiple people **** (IF THERE IS TIME)

function Chat() {

    const [sender, setSender] = useState();
    const [receiver, setReceiver] = useState();
    const messageInputRef = useRef();

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token').includes("error")) {
            nav("/");
        }

    }, []);

    

    function submitHandler(){
        
        //const enteredMessage = messageInputRef.current.value;
       // console.log(enteredMessage);

       fetch('http://127.0.0.1:8000/api/messages',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
       }).then(response => {
              return response.json();
       }).catch(error => {
            console.log(error);
       })
    }

    return (

        
            
           <div>
                <ChatDisplay />
                <textarea  maxLength={1200} placeholder = 'Enter Message Here' ref = {messageInputRef}></textarea>
                <button className = 'submitBtn' onClick = {submitHandler}>Send</button>
            </div>
       
    );
}

export default Chat;




