import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRules } from '../../../redux/slice/ruleSlice'

import { Table } from 'antd'
import FloatInput from '../../FloatInput/FloatInput'

import './setting.css'

const Setting = () => {
  const dispatch = useDispatch();
  const rules = useSelector((state) => state.rules.rules);
  const status = useSelector((state) => state.rules.status);
  const error = useSelector((state) => state.rules.error);

  useEffect(() => {
    if(status === 'idle'){
      dispatch(fetchRules());
    }
  }, [status, dispatch])

  if(status == 'loding'){
    return (
      <div className='setting-laout'>
        <div>Loading...</div>
      </div>
    )
  }
  if(status == 'error'){
    return (
      <div className='setting-laout'>
        <div>Error: {error}</div>
      </div>
    )
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'stt',
    },
    {
      title: 'Tên',
      dataIndex: 'rule_name',
      key: 'rule_name',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Đang sử dụng',
      dataIndex: 'is_use',
      key: 'is_use',
    }
  ];
  return (
    <div className='setting-layout'>
      <h1>Danh sách quy định</h1>
      <Table columns={columns} dataSource={rules} />
    </div>
  )
}

export default Setting