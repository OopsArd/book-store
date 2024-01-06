import React, {useState, useEffect} from 'react'
import { fetchCustomers, updateCustomer } from '../../../redux/slice/customerSlice'
import { useSelector, useDispatch } from 'react-redux'

import { Table } from 'antd'
import Popup from '../../Popup/Popup'

import './receipt.css'

const ReceiptLayout = () => {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.customers);
  const status = useSelector(state => state.customers.status);
  const [listTable, setList] = useState(customers)

  const [infoCustomer, setInfo] = useState();

  const [isOpen, setOpen] = useState(false)

  const handleRowClick = (row) => {
    setInfo(row)
}

  const handleOpen = (value) => {
    setOpen(value)
  }

  const getIdCus = (value) => {
    console.log("value get id: ", value);
    dispatch(updateCustomer(value))
  }

  useEffect(() => {
    if(infoCustomer){
      setOpen(true);
    }
  },[infoCustomer])

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch])

  useEffect(() => {
    setList(customers);
  },[customers])

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

  if(status == 'loading'){
    return (
      <div className='receipt-layout'>
        <div>Loading...</div>
      </div>
    )
  }
  if(status == 'error'){
    return (
      <div className='receipt-layout'>
        <div>Error: {error}</div>
      </div>
    )
  }

  return (
    <>
    { isOpen && <Popup getIdCus={getIdCus} data={infoCustomer} handleOpen={handleOpen}/> }
    <div className={`receipt-layout  ${isOpen ? 'overlay' : ''} `}>
      <h1>Biên lai thu tiền</h1>
      <div className="input">
        <h3>Thông tin khách hàng</h3>
      </div>
      <Table columns={columns} dataSource={listTable} 
            onRow={(row) => ({
              onClick: () => {handleRowClick(row)}
            })}  />
    </div>
    </>
  )
}

export default ReceiptLayout