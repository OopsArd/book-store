import React, { useEffect, useState } from 'react'
import { Table } from 'antd';

import FloatInput from '../../FloatInput/FloatInput';

const LookupBook = () => {

  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState();


  const handleInput = (inputData) => {
    setInput(inputData);
  }

  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true);
        const res = await fetch(
          `http://localhost:8080/api/v1/books?title=${input}`
        );

        if(res.statusCode !== 200){
          throw new Error("Tải dữ liệu sách không thành công");
        }

        const rs =  await res.data.json();
        setData(rs);

      }catch(error){
        setErr(error)
      }finally{
        setLoading(false);
      }
    }

    fetchData();
  }, [input])
  
  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thể loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Lượng tồn',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];
  
  return (
    <div className='lookup-book'>
      <h1>Tra cứu sách</h1>
      <div className="input">
        <FloatInput handleInput={handleInput} label="Tên sách" placeholder="Tên sách" name="name-book"/>
      </div>
      <Table dataSource={data} columns={columns} />;
    </div>
  )
}

export default LookupBook