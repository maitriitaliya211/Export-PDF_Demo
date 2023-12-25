import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    console.log("chat", chat)
    const [massage, setMassage] = useState();
    const latestChat = useRef(null);

    const Massagehandeler = (e) => {
        setMassage(e.target.value);
    };

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://wsdev.groomwell.io/chat?userId=19')
            .withAutomaticReconnect()
            .build();
        console.log("newConnection", newConnection);
        setConnection(newConnection);
        if (newConnection) {
            newConnection.start()
                .then(result => {
                    console.log(newConnection.state);
                    console.log(newConnection.connectionId);
                    newConnection.on('ReceiveMessage', message => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);
                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }

    }, [])
    const SendMessage = async () => {
        if (connection._connectionStarted) {
            try {
                var data = {
                    Sender: 19,
                    Receiver: 20,
                    ProductId: 4,
                    Message: massage
                }
                console.log("massage", massage);
                await connection.send('SendMessageToUser', data);
                console.log("connection");

            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
        }
    }

    return (


        <div>
            <input
                type="text"
                id="message"
                name="message"
                onChange={Massagehandeler}
            />
            <br /><br />
            <button onClick={SendMessage}>Submit</button>
            <div>{chat}</div>
        </div>
    );
};

export default Chat;