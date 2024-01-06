import React, {useState, useEffect} from 'react'
import { fetchRules } from '../../../redux/slice/ruleSlice'
import { fetchCustomers } from '../../../redux/slice/customerSlice'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import FloatInput from '../../FloatInput/FloatInput'
import { Table } from 'antd'
import Popup from '../../Popup/Popup'
import Success from '../../Popup/Success'

import './receipt.css'

const ReceiptLayout = () => {
  const dispatch = useDispatch();
  const rules = useSelector(state => state.rules.rules);
  const customers = useSelector(state => state.customers.customers);

  const [infoCustomer, setInfo] = useState();
  const [customer_transaction_amount, setTransaction] = useState();

  const [bill, setBill] = useState();
  const [debtErr, setErr] = useState(null);

  const [isOpen, setOpen] = useState(false)


  const handleInputPhone = (dataInput) => {
    setPhone(dataInput);
    setErr(null);
  }

  const handleInputTransactionAmount = (dataInput) => {
    setTransaction(dataInput);
    setErr(null);
  }

  // const handleCheck = () => {
  //   if(phone && customer_transaction_amount){
  //     const check = customers.find(cus => cus.phone_no == phone)
  //     console.log("check: ", check)
  //     if(check){
  //       const IS_USE_PAYMENT_OVER_DEBT = rules.find(rule => rule.rule_name === "IS_USE_PAYMENT_OVER_DEBT");
  //       if(IS_USE_PAYMENT_OVER_DEBT.is_use){
  //         const balance = check.balance;
  //         if(customer_transaction_amount > Number(balance)){
  //           setErr({title: "Số tiền thu không vượt quá số tiền khách đang nợ", type: "error"})
  //           return
  //         }else{
  //           setOpen(true);
  //           setBill({
  //             customer_id: check.id,
  //             debt_no: check.debt_no,
  //             transaction_amount: customer_transaction_amount,
  //             transaction_date: Date.now()
  //           })
  //         }
  //       }
  //       if(!IS_USE_PAYMENT_OVER_DEBT.is_use){
  //         setOpen(true);
  //         setBill({
  //           customer_id: check.id,
  //           debt_no: check.debt_no,
  //           transaction_amount: customer_transaction_amount,
  //           transaction_date: Date.now()
  //         })
  //       }
  //     }
  //     if(!check){
  //       setErr({
  //         title: "Khách hàng không tồn tại",
  //         type: "error"
  //       })
  //     } 
  //   }
  // }

  const handleRowClick = (row) => {
    console.log("row: ", row);
    setInfo(row)
}


  const handleOpen = (value) => {
    setOpen(value)
  }

  useEffect(() => {
    if(infoCustomer){
      setOpen(true);
    }
  },[infoCustomer])

  useEffect(() => {
    dispatch(fetchRules());
  }, [])

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'stt',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_no',
      key: 'phone_no',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mã công nợ',
      dataIndex: 'debt_no',
      key: 'debt_no',
    },
    {
      title: 'Tiền nợ',
      dataIndex: 'balance',
      key: 'balance',
    },
  ];

  return (
    <>
    { isOpen && <Popup data={infoCustomer} handleOpen={handleOpen}/> }
    <div className={`receipt-layout  ${isOpen ? 'overlay' : ''} `}>
      <h1>Biên lai thu tiền</h1>
      <div className="input">
        <h3>Thông tin khách hàng</h3>
        {/* <FloatInput disable={false} handleDisable={() => false} className="input_debt_no" handleInput={handleInputPhone} label="Số điện thoại" placeholder="Số điện thoại" name="customer_phone" />
        <FloatInput disable={false} handleDisable={() => false} className="input_transaction_amount" handleInput={handleInputTransactionAmount} label="Số tiền thu" placeholder="Số tiền thu" name="customer_transaction_amount" />
        {debtErr && <div className={debtErr?.type}>{debtErr?.title}</div>}
        <button className='btnCheck' onClick={handleCheck}>Kiểm tra</button> */}
      </div>
      <Table columns={columns} dataSource={customers} 
            onRow={(row) => ({
              onClick: () => {handleRowClick(row)}
            })}  />
    </div>
    </>
  )
}

export default ReceiptLayout