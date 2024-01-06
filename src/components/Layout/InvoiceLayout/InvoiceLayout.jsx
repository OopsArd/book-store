import {React, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

import {
  UserAddOutlined,
} from '@ant-design/icons';

import { Table } from 'antd'
import FloatInput from '../../FloatInput/FloatInput'
import BooksForm from '../../BooksForm/BooksForm'
import { fetchRules } from '../../../redux/slice/ruleSlice'
import { fetchCustomers, addCustomer } from '../../../redux/slice/customerSlice'
import { fetchBooks } from '../../../redux/slice/bookSlice'
import ImportCustomerLayout from '../ImportCustomerLayout/ImportCustomerLayout'
import Success from '../../Popup/Success';

import './invoice.css'

const InvoiceLayout = () => {
  const dispatch = useDispatch();
  const rules = useSelector(state => state.rules.rules);
  const customers = useSelector(state => state.customers.customers);
  const books = useSelector(state => state.books.books);

  const [phoneNo, setPhone] = useState();
  const [infoCustomer, setInfo] = useState();
  const [listBookInvoice, setList] = useState([]);
  const [debtErr, setErr] = useState(null);

  const [isRuleDebtNo, setRuleDebtNo] = useState(null);

  const [isOpen, setOpen] = useState(false);
  const [load, setLoad] = useState(false);

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
    if(rules.length > 0){
      const RULE_DEBT_NO = rules.find(rule => rule.rule_name === "MAX_SELL_WITH_DEPT");
      let ru = {value: RULE_DEBT_NO.value, is_use: RULE_DEBT_NO.is_use, description: RULE_DEBT_NO.description};
      setRuleDebtNo(ru)
    }
  },[rules])

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch])

  const handleInputPhoneNo = (dataInput) => {
    setPhone(dataInput);
  }

  const handleListInvoice = (dataAdd) => {
    let dup = listBookInvoice?.some(book => book.title === dataAdd.title)
    if(dup){
      setAle({title: "Sách đã được thêm trước đó", type: 'error'})
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
      setAle({title: "Kiểm tra thông tin khách hàng trước khi tạo hóa đơn", type: 'error'})
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
      setAle({title: 'hóa đơn đã được tạo thành công', type: 'success'});
    })
  }

  const handleCheck = () => {
    const check = customers.find(cus => cus.phone_no == phoneNo)
    console.log("check cus: ", check);
    if(check){
      if(isRuleDebtNo.is_use == 'true'){
        const balance = check.balance;
        if(balance >= Number(isRuleDebtNo.value)){
          setErr({
            title: `Công nợ quá ${isRuleDebtNo.value}`,
            type: "error"
          })
          return
        }
        setInfo({
          customer_id: check.id,
          debt_no: check.debt_no
        })
        setErr({
          title: "Khách hàng được phép mua hàng",
          type: "confirm"
        })
        return
      }
      setInfo({
        customer_id: check.id,
        debt_no: check.debt_no
      })
      setErr({
        title: "Khách hàng được phép mua hàng",
        type: "confirm"
      })
    }
    if(!check){
      setErr({
        title: "Chưa có khách hàng này",
        type: "error"
      })
    }
  }

  const addCustomerClick = () => {
    setOpen(true)
  }

  const handleOpen = (value) => {
    setOpen(value)
  }

  const getNewPhone = (value) => {
    dispatch(addCustomer(value));
    setPhone(value)
    setLoad(true);
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
    <>
      {isAle && <Success data={ale} handleOpen={handleAle} /> }
      {isOpen && <ImportCustomerLayout getNewPhone={getNewPhone} handleOpen={handleOpen} />}
      <div className={`sale-layout  ${isOpen ? 'overlay' : ''} `}>
        <h1>Hóa đơn bán sách</h1>
        <button onClick={addCustomerClick} className='add-icon'><UserAddOutlined /></button>
        <div className="top">
          <div className="input">
            <h3>Thông tin khách hàng</h3>
            <FloatInput disable={false} handleDisable={() => false} className="input_debt_no" type='tel' handleInput={handleInputPhoneNo} value={phoneNo} label="Số điện thoại" placeholder="Số điện thoại" name="customer_phone_no" />
            {debtErr && <div className={debtErr?.type}>{debtErr?.title}</div>}
            <button className='btnCheck' onClick={handleCheck}>Kiểm tra</button>
          </div>
          <div className="left">
            <h3>Sách mua:</h3>
            <BooksForm title="INVOICE" handleBooks={handleListInvoice}/>
          </div>
        </div>
        <div className="tle">DANH SÁCH SẢN PHẨM</div>
        {listBookInvoice.length > 0 
          ?
          <div className="div">
            <Table dataSource={listBookInvoice} columns={columns}  />
            <button onClick={handleCreate} className='btnCreate'>Tạo hóa đơn</button>
          </div>
          :
          <h3 className='h3'>(chưa có sách được chọn)</h3>
        }
      </div>
    </>
  )
}

export default InvoiceLayout