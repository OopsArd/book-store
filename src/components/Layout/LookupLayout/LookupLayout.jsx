import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';

import { fetchBooks } from '../../../redux/slice/bookSlice';
import FloatInput from '../../FloatInput/FloatInput';
import './lookup.css'

const LookupLayout = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const books_status = useSelector((state) => state.books.status);
  const error = useSelector((state) => state.books.error);

  const [disableName, setDisableName] = useState(false)
  const [disableCategory, setDisableCategory] = useState(false)


  const [dataSearching, setSearching] = useState(books);

  const handleInputName = (inputData) => {
    const results = books.filter(book =>
      book.title.toLowerCase().includes(inputData.toLowerCase())
    );
    setSearching(results);
  }

  const handleInputCategory = (inputData) => {
    const results = books.filter(book =>
      book.category_name.toLowerCase().includes(inputData.toLowerCase())
    );
    setSearching(results);
  }

  const handleDisableName = (value) => {
    setDisableCategory(value);
  }

  const handleDisableCategory = (value) => {
    setDisableName(value);
  }

  useEffect(() => {
    if (books_status === 'idle') {
      dispatch(fetchBooks());
    }
  }, [books_status, dispatch]);
  
  useEffect(() => {
    setSearching(books);
  }, [books]);

  if (books_status === 'loading') {
    return (
      <div className='lookup-layout'>
        <div>Loading...</div>
      </div>
    );
  }

  if (books_status === 'failed') {
    return (
      <div className="lookup-books">
        <div>Error: {error}</div>
      </div>
    );
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
        <FloatInput handleDisable={handleDisableName} disable={disableName} handleInput={handleInputName} label="Tên sách" placeholder="Tên sách" name="name-book"/>
        <FloatInput handleDisable={handleDisableCategory} disable={disableCategory} handleInput={handleInputCategory} label="Thể loại" placeholder="Thể loại" name="category-book"/>
      </div>
      <Table dataSource={dataSearching} columns={columns} />
    </div>

  )
}

export default LookupLayout