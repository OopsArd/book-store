import React, {useEffect, useState} from 'react'
import { DatePicker, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReports, getReports } from '../../../redux/slice/reportSlice';
import dayjs from 'dayjs';
import axios from 'axios';
import { Table, Segmented } from 'antd'

import './report.css'

const { RangePicker } = DatePicker;

const ReportLayout = () => {
  const dispatch = useDispatch();
  const reports = useSelector(state => state.reports.reports);
  const status = useSelector(state => state.reports.status);

  const [start, setStart] = useState();
  const [end, setEnd] = useState()
  const [reportTypes, setReportTypes] = useState('books/inventory')
  const [col, setCol] = useState([
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'stt',
    },
    {
      title: 'Tên sách',
      dataIndex: 'object_name',
      key: 'object_name',
    },
    {
      title: 'Tồn đầu',
      dataIndex: 'beginning',
      key: 'beginning',
    },
    {
      title: 'Phát sinh',
      dataIndex: 'occurred',
      key: 'occurred',
    },
    {
      title: 'Tồn cuối',
      dataIndex: 'ending',
      key: 'ending',
    },
  ])

  const [listReports, setReports] = useState();
  
  useEffect(() => {
    dispatch(fetchReports());
  },[])

  useEffect(() => {
    setReports(reports)
  },[reports])

  const handleChangeOptions = (title) => {
    const itemSelected = options.find(item => item.title === title);
    const cols = columns.find(item => item.title === title);
    setCol(cols.colums);

    console.log("set at item select: ", itemSelected.url)
    setReportTypes(itemSelected.url);
  }

  const handleChangeDate = (c) => {
    let s = c[0].format("YYYY-MM-DD");
    let e = c[1].format("YYYY-MM-DD");
    const data = {
      start_date: s,
      end_date: e,
      url: reportTypes
    }
    console.log("date change: ", data)
    dispatch(getReports(data))
    setStart(s);
    setEnd(e);
  }

  useEffect(() => {
    if(start && end){
      let formattedStart = dayjs(start, 'DD-MM-YYYY').format('YYYY-MM-DD');
      let formattedEnd = dayjs(end, 'DD-MM-YYYY').format('YYYY-MM-DD');
      const data = {
        start_date: formattedStart,
        end_date: formattedEnd,
        url: reportTypes,
      }
      dispatch(getReports(data));
      setStart(formattedStart);
      setEnd(formattedEnd);
    }
  },[reportTypes])

  useEffect(() => {
    let now = dayjs();
    const firstDayOfMonth = now.startOf('year');
    const startDay = dayjs(firstDayOfMonth, 'DD-MM-YYYY')
    setStart(startDay)
  },[])

  useEffect(() => {
    let now = dayjs();
    const td = now.format('DD-MM-YYYY');
    const endDay = dayjs(td, 'DD-MM-YYYY')
    setEnd(endDay)
  },[])

  const options = [
    {title: 'Báo Cáo Tồn Sách', url: 'books/inventory'},
    {title: 'Báo Cáo Công Nợ', url: 'customers/debt'},
  ]

  if(status == 'loading'){
    return (
      <div className='report-layout'>
        <div>Loading...</div>
      </div>
    )
  }
  if(status == 'error'){
    return (
      <div className='report-layout'>
        <div>Error: {error}</div>
      </div>
    )
  }

  const columns = [
    {
      title: 'Báo Cáo Tồn Sách', 
      colums: [
        {
          title: 'STT',
          dataIndex: 'key',
          key: 'STT',
        },
        {
          title: 'Tên sách',
          dataIndex: 'object_name',
          key: 'object_name',
        },
        {
          title: 'Tồn đầu',
          dataIndex: 'beginning',
          key: 'beginning',
        },
        {
          title: 'Phát sinh',
          dataIndex: 'occurred',
          key: 'occurred',
        },
        {
          title: 'Tồn cuối',
          dataIndex: 'ending',
          key: 'ending',
        },
    ]},
    {
      title: 'Báo Cáo Công Nợ', 
      colums: [
        {
          title: 'STT',
          dataIndex: 'key',
          key: 'STT',
        },
        {
          title: 'Khách hàng',
          dataIndex: 'object_name',
          key: 'object_name',
        },
        {
          title: 'Nợ đầu',
          dataIndex: 'beginning',
          key: 'beginning',
        },
        {
          title: 'Phát sinh',
          dataIndex: 'occurred',
          key: 'occurred',
        },
        {
          title: 'Nợ cuối',
          dataIndex: 'ending',
          key: 'ending',
        },
    ]},
  ];

  return (
    <div className='report-layout'>
      <h1>Báo cáo</h1>
      <div>Thời gian: </div>
      <div className="form-date">
        <Space direction="vertical" size={16}>
          <RangePicker onChange={(c) => handleChangeDate(c)} defaultValue={[start, end]} placeholder={[start, end]} format='DD-MM-YYYY'/>
        </Space>
      </div>
      <Segmented className='options' options={options.map(item => item.title)} onChange={handleChangeOptions} />
      {reports ? <Table columns={col} dataSource={listReports}/> : <div style={{color: 'red'}}>Không có báo cáo trong khoảng thời gian này</div>}
    </div>
  )
}

export default ReportLayout