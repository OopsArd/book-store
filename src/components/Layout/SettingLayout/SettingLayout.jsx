import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRules } from '../../../redux/slice/ruleSlice'

import { Form, Popconfirm, Table, Typography } from 'antd'
import EditableCell from '../../EditableCell/EditableCell'

import './setting.css'

const SettingLayout = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState('');

  const rules = useSelector((state) => state.rules.rules);
  const status = useSelector((state) => state.rules.status);
  const error = useSelector((state) => state.rules.error);

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      stt: '',
      rule_name: '',
      value: '',
      description: '',
      is_use: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        console.log('item selected: ', item)
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        
        //
        let ruleIsChanged = newData[index];
        console.log("rule is changed: ", ruleIsChanged)

        let dataToServer = JSON.stringify(ruleIsChanged);
        let config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: 'http://localhost:8080/api/v1/rules',
          headers:{
            'Content-Type': 'application/json'
          },
          data: dataToServer
        };
        axios.request(config)
        .then(res => {
          console.log(JSON.stringify(res.data));
          alert(res.data.message);
        })
        //
        setData(newData);
        setEditingKey('');
      } else {
        alert("Không thể xác định row để thay đổi")
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  /////////////////////////////////////////////////
  useEffect(() => {
    if(status === 'idle'){
      dispatch(fetchRules());
    }
  }, [status, dispatch])

  useEffect(() => {
    setData(rules)
  }, [rules])

  if(status == 'loading'){
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
      width: '5%',
    },
    {
      title: 'Tên',
      dataIndex: 'rule_name',
      key: 'rule_name',
      width: '30%',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      width: '10%',
      editable: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '35%',
      key: 'description',
    },
    {
      title: 'Đang sử dụng',
      dataIndex: 'is_use',
      key: 'is_use',
      width: '10%',
      editable: true,
    },
    {
      title: 'Thay đổi',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Lưu thay đổi
            </Typography.Link>
            <Popconfirm title="Không thay đổi?" onConfirm={cancel}>
              <a style={{
                color: '#FF3C38',
              }}>Thoát</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Thay đổi
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'value' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  return (
    <div className='setting-layout'>
      <h1>Danh sách quy định</h1>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  )
}

export default SettingLayout