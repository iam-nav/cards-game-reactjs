import React from 'react'

import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

export default function footer() {
    return (
        <div>
            <Layout className="layout" style={{position:"absolute",left:"0",bottom:"0",right:"0"}}>
    <Footer style={{ textAlign: 'center',height:"10px" }}>Cards ©2020 Created and developed by Navjot Singh</Footer>
  </Layout>,          
        </div>
    )
}
