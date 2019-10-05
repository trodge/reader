import React from 'react';
import axios from 'axios';

const decrypt = require('./decrypt.js');
const dec = new TextDecoder();

export default class Inbox extends React.Component {
    state = {
        messages: []
    }

    componentDidMount() {
        axios.get('https://contactee.herokuapp.com/').then(response => {
            const messages = response.data;
            decrypt(messages).then(({ promise, items, itemCount }) => {
                promise.then(buffers => {
                    buffers.forEach((buffer, i) => {
                        console.log(buffer, i);
                        const message = messages[Math.floor(i / itemCount)];
                        message[items[i % itemCount]] = dec.decode(buffer);
                    });
                    console.log(messages);
                    this.setState({ messages: messages });
                });

            });
        }).catch(error => {
            return error;
        });
    }

    render() {
        return (
            <section id="inbox">
                {this.state.messages.map((message, i) => (
                    <div id={`message-${i}`} key={i}>
                        <p>Name</p>
                        <p id={`${i}-name`} className="encrypted">{message.Name}</p>
                        <p>Email</p>
                        <p id={`${i}-email`} className="encrypted">{message.Email}</p>
                        <p>Text</p>
                        <p id={`${i}-text`} className="encrypted">{message.Text}</p>
                    </div>
                ))}

            </section>
        )
    }
}
