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

import LookupLayout from '../../components/Layout/LookupLayout/LookupLayout'
import ImportLayout from '../../components/Layout/ImportLayout/ImportLayout'
import InvoiceLayout from '../../components/Layout/InvoiceLayout/InvoiceLayout'
import ReceiptLayout from '../../components/Layout/ReceiptLayout/ReceiptLayout'
import ReportLayout from '../../components/Layout/ReportLayout/ReportLayout';
import SettingLayout from '../../components/Layout/SettingLayout/SettingLayout';

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
  1: <LookupLayout />,
  2: <ImportLayout />,
  3: <InvoiceLayout />,
  4: <ReceiptLayout />,
  5: <ReportLayout />,
  6: <SettingLayout />
};

const Home = () => {
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

export default Home;