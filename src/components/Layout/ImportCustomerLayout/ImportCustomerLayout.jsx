import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCustomers, addCustomer } from '../../../redux/slice/customerSlice'
import axios from 'axios'
import FloatInput from '../../FloatInput/FloatInput'
import Success from '../../Popup/Success'

import './cus.css'

const ImportCustomerLayout = ({handleOpen, getNewCus}) => {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.customers);
  const [err, setErr] = useState();

  const [fullName, setName] = useState();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState('');

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
    dispatch(fetchCustomers());
  }, [dispatch])

  const handleInputName = (value) => {
    setName(value)
  } 
  const handleInputPhone = (value) => {
    setPhone(value)
  } 
  const handleInputEmail = (value) => {
    setEmail(value)
  } 
  const handleInputAddress = (value) => {
    setAddress(value)
  } 

  const handleClickAdd = () => {
    if(!fullName){
      setErr({
        title: "Nhập tên khách hàng",
        type: "error"
      })
      return
    }
    if(!phone){
      setErr({
        title: "Nhập số điện thoại",
        type: "error"
      })
      return
    }
    const check = customers.find(cus => cus.phone_no === String(phone))
    if(check){
      setErr({
        title: "Số điện thoại đã được đăng kí",
        type: "error"
      })
      return
    }
    let c = {
      full_name: fullName,
      address: address,
      phone_no: phone,
      email: email
    }
    dispatch(addCustomer(c));
    getNewCus(c);
    setAle({title: "Thêm thông tin khách hàng thành công", type: 'success'});
    handleOpen(false);
  }

  const handleClickOut = () => {
    handleOpen(false)
  }




  return (
    <>
      {isAle && <Success data={ale} handleOpen={handleAle} /> }
      <div className={`customer-popup  ${isAle ? 'overlay' : ''} `}>
      <div className="card-popup">
        <h1>Thông Tin Khách Hàng</h1>
        <FloatInput  className="input_debt_no" handleInput={handleInputName} label="Họ và tên" placeholder="Họ và tên" name="customer_full_name" disable={false} handleDisable={() => false} required={true}/>
        <FloatInput  className="input_debt_no" handleInput={handleInputPhone} label="Số điện thoại" type="tel" placeholder="Số điện thoại" name="customer_phone_no" disable={false} handleDisable={() => false} required={true}/>
        <FloatInput  className="input_debt_no" handleInput={handleInputEmail} label="Email" type="email" placeholder="Email" name="customer_email" disable={false} handleDisable={() => false}/>
        <FloatInput  className="input_debt_no" handleInput={handleInputAddress} label="Địa chỉ" placeholder="Địa chỉ" name="customer_address" disable={false} handleDisable={() => false}/>
        { err && <div className={err?.type}>{err?.title}</div>}
        <div className="btnGr">
          <button  onClick={handleClickAdd} className='btnDone'>Xác nhận</button>
          <button onClick={handleClickOut} className='btnExit'>Thoát</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ImportCustomerLayout