import {React, useEffect, useState} from 'react'
import { Card } from 'antd';

import axios from 'axios';

import './popup.css'

const { Meta } = Card;

const Popup = ({data, handleOpen}) => {
    const [info, setInfo] = useState();

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
                transaction_amount: res.data.data.transaction_amount,
                mess: res.data.message
            }
            setInfo(info);
        })},[])

    return(
        <div className="popup">
            <Card className='card-popup' hoverable  title="Hoá đơn thu tiền">
                <div className="card-info">
                    {info && <Meta title="Tên khách hàng" description={info?.customer_name}/>}
                    {info && <Meta title="Mã công nợ" description={info?.debt_no}/>}
                    {info && <Meta title="Số tiền thu" description={info?.transaction_amount}/>}
                    {info && <Meta title="Mesage" description={info?.mess}/>}
                    <div className="options">
                        <button onClick={btnExitClick} className='btnExit'>Thoát</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Popup