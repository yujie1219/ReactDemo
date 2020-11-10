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
            // console.log(data);
            const messageArray = JSON.parse(data.message);
            messageArray.map(message => {
                const deviceId = message.deviceId;
                let currentDeviceData = [];
                if (remoteData.has(deviceId)) {
                    currentDeviceData = remoteData.get(deviceId);
                }
                currentDeviceData.push(message);
                remoteData.set(deviceId, currentDeviceData);
                return message;
            });

            this.setState({
                remoteData: new Map(remoteData)
            })
        });
    }

    getOption() {
        const legends = Array.from(this.state.remoteData.keys());
        const series = [];
        Array.from(this.state.remoteData.keys()).map((key, index) => {
            const deviceDatas = this.state.remoteData.get(key);
            const temperatures = [];
            deviceDatas.map(deviceData => {
                const createDate = deviceData.createTime.date;
                const createTime = deviceData.createTime.time;
                const formattedDate = new Date(createDate.year + '-' + createDate.month + '-' + createDate.day + ' ' + createTime.hour + ':' + createTime.minute + ':' + createTime.second);
                temperatures.push([formattedDate.getTime(), deviceData.temperature]);
                return deviceData;
            })
            series.push({
                name: key,
                type: 'line',
                showSymbol: false,
                smooth: true,
                hoverAnimation: false,
                data: temperatures
            });
            return (key, index);
        });


        return {
            title: {
                text: '温度监控'
            },
            tooltip: {
                trigger: 'axis',
                // formatter: function (params) {
                //     params.map(param => {
                //         console.log(param);
                //     })
                // }
            },
            legend: {
                data: legends
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: series
        }
    }

    render() {
        return <ReactEcharts option={this.getOption()} />;
    }
}

export default RemoteDataViewer;