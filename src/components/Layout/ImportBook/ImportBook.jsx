import React, { useEffect, useState } from 'react'
import { Table } from 'antd';

import FloatInput from '../../FloatInput/FloatInput';
import './import.css'

const ImportBook = () => {

  const [books, setBooks] = useState(null);
  const [listImport, setList] = useState([]);
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [err_name, setErrName] = useState(false);
  const [err_quantity, setErrQuantity] = useState(false);


  const handleInputName = (dataInput) => {
    let check = books.some(book => book.title.toLowerCase() === dataInput.toLowerCase());
    if(check){
      setName(dataInput);
      setErrName(false);
      return
    }
    setName(null);
    setErrName(true);
  }

  const handleInputQuantity = (dataInput) => {
    if(dataInput >= 150){
      setQuantity(dataInput);
      setErrQuantity(false);
      return
    }
    setQuantity(null);
    setErrQuantity(true);
  
  }

  const handleAdd = () => {
    if(name && quantity){
      let check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
      console.log('check: ', check)

      if(check.quantity >= 300){
        alert("Chỉ nhập các đầu sách có số lượng tồn ít hơn 300")
        return
      }

      const dataAdd = {...check, title: name, quantity: quantity };
      console.log('data input after verify: ', dataAdd);

      let dup = listImport?.some(book => book.title === dataAdd.title)
      if(dup){
        alert("Sách đã được thêm trước đó")
      }else{
        setList([...listImport, dataAdd]);
      }
    }else{
      alert("Nhập sách và số lượng cần thêm")
    }
  }

  const handleImport = () => {}

  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:8080/api/v1/books`)
        .then((res) => {
          if(res.ok){
            return res.json();
          }
        })
        .then((data) => {
          const dataSrc = data.data.map((book, index) => ({
            title:book.title, 
            category_name: book.category_name,
            author_name: book.author_name,
            quantity: book.quantity,
            key: index
          }));
          setBooks(dataSrc);
        })
    };
    fetchData();
  }, [])

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
      <div className="input">
        <FloatInput className="input_name" handleInput={handleInputName} label="Tên sách" placeholder="Tên sách" name="book_name" />
        { err_name && <span className="err_name">Sách không tồn tại</span>}
        <FloatInput className="input_quantity" handleInput={handleInputQuantity} label="Số lượng" placeholder="Số lượng" name="book_quantity" />
        { err_quantity && <span className="err_quantity">Số lượng nhập ít nhất là 150</span>}
        {<button onClick={handleAdd} className='btnAdd'>Thêm</button>}
      </div>
      <Table dataSource={listImport} columns={columns}  />
      <button onClick={handleImport} className='btnImport'>Nhập sách</button>
    </div>
  )
}

export default ImportBook