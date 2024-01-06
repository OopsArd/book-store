import {React, useEffect, useState} from 'react'
import { Card } from 'antd';
import { fetchRules } from '../../redux/slice/ruleSlice'
import { useSelector, useDispatch } from 'react-redux'
import FloatInput from '../FloatInput/FloatInput'
import Success from './Success'

import axios from 'axios';

import './popup.css'

const { Meta } = Card;

const Popup = ({data, handleOpen}) => {
    const dispatch = useDispatch();
    const rules = useSelector(state => state.rules.rules);
    const [transaction_amount, setTransaction] = useState();

    const [isAle, setIsAle] = useState(false);
    const [ale, setAle] = useState();
  
    const handleAle = (value) => {
      setIsAle(value)
    }
  
    useEffect(() => {
      if(ale){
        setIsAle(true)
      }
    },[ale])

    useEffect(() => {
        dispatch(fetchRules());
    }, [])

    const btnExitClick = () => {
        handleOpen(false);
    }

    const handleInputAmount = (value) => {
        setTransaction(value);
    }

    const btnCreateBills = () => {
        if(!transaction_amount){
            setAle({title: 'Chưa nhập số tiền thu', type: 'error'})
        }
        const IS_USE_PAYMENT_OVER_DEBT = rules.find(rule => rule.rule_name === "IS_USE_PAYMENT_OVER_DEBT");
        if(IS_USE_PAYMENT_OVER_DEBT.is_use){
            let balance = Number(data.balance);
            if(Number(transaction_amount) > balance){
                setAle({title: 'Số tiền thu vượt quá số tiền khách nợ', type: 'error'})
                return
            }
            let infoBill = {
                customer_id: data.id,
                debt_no: data.debt_no,
                transaction_amount: transaction_amount,
                transaction_date: Date.now()
            }
            let dataToServer = JSON.stringify(infoBill);
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
                if(res.data.status_code == 200)
                setAle({title: 'Giao dịch thành công', type: 'success'})
            })
        }
    }

    return(
        <>
        {isAle && <Success data={ale} handleOpen={handleAle} /> }
        <div className={`popup pu  ${isAle ? 'overlay' : ''} `}>
            <Card className='card-popup' hoverable  title="Tạo hoá đơn thu tiền">
                <div className="card-info">
                    <Meta title="Tên khách hàng" description={data?.full_name || ''}/>
                    <Meta title="Mã công nợ" description={data?.debt_no || ''}/>
                    <Meta title="Số điện thoại" description={data?.phone_no || ''}/>
                    <Meta title="Số tiền đang nợ" description={data?.balance + 'đ' || ''} />
                    <FloatInput width={'100%'} handleDisable={() => false} disable={false} handleInput={handleInputAmount} label="Số tiền thu" placeholder="Số tiền thu" name="trans_amount"/>
                    <div className="options-btn">
                        <button onClick={btnCreateBills} className='btnCreateBill'>Tạo hóa đơn</button>
                        <button onClick={btnExitClick} className='btnExit'>Thoát</button>
                    </div>
                </div>
            </Card>
        </div>
        </>
    );
}

export default Popup