import {React, useEffect, useState} from 'react'
import { Card } from 'antd';

import axios from 'axios';

import './popup.css'

const { Meta } = Card;

const Popup = ({data, handleOpen}) => {
    const [infoBills, setInfo] = useState();

    const btnExitClick = () => {
        handleOpen(false);
    }

    useEffect(() => {
        let dataToServer = JSON.stringify(data);
        console.log("data to sv: ", dataToServer)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/api/v1/bills',
            headers:{
            'Content-Type': 'application/json'
            },
            data: dataToServer
        };

        axios.request(config)
        .then(res => {
            console.log(JSON.stringify(res.data));
            let info = {
                customer_name: res.data.data.customer_name,
                debt_no: res.data.data.debt_no,
                transaction_amount: res.data.data.transaction_amount
            }
            setInfo(info);
        })},[])

    return(
        <div className="popup">
            <Card className='card-popup' hoverable  title="Hoá đơn thu tiền">
                <div className="card-info">
                    <Meta title="Mã công nợ" description={data?.debt_no}/>
                    <Meta title="Số tiền thu" description={data?.transaction_amount}/>
                    <div className="options">
                        <button onClick={btnExitClick} className='btnExit'>Thoát</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Popup