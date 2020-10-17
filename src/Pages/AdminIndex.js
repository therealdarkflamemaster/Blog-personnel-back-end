import React, {useState} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import '../static/css/AdminIndex.css'
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Route} from 'react-router-dom'
import AddArticle from "./AddArticle";
import ArticleList from "./ArticleList";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


function AdminIndex(props) {

    const [collapsed, setCollapsed] = useState(false)

    const onCollapse = collapsed => {
        setCollapsed(collapsed)
    };

    const handleClickArticle = (e) => {
        if(e.key === 'addArticle'){
            props.history.push('/index/add/')
        }else if (e.key === '2'){
            props.history.push('/index/list')
        }else if (e.key === '3'){
            props.history.push('/index/list')
        }
    }


    return (
        <Layout style={{ minHeight: '100vh' }}>
               <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['articleList']} mode="inline">
                        <Menu.Item
                            key="articleList"
                            onClick={handleClickArticle}
                        >
                            文章列表
                        </Menu.Item>
                        <Menu.Item
                            key="addArticle"
                            icon={<DesktopOutlined />}
                            onClick={handleClickArticle}
                        >
                            添加文章
                        </Menu.Item>
                        <Menu.Item
                            key="2"
                            onClick={handleClickArticle}
                        >
                            文章管理
                        </Menu.Item>
                        <Menu.Item
                            key="3"
                            onClick={handleClickArticle}
                        >
                            标签管理
                        </Menu.Item>


                        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9" icon={<FileOutlined />}>
                            <span>留言管理</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Back End</Breadcrumb.Item>
                            <Breadcrumb.Item>工作台</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <div>
                                <Route path="/index/" exact component={AddArticle} />
                                <Route path="/index/add/" exact component={AddArticle} />
                                <Route path="/index/list/" exact component={ArticleList} />
                                <Route path="/index/add/:id" exact component={AddArticle} />
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>shengxiang'sBLOG.com</Footer>
                </Layout>
            </Layout>
        );

}

export default AdminIndex
