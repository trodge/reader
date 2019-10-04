import React from 'react';
import axios from 'axios';

const decrypt = require('./decrypt.js')

export default class Inbox extends React.Component {
    state = {
        messages: []
    }

    componentDidMount() {
        axios.get('http://localhost:8080/').then(response => {
            console.log('response.data:', response.data);
            this.setState({ messages: response.data }, () => decrypt());
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
