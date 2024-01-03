import React, {useState, useEffect} from 'react'
import axios from 'axios'

import FloatInput from '../../FloatInput/FloatInput'
import Popup from '../../Popup/Popup'

import './receipt.css'

const ReceiptLayout = () => {
  const [customer_debt_no, setDebt] = useState();
  const [customer_transaction_amount, setTransaction] = useState();

  const [bill, setBill] = useState();
  const [debtErr, setErr] = useState(null);

  const [isOpen, setOpen] = useState(false)

  const handleInputDebtNo = (dataInput) => {
    setDebt(dataInput);
    setErr(null);
  }

  const handleInputTransactionAmount = (dataInput) => {
    setTransaction(dataInput);
    setErr(null);
  }

  const handleCheck = () => {
    console.log("debt: ", customer_debt_no)
    axios.get(`http://localhost:8080/api/v1/customers/debt-no/${customer_debt_no}`)
      .then(res => {
          const respon = res.data;
          if(respon.status_code == 404){
            setErr({
              title: "Mã công nợ không tồn tại",
              type: "error"
            })
          }else if(respon.status_code == 200){
            const balance = respon.data.balance;
            if(Number(balance) < Number(customer_transaction_amount)){
              setErr({
                title: "Số tiền thu không được quá số tiền khách đang nợ",
                type: "error"
              })
            }else{
              setBill({
                customer_id: respon.data.id,
                debt_no: customer_debt_no,
                transaction_amount: customer_transaction_amount,
                transaction_date: Date.now()
              })
              setOpen(true);
            }
          }})
      .catch(error => console.log(error));
  }

  const handleOpen = (value) => {
    setOpen(value)
  }


  return (
    <>
    { isOpen && <Popup data={bill} handleOpen={handleOpen}/> }
    <div className={`receipt-layout  ${isOpen ? 'overlay' : ''} `}>
      <h1>Biên lai thu tiền</h1>
      <div className="input">
        <h3>Thông tin khách hàng</h3>
        <FloatInput className="input_debt_no" handleInput={handleInputDebtNo} label="Mã công nợ" placeholder="Mã công nợ" name="customer_debt_no" />
        <FloatInput className="input_transaction_amount" handleInput={handleInputTransactionAmount} label="Số tiền thu" placeholder="Số tiền thu" name="customer_transaction_amount" />
        {debtErr && <div className={debtErr?.type}>{debtErr?.title}</div>}
        <button className='btnCheck' onClick={handleCheck}>Kiểm tra</button>
      </div>
    </div>
    </>
  )
}

export default ReceiptLayout