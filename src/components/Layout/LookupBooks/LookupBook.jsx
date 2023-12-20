import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import axios from 'axios';

import FloatInput from '../../FloatInput/FloatInput';
import './lookup.css'

const LookupBook = () => {

  const [books, setBooks] = useState(null);
  const [dataTable, setTable] = useState(null);

  const handleInput = (inputData) => {
    const dataSearching = books?.filter(book => book?.title?.toLowerCase().includes(inputData?.toLowerCase()));
    setTable(dataSearching);
  }

  useEffect(() => {
    console.log("mout")
    axios.get(`http://localhost:8080/api/v1/books`)
      .then(res => {
        const respon = res.data;

        const dataSrc = respon.data.map((book, index) => ({
          title:book.title, 
          category_name: book.category_name,
          author_name: book.author_name,
          quantity: book.quantity,
          key: index
        }));
        setBooks(dataSrc);
      })
      .catch(error => console.log(error));
  }, [])

  useEffect(()=> {
    setTable(books);
  }, [books])

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
      title: 'Lượng tồn',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];
    
  return (
    <div className='lookup-layout'>
      <h1>Tra cứu sách</h1>
      <div className="input">
        <FloatInput handleInput={handleInput} label="Tên sách" placeholder="Tên sách" name="name-book"/>
      </div>
      <Table dataSource={dataTable} columns={columns} />
    </div>

  )
}

export default LookupBook