import React, {Component} from "react";
import {Input, Row, Col, Modal, message, Button, Table, Space, Divider} from 'antd';
import {
    SearchOutlined,
    TagOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import servicePath from "../config/apiUrl";
import '../static/css/ArticleList.css';

const {confirm} = Modal

class AddTag extends Component {


    constructor(props) {
        super(props);
    }

    state = {
        list: [],
        user: {},
        loading: true, // pour le tableau
        searchText: '',
        searchedColumn: '',
        newTag: '',
        articleRowsSelected: [],
        pushLoading: false,
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

    pushTag = () => {
        let dataProps = {}
        dataProps.name = this.state.newTag;
        console.log(dataProps);
        if(dataProps.name === ''){
            message.error('not allowing empty tag!')
        }else {
            axios({
                method: 'post',
                url: servicePath.addTag,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    if(res.data.isSuccess) {
                        message.success("update successfully")
                        this.setState({
                            newTag: ''
                        })
                    } else {
                        message.error(res)
                    }
                }
            )
        }

    }


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
        ];
        const { list, loading,} = this.state;

        return (
            <div>
                <div>
                    <Space>
                        <Input
                            placeholder="enter Tag Name"
                            addonBefore={<TagOutlined />}
                            value={this.state.newTag}
                            onChange={(event => this.setState({
                                newTag: event.target.value
                            }))}
                            onPressEnter={this.pushTag.bind(this)}
                        />
                        <Button type="primary" onClick={this.pushTag.bind(this)}>Confirm</Button>
                    </Space>
                </div>
                <br/>

                <Table
                    tableLayout="auto"
                    size="middle"
                    columns={columns}
                    dataSource={list}
                    loading = {loading}
                    rowKey = {data => data["Id"]}
                />
            </div>

        );
    }
}

export default AddTag
