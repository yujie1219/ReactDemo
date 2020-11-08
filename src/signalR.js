import React from 'react';
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('')
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function stop() {
    try {
        await connection.stop();
        console.log("SignalR Disconnected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
}

let remoteData = [];

class remoteDataViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remoteData: []
        }
    }

    // 组件已经加载
    componentDidMount() {
        start();
    }

    // 组件即将结束加载
    componentWillUnmount() {
        stop();
    }
}