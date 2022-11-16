import { useState, useEffect } from 'react';

function ChatDisplay() {


    const [loadedMessages, setLoadedMessages] = useState([]);

    useEffect(() => {
       
        // get details from Kash 
        fetch(
            'http://127.0.0.1:8000/').then(response => {
                return response.json();
            }).then(data =>{

                const messages = [];
                //Need to find out how message API works
                got(const message in data){
                    const message = {
                        id: message.id,
                        ...data[message]
                    };
                    messages.push(message);
                }
                
                setLoadedMessages(messages);
            })
    })

    //Need to find proper syntax. 
    return (
        <div>
            <h1>Who they are messaging</h1>
            <ul>
                
                {LoadedMessages}
            </ul>
        </div>
    );
}   

export default ChatDisplay;