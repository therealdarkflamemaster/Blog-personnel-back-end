import React, {useState} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import '../static/css/AdminIndex.css'
import {
    FileAddOutlined,
    MinusCircleOutlined,
    FileOutlined,
    TagsOutlined,
    PlusCircleOutlined,
    MenuOutlined,
    SlidersOutlined,
} from '@ant-design/icons';
import {Route} from 'react-router-dom'
import AddArticle from "./AddArticle";
import AdminArticleList from "./AdminArticleList"
import AddTag from "./AddTag";
import ArticleList from "./ArticleList";
import DeleteTag from "./DeleteTag"

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
        }else if (e.key === 'articleList'){
            props.history.push('/index/list')
        }else if (e.key === '2'){
            props.history.push('/index/adminList')
        }else if (e.key === '8'){
            props.history.push('/index/addTag')
        }else if (e.key === '6'){
            props.history.push('/index/deleteTag')
        }
    }


    return (
        <Layout style={{ minHeight: '100vh' }}>
               <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['articleList']} mode="inline">
                        <Menu.Item
                            key="articleList"
                            icon={<MenuOutlined />}
                            onClick={handleClickArticle}
                        >
                            文章列表
                        </Menu.Item>
                        <Menu.Item
                            key="addArticle"
                            icon={<FileAddOutlined />}
                            onClick={handleClickArticle}
                        >
                            添加文章
                        </Menu.Item>
                        <Menu.Item
                            key="2"
                            icon={<SlidersOutlined />}
                            onClick={handleClickArticle}
                        >
                            文章管理
                        </Menu.Item>
                        <SubMenu key="3" icon={<TagsOutlined />} title="Tags">
                            <Menu.Item key="8" icon={<PlusCircleOutlined />} onClick={handleClickArticle}>添加</Menu.Item>
                            <Menu.Item key="6" icon={<MinusCircleOutlined />} onClick={handleClickArticle}>删减，修改</Menu.Item>
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
                                <Route path="/index/addTag" exact component={AddTag} />
                                <Route path="/index/adminList" exact component={AdminArticleList} />
                                <Route path="/index/deleteTag" exact component={DeleteTag} />
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>shengxiang's BLOG.com</Footer>
                </Layout>
            </Layout>
        );

}

export default AdminIndex
