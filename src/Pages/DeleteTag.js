import React, {Component} from "react";
import {Input, Tag, message, Modal, Spin, Button, Table, Space, Popconfirm} from 'antd';
import {
    SearchOutlined,
    LoadingOutlined ,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios'
import servicePath from "../config/apiUrl";
import '../static/css/ArticleList.css';

const {confirm} = Modal
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class DeleteTag extends Component {


    constructor(props) {
        super(props);
    }

    state = {
        tags: [],
        user: {},
        loading: true, // pour le tableau
        searchText: '',
        searchedColumn: '',
        deleteTag: '',
        articlesLinked: [],
        loadingArticle: true,
        expandedRowKeys: [], // only allow for one at a time
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
            url:servicePath.getTags,
            withCredentials: true
        }).then(
            res => {
                this.setState({
                    tags: res.data.data,
                    loading: false
                })
            }
        )
    }


    fetchArticlesLinked = (record) => {

        axios({
            method:'get',
            url:servicePath.getArticlesByTagId + record["Id"],
            withCredentials: true
        }).then(
            res => {
                let names = [];
                res.data.data.map(article => {
                    names.push(article["title"])
                })
                this.setState({
                    expandedRowKeys: [record["Id"]],
                    articlesLinked: names,
                    loadingArticle: false
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

    deleteTag = (record) => {
        this.setState({
            deleteTag : record
        })
    }

    cancel(e) {
        message.info('Have not deleted');
    }

    confirm() {
        let record = this.state.deleteTag
        let id = record["Id"];
        let url =  servicePath.delLinkByTagId + id
        axios(url, {withCredentials:true}).then(
            res => {
                message.success('Delete Links Successfully');
            }
        )

        url = servicePath.delTag + id
        axios(url, {withCredentials:true}).then(
            res => {
                message.success('Delete Tag Successfully');
                this.fetch();
            }
        )


    }


    render() {


        const columns = [
            {
                title: 'Tag',
                dataIndex: 'name',
                key: 'name',
                render: record => <Tag color="green">{record}</Tag>,
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Action',
                key: 'action',
                fixed: 'right',
                render: (record) => {

                    return (
                        <div>
                            <Popconfirm
                                title="Are you sure delete this Tag?"
                                onConfirm={this.confirm.bind(this)}
                                onCancel={this.cancel.bind(this)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a
                                   onClick={this.deleteTag.bind(this, record)}
                                >
                                    Delete
                                </a>
                            </Popconfirm>
                        </div>
                    )
                },
            },
        ];



        const { tags, loading } = this.state;



        return (
            <div>
                <br/>
                <Table
                    tableLayout="auto"
                    size="middle"
                    expandable={{
                        expandedRowRender: record => {
                            if(this.state.articlesLinked.length === 0){
                                return (
                                    <div>no article linked</div>
                                )
                            }else {
                                return (
                                    <Spin indicator={antIcon} spinning={this.state.loadingArticle}>
                                        <div style={{fontWeight:'550'}}>{"Total "+this.state.articlesLinked.length+" articles :"}</div>
                                        <div style={{paddingRight:'15px'}}>
                                           {this.state.articlesLinked.map(article=> article+". ")}
                                        </div>
                                    </Spin>
                                )
                            }
                        },
                        expandRowByClick: true,
                        expandedRowKeys: this.state.expandedRowKeys,
                        onExpand: (expanded, record) => this.fetchArticlesLinked(record),
                    }}
                    columns={columns}
                    dataSource={tags}
                    loading = {loading}
                    rowKey = {tags => tags["Id"]}
                    scroll={{ y : 700 }}
                    pagination={false}
                />
            </div>

        );
    }
}

export default DeleteTag
