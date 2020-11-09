import React from 'react';
import * as signalR from '@microsoft/signalr';
import ReactEcharts from 'echarts-for-react';

const connection = new signalR.HubConnectionBuilder()
    .withUrl('http://10.190.177.161:7071/api')
    .configureLogging(signalR.LogLevel.Information)
    .build();
let remoteData = new Map();

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

class RemoteDataViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remoteData: remoteData
        }
        this.listenOnTemperature = this.listenOnTemperature.bind(this);
    }

    // 组件已经加载
    componentDidMount() {
        start();
        this.listenOnTemperature();
    }

    // 组件即将结束加载
    componentWillUnmount() {
        stop();
    }

    listenOnTemperature() {
        connection.on('Temperature', (data) => {
            console.log(data);
            const messageArray = JSON.parse(data.message);
            const deviceId = message.deviceId;
            let currentDeviceData = [];
            if (remoteData.has(deviceId)) {
                currentDeviceData = remoteData.get(deviceId);
            }
            messageArray.map(message => {
                currentDeviceData.push(message);
                return message;
            });
            remoteData.set(deviceId, currentDeviceData);

            this.setState({
                remoteData: remoteData.slice()
            })
        });
    }

    getOption() {
        const temperatures = [];
        const time = [];
        this.state.remoteData.map(message => {
            temperatures.push(message.temperature);
            const createDate = message.createTime.date;
            const createTime = message.createTime.time;
            const currenttime = createTime.hour + ':' + createTime.minute + ':' + createTime.second;
            time.push(currenttime);
            return message;
        })

        return {
            title: {
                text: '温度变化'
            },
            tooltip: {},
            legend: {
                data: ['温度']
            },
            xAxis: {
                data: time
            },
            yAxis: {},
            series: [{
                name: '温度',
                type: 'line',
                data: temperatures
            }]
        }
    }

    render() {
        return <ReactEcharts option={this.getOption()} />;
    }
}

export default RemoteDataViewer;