import React from 'react'
import   {
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import './popup.css'

const Success = ({data, handleOpen}) => {
    const exitClick = () => {
        handleOpen(false);
    }
  return (
    <div className='popup sc'>
        <div className="card-popup sc">
            { data && (data.type == 'success') ? <div className='icon-success'><CheckCircleOutlined /></div> : <div className='icon-error'><CloseCircleOutlined /></div>}
            <div className='tt'>Thông báo</div>
            <div className='ct'>{data && data.title}</div>
            <button onClick={exitClick} className='btnExit'>Thoát</button>
        </div>
    </div>
  )
}

export default Success