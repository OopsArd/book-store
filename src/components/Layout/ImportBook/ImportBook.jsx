import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table } from 'antd';

import BooksForm from '../../BooksForm/BooksForm';
import './import.css'

const ImportBook = () => {

  const [listImport, setList] = useState([]);
  const [disable, setDis] = useState(true);

  const handleImport = () => {
    if(listImport.length > 0){
      const details = listImport.map((book) => {
        return { book_id: book.id, quantity: Number(book.quantity) }
      });
    
      const data = {
        issuer_name: "FE Import",
        receipt_details: [...details] 
      }

      console.log(data);
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
        alert(res.data.message);
      })
    }
  }

  const handleListImport = (dataAdd) => {
    let dup = listImport?.some(book => book.title === dataAdd.title)
    if(dup){
      alert("Sách đã được thêm trước đó")
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
    <div className='import-layout'>
      <h1>Nhập sách</h1>
      <BooksForm title="IMPORT" handleBooks={handleListImport} />
      <h3>Danh sách nhập:</h3>
      <Table dataSource={listImport} columns={columns}  />
      <button disabled={disable} onClick={handleImport} className='btnImport'>Nhập sách</button>
    </div>
  )
}

export default ImportBook