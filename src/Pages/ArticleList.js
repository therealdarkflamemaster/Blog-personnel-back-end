import React, {Component} from "react";
import {Input, Row, Col, Modal, message, Button, Table, Space } from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import servicePath from "../config/apiUrl";
import '../static/css/ArticleList.css';

const {confirm} = Modal

class ArticleList extends Component {


    constructor(props) {
        super(props);
    }

    state = {
        list: [],
        user: {},
        loading: true, // pour le tableau
        searchText: '',
        searchedColumn: '',
    };

    componentDidMount() {
        this.fetch();
    }

    fetch = (params = {}) => {
        this.setState({
            loading: true, // pour le tableau Source
        });
        axios({
            method:'get',
            url:servicePath.getArticleList,
            withCredentials: true
        }).then(
            res => {
                this.setState({
                    list: res.data.list,
                    loading: false
                })
            }
        )
    }

    // delete article
    delArticle = (id) => {
        confirm({
            title: 'Are you sure to delete ?',
            content: 'press ok to delete ',
            onOk(){
                axios(servicePath.delArticle+id, {withCredentials:true}).then(
                    res => {
                        message.success('delete successfully')
                        this.setState({
                            loading: true, // pour le tableau Source
                        });
                        axios({
                            method:'get',
                            url:servicePath.getArticleList,
                            withCredentials: true
                        }).then(
                            res => {
                                this.setState({
                                    list: res.data.list,
                                    loading: false
                                })
                            }
                        )
                    }
                )
            },
            onCancel(){
                message.success('no change')
            }
        })
    }

    // 修改文章的跳转方法
    updateArticle = (id, checked) => {
        this.props.history.push('/index/add/'+id)
    }

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} className="searchBox">
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#23D8AB' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };


    render() {


        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                ...this.getColumnSearchProps('title'),
            },
            {
                title: '类别',
                dataIndex: 'typeName',
                key: 'typeName',
                ...this.getColumnSearchProps('typeName'),
            },
            {
                title: '发布时间',
                dataIndex: 'addTime',
                key: 'addTime',
                defaultSortOrder: 'descend',
                onFilter: (value, record) => record.name.indexOf(value) === 0,
                sorter: (a, b) => parseFloat(a.addTime) - parseFloat(b.addTime),
                sortDirections: ['ascend','descend'],
            },
            {
                title: '浏览量',
                dataIndex: 'view_count',
                key: 'view_count',
                onFilter: (value, record) => record.name.indexOf(value) === 0,
                sorter: (a, b) => a.view_count - b.view_count,
                sortDirections: ['ascend','descend'],
            },
            {
                title: 'Action',
                key: 'action',
                render: (record) => (
                    <Space size="middle">
                        <Button
                            type="primary"
                            style={{marginRight:'1rem'}}
                            onClick={()=>{this.updateArticle(record.id)}}
                        >
                            修改
                        </Button>
                        <Button onClick={()=>{this.delArticle(record.id)}}>删除</Button>
                    </Space>
                ),
            },
        ];
        const { list, loading,} = this.state;

        return (
            <Table
                tableLayout="auto"
                size="middle"
                columns={columns}
                dataSource={list}
                loading = {loading}
                rowKey = {data => data["title"]}
            />
        );
    }
}

export default ArticleList
