import React, { useState } from 'react';

import {
  HomeOutlined,
  UnorderedListOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  MoneyCollectOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import BookSale from '../Layout/BookSalesInvoice/BookSale'
import LookupBook from '../Layout/LookupBooks/LookupBook'
import CollectReceipt from '../Layout/CollectReceipt/CollectRecipt'
import ImportBook from '../Layout/ImportBook/ImportBook'
import MonthlyReport from '../Layout/MonthlyReport/MonthlyReport';
import Setting from '../Layout/Setting/Setting';

const {  Content, Sider } = Layout;

function getItem(label, key, path, icon, children) {
  return {key, icon, children, label, path};
}

const items = [
  getItem('Tra cứu sách', '1','/tra-cuu-sach', <UnorderedListOutlined />),
  getItem('Nhập sách', '2','/nha-sach', <DownloadOutlined /> ),
  getItem('Hóa đơn bán sách', '3','/hoa-don', <FileDoneOutlined />),
  getItem('Biên lai thu tiền', '4','/bien-lai-thu-tien', <MoneyCollectOutlined />),
  getItem('Báo cáo tháng', '5','/bao-cao', <BarChartOutlined />),
  getItem('Thay đổi quy định', '6','/thay-doi-quy-dinh', <SettingOutlined />),
];

const components = {
  1: <LookupBook />,
  2: <ImportBook />,
  3: <BookSale />,
  4: <CollectReceipt />,
  5: <MonthlyReport />,
  6: <Setting />
};

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [render, setRender] = useState(1);

  const handleSelectKey = (item) => {
    setRender(item.key)
  }

  return (
    <Layout style={{ minHeight: '100vh',}}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu theme="dark" onSelect={handleSelectKey} defaultSelectedKeys={['1']} mode="inline" items={items}/>
      </Sider>

      <Layout>
        <Content>
          { components[render] }
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;