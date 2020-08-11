import React, {useState, useEffect} from "react";
import {List, Row, Col, Modal, message, Button } from 'antd';
import axios from 'axios'
import servicePath from "../config/apiUrl";
import '../static/css/ArticleList.css';

const {confirm} = Modal

function ArticleList(props) {

    const [list, setList] = useState([])

    useEffect(()=>{
        getList()
    },[]) // 数组为空，表示只进行一次渲染


    const getList = () => {
        axios({
            method:'get',
            url:servicePath.getArticleList,
            withCredentials: true
        }).then(
            res => {
                setList(res.data.list)
            }
        )
    }

    // delete article
    const delArticle = (id) => {
        confirm({
            title: 'Are you sure to delete ?',
            content: 'press ok to delete ',
            onOk(){
                axios(servicePath.delArticle+id, {withCredentials:true}).then(
                    res => {
                        message.success('delete successfully')
                        getList()
                    }
                )
            },
            onCancel(){
                message.success('no change')
            }
        })
    }

    // 修改文章的跳转方法
    const updateArticle = (id, checked) => {
        props.history.push('/index/add/'+id)
    }


    return (
        <div>
            <List
                header = {
                    <Row className="list-div">
                        <Col span={8}>
                            <b>标题:</b>
                        </Col>
                        <Col span={4}>
                            <b>类别:</b>
                        </Col>
                        <Col span={4}>
                            <b>发布时间:</b>
                        </Col>
                        <Col span={4}>
                            <b>浏览量:</b>
                        </Col>
                        <Col span={4}>
                            <b>操作:</b>
                        </Col>
                    </Row>
                }
                bordered
                dataSource ={list}
                renderItem={item=>(
                    <List.Item>
                        <Row className="list-div">
                            <Col span={8}>
                                {item.title}
                            </Col>
                            <Col span={4}>
                                {item.typeName}
                            </Col>
                            <Col span={4}>
                                {item.addTime}
                            </Col>
                            <Col span={4}>
                                {item.view_count}
                            </Col>
                            <Col span={4}>
                                <Button
                                    type="primary"
                                    style={{marginRight:'1rem'}}
                                    onClick={()=>{updateArticle(item.id)}}
                                >
                                    修改
                                </Button>
                                <Button onClick={()=>{delArticle(item.id)}}>删除</Button>
                            </Col>
                        </Row>
                    </List.Item>
                )}

            />
        </div>
    )
}


export default ArticleList
