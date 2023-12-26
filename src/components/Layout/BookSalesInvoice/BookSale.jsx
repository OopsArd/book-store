import {React, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import { Table } from 'antd'
import FloatInput from '../../FloatInput/FloatInput'
import BooksForm from '../../BooksForm/BooksForm'
import { fetchRules } from '../../../redux/slice/ruleSlice'

import './sale.css'

const BookSale = () => {
  const dispatch = useDispatch();
  const rules = useSelector(state => state.rules.rules);

  const [debtNo, setDebt] = useState();
  const [infoCustomer, setInfo] = useState();
  const [listBookInvoice, setList] = useState([]);
  const [debtErr, setErr] = useState(null);

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch])

  const handleInputDebtNo = (dataInput) => {
    setDebt(dataInput);
  }

  const handleListInvoice = (dataAdd) => {
    let dup = listBookInvoice?.some(book => book.title === dataAdd.title)
    if(dup){
      alert("Sách đã được thêm trước đó")
    }else{
      const dataBook = {
        ...dataAdd, 
        cost: (Number(dataAdd.quantity) * Number(dataAdd.price)) 
      }
      setList([...listBookInvoice, dataBook]);
    }
  }

  const handleCreate = () => {
    if(!infoCustomer){
      alert("Kiểm tra mã công nợ trước khi tạo hóa đơn")
      return
    }
    const list = listBookInvoice.map(book => {
      return {id: book.id, quantity: book.quantity }
    })
    let data = {
      customer_id: infoCustomer.id,
      debt_no: infoCustomer.debt_no,
      invoice_details: list
    };

    let dataInvoice = JSON.stringify(data);
    console.log("data POST: ", dataInvoice);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/v1/invoices',
      headers:{
        'Content-Type': 'application/json'
      },
      data: dataInvoice
    };

    axios.request(config)
    .then(res => {
      console.log(JSON.stringify(res.data));
      alert(res.data.message);
    })
  }

  const handleCheck = () => {
    axios.get(`http://localhost:8080/api/v1/customers/debt-no/${debtNo}`)
      .then(res => {
          const respon = res.data;
          if(respon.status_code == 404){
            setErr({
              title: "Mã công nợ không tồn tại",
              type: "error"
            })
          }else if(respon.status_code == 200){
            const RULE_DEBT_NO = rules.find(rule => rule.rule_name === "MAX_SELL_WITH_DEPT");
            console.log("RULE_DEBT_NO: ", RULE_DEBT_NO);
            const balance = respon.data.balance;
            if(balance >= Number(RULE_DEBT_NO.value)){
              setErr({
                title: "Công nợ quá 20.000",
                type: "error"
              })
            }else{
              let dataGet = {
                id: respon.data.id,
                debt_no: respon.data.debt_no,
              }
              setInfo(dataGet);
              setErr({
                title: "Khách hàng được phép mua hàng",
                type: "confirm"
              })
            }
          }  
      })
      .catch(error => console.log(error));
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'stt',
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thể loại',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'cost',
      key: 'cost',
    },
  ];

  return (
    <div className='sale-layout'>
      <h1>Hóa đơn bán sách</h1>
      <div className="input">
        <h3>Thông tin khách hàng</h3>
        <FloatInput className="input_debt_no" handleInput={handleInputDebtNo} label="Mã công nợ" placeholder="Mã công nợ" name="customer_debt_no" />
        {debtErr && <div className={debtErr?.type}>{debtErr?.title}</div>}
        <button className='btnCheck' onClick={handleCheck}>Kiểm tra</button>
      </div>
      <h3>Sách mua:</h3>
      <BooksForm title="INVOICE" handleBooks={handleListInvoice}/>
      <Table dataSource={listBookInvoice} columns={columns}  />
      <button onClick={handleCreate} className='btnCreate'>Tạo hóa đơn</button>
    </div>
  )
}

export default BookSale