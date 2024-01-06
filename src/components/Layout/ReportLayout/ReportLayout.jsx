import React, {useEffect, useState} from 'react'
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { Table, Segmented } from 'antd'

import './report.css'

const { RangePicker } = DatePicker;

const ReportLayout = () => {
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

  const [reports, setReports] = useState();
  

  const handleChangeOptions = (title) => {
    const itemSelected = options.find(item => item.title === title);
    const cols = columns.find(item => item.title === title);
    setCol(cols.colums);
    setReportTypes(itemSelected.url);
  }

  const handleChangeDate = (c) => {
    let s = c[0].format("YYYY-MM-DD")
    let e = c[1].format("YYYY-MM-DD")

    const data = {
      start_date: s,
      end_date: e
    }

    let dataToServer = JSON.stringify(data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/v1/reports/${reportTypes}`,
      headers:{
        'Content-Type': 'application/json'
      },
      data: dataToServer
    };
  
    axios.request(config)
    .then(res => {
      const data = res.data.data;
      const s = data.map(item => {
        return {...item, key: item.id}
      })
      console.log("data: ", typeof(s))
      setReports(s)
    })

    setStart(s);
    setEnd(e);
  }

  useEffect(() => {
    if(start && end){
      let formattedStart = dayjs(start, 'DD-MM-YYYY').format('YYYY-MM-DD');
      let formattedEnd = dayjs(end, 'DD-MM-YYYY').format('YYYY-MM-DD');
      const data = {
        start_date: formattedStart,
        end_date: formattedEnd
      }
  
      let dataToServer = JSON.stringify(data);
      console.log("data to sv: ", dataToServer)
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:8080/api/v1/reports/${reportTypes}`,
        headers:{
          'Content-Type': 'application/json'
        },
        data: dataToServer
      };
      console.log("url: ", config.url)
  
      axios.request(config)
      .then(res => {
        const data = res.data.data;
        const s = data.map(item => {
          return {...item, key: item.id}
        })
        console.log("data: ", typeof(s))
        setReports(s)
      })
    }
  },[reportTypes])

  useEffect(() => {
    let now = dayjs();
    const firstDayOfMonth = now.startOf('month').format('DD-MM-YYYY');
    setStart(firstDayOfMonth)
  },[])

  useEffect(() => {
    let now = dayjs();
    let td = now.format('DD-MM-YYYY');
    setEnd(td)
  },[])

  const options = [
    {title: 'Báo Cáo Tồn Sách', url: 'books/inventory'},
    {title: 'Báo Cáo Công Nợ', url: 'customers/debt'},
  ]

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
      <Table columns={col} dataSource={reports}/>
    </div>
  )
}

export default ReportLayout