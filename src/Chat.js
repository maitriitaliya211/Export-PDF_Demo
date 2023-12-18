import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    const [massage, setMassage] = useState();
    const latestChat = useRef(null);

    const Massagehandeler = (e) => {
        setMassage(e.target.value);
    };

    latestChat.current = chat;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://wsdev.groomwell.io/chat?useId=5')
            .withAutomaticReconnect()
            .build();
        console.log("newConnection", newConnection);
        setConnection(newConnection);
        if (newConnection) {
            newConnection.start()
                .then(result => {
                    console.log('Connected!');
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
                    Sender: 3,
                    Receiver: 2,
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
        </div>
    );
};

export default Chat;