import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table } from 'antd';
import BooksForm from '../../BooksForm/BooksForm';
import Success from '../../Popup/Success';

import './import.css'

const ImportLayout = () => {

  const [listImport, setList] = useState([]);
  const [disable, setDis] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [ale, setAle] = useState();

  const handleOpen = (value) => {
    setOpen(value)
  }

  useEffect(() => {
    if(ale){
      setOpen(true)
    }
  },[ale])

  const handleImport = () => {
    if(listImport.length > 0){
      const details = listImport.map((book) => {
        return { book_id: book.id, quantity: Number(book.quantity) }
      });
    
      const data = {
        issuer_name: "FE Import",
        receipt_details: [...details] 
      }

      let dataImport = JSON.stringify(data);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/api/v1/receipts',
        headers:{
          'Content-Type': 'application/json'
        },
        data: dataImport
      };

      axios.request(config)
      .then(res => {
        console.log(JSON.stringify(res.data));
        setAle({title: "Sách đã được thêm thành công", type: 'success'});
      })
    }
  }

  const handleListImport = (dataAdd) => {
    let dup = listImport?.some(book => book.title === dataAdd.title)
    if(dup){
      setAle({title: "Sách đã được thêm trước đó", type: "error"})
    }else{
      setList([...listImport, dataAdd]);
    }
  }



  useEffect(() => {
    if(listImport.length > 0){
      setDis(false);
    }
  }, [listImport])

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
      title: 'Tác giả',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: 'Số lượng nhập',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];

  return (
    <>
      {isOpen && <Success data={ale} handleOpen={handleOpen} /> }
      <div className={`import-layout  ${isOpen ? 'overlay' : ''} `}>
        <h1>Nhập sách</h1>
        <BooksForm title="IMPORT" handleBooks={handleListImport} />
        <h3>Danh sách nhập:</h3>
        {listImport.length > 0 ? 
          <div className='showing'>
            <Table dataSource={listImport} columns={columns}  />
            <button disabled={disable} onClick={handleImport} className='btnImport'>Nhập sách</button>
          </div>
          :
          <h3 style={{color: 'white'}}>chưa có sách được chọn</h3>
        }
      </div>
    </>
  )
}

export default ImportLayout