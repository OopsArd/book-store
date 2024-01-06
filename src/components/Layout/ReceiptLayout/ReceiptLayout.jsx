import React, {useState, useEffect} from 'react'
import { fetchRules } from '../../../redux/slice/ruleSlice'
import { fetchCustomers } from '../../../redux/slice/customerSlice'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import FloatInput from '../../FloatInput/FloatInput'
import Popup from '../../Popup/Popup'
import Success from '../../Popup/Success'

import './receipt.css'

const ReceiptLayout = () => {
  const dispatch = useDispatch();
  const rules = useSelector(state => state.rules.rules);
  const customers = useSelector(state => state.customers.customers);

  const [phone, setPhone] = useState();
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

  const handleCheck = () => {
    if(phone && customer_transaction_amount){
      const check = customers.find(cus => cus.phone_no == phone)
      console.log("check: ", check)
      if(check){
        const IS_USE_PAYMENT_OVER_DEBT = rules.find(rule => rule.rule_name === "IS_USE_PAYMENT_OVER_DEBT");
        if(IS_USE_PAYMENT_OVER_DEBT.is_use){
          const balance = check.balance;
          if(customer_transaction_amount > Number(balance)){
            setErr({title: "Số tiền thu không vượt quá số tiền khách đang nợ", type: "error"})
            return
          }else{
            setOpen(true);
            setBill({
              customer_id: check.id,
              debt_no: check.debt_no,
              transaction_amount: customer_transaction_amount,
              transaction_date: Date.now()
            })
          }
        }
        if(!IS_USE_PAYMENT_OVER_DEBT.is_use){
          setOpen(true);
          setBill({
            customer_id: check.id,
            debt_no: check.debt_no,
            transaction_amount: customer_transaction_amount,
            transaction_date: Date.now()
          })
        }
      }
      if(!check){
        setErr({
          title: "Khách hàng không tồn tại",
          type: "error"
        })
      } 
    }
  }


  const handleOpen = (value) => {
    setOpen(value)
  }

  useEffect(() => {
    if(bill){
      setOpen(true);
    }
  },[bill])

  useEffect(() => {
    dispatch(fetchRules());
  }, [])

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [])


  return (
    <>
    { isOpen && <Popup data={bill} handleOpen={handleOpen}/> }
    <div className={`receipt-layout  ${isOpen ? 'overlay' : ''} `}>
      <h1>Biên lai thu tiền</h1>
      <div className="input">
        <h3>Thông tin khách hàng</h3>
        <FloatInput disable={false} handleDisable={() => false} className="input_debt_no" handleInput={handleInputPhone} label="Số điện thoại" placeholder="Số điện thoại" name="customer_phone" />
        <FloatInput disable={false} handleDisable={() => false} className="input_transaction_amount" handleInput={handleInputTransactionAmount} label="Số tiền thu" placeholder="Số tiền thu" name="customer_transaction_amount" />
        {debtErr && <div className={debtErr?.type}>{debtErr?.title}</div>}
        <button className='btnCheck' onClick={handleCheck}>Kiểm tra</button>
      </div>
    </div>
    </>
  )
}

export default ReceiptLayout