import React, {useState, useEffect} from "react";
import marked from 'marked';
import '../static/css/AddArticle.css'
import {Row, Col, Input, Select, Button, DatePicker, message, Card, Tag, Tooltip} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
import ArticleTags from "../Components/ArticleTags";
import {PlusOutlined} from "@ant-design/icons";



const {Option} = Select
const {TextArea} = Input


function AddArticle(props) {

    const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle, setArticleTitle] = useState('')   //文章标题
    const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
    const [showDate, setShowDate] = useState()   //发布日期
    const [updateDate, setUpdateDate] = useState() //修改日志的日期
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(()=>{
        getTagsInfo()
        //获取文章id
        let tmpId = props.match.params.id // router获取的参数
        if(tmpId){
            setArticleId(tmpId)
            getArticleById(tmpId)

        }
    },[])

    marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            pedantic: false,
            sanitize: false,
            tables: true,
            breaks: false,
            smartLists: true,
            smartypants: false,
    })

    const changeContent = (e) =>{
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }

    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTagsInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTags,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true
        }).then(
            res => {
                if(res.data.data == 'not login'){
                    localStorage.removeItem('openId')
                    props.history.push('/')
                }else {
                    setAllTags(res.data.data);
                }
            }
        )
    }

    const saveArticle = () =>{

        if (!articleTitle){
            message.error("没有文章标题")
            return false
        }else if (!articleContent){
            message.error("没有文章内容")
            return false
        }else if (!introducemd){
            message.error("没有文章简介")
            return false
        }else if (!showDate){
            message.error("没有发布日期")
            return false
        }
        let dataProps = {}
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        let dateText = showDate.replace('-','/')
        dataProps.addTime = (new Date(dateText).getTime())/1000

        if(articleId === 0){
            dataProps.view_count = 0
            axios({
                method: 'post',
                url: servicePath.addArticle,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    setArticleId(res.data.insertId)

                    if(res.data.isSuccess) {
                        message.success('Add successfully')
                    }else {
                        message.error('Wrong Adding')
                    }
                }
            )
        } else {
            //修改文章
            dataProps.id = articleId
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    if(res.data.isSuccess) {
                        message.success("update successfully")
                    } else {
                        message.error("update wrong")
                    }
                }
            )
        }



    }

    const getArticleById = (id) => {
        axios(servicePath.getArticleById+id, {withCredentials:true})
            .then(
                res => {
                    let articleInfo = res.data.data[0];
                    setArticleTitle(articleInfo.title)
                    setArticleContent(articleInfo.article_content)

                    let html = marked(articleInfo.article_content)
                    setMarkdownContent(html)
                    setIntroducemd(articleInfo.introduce)
                    let tmpInt = marked(articleInfo.introduce)
                    setIntroducehtml(tmpInt)
                    setShowDate(articleInfo.addTime)
                }
            )
        axios(servicePath.getTagsByArticleId+id, {withCredentials:true})
            .then(
                res => {
                    setTags(res.data.data);
                }
            )
    }

    const handleClose = removedTag => {

        // 删除一个Article的一个选择的Tag
        axios(servicePath.delLinkByArticleIdAndTagId+articleId+"/"+removedTag.Id, {withCredentials:true})
            .then(
                res => {
                    // console.log(res)
                    message.success('删除Tag成功');
                }
            )


        let newTags = tags.filter(tag => tag !== removedTag);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);

    };

    const handleInputChange = value => {
        setInputValue(value)
        let dataProps = {
            "article_id": articleId,
            "tag_id": value
        }
        axios({
            method: 'post',
            url: servicePath.addArticleToTag,
            data: dataProps,
            withCredentials: true
        }).then(res => {
            setInputValue('')
            axios(servicePath.getTagsByArticleId+articleId, {withCredentials:true})
                .then(
                    res => {
                        setTags(res.data.data);
                        setInputVisible(false);
                        message.success('添加Tag成功')
                    }
                )

        })
    };


    return (
        <div>
           <Row gutter={5}>
               <Col span={18}>
                   <Row gutter={10}>
                       <Col span={20}>
                           <Input
                               placeholder="Title of article"
                               size="large"
                               value={articleTitle}
                               onChange={(e)=>setArticleTitle(e.target.value)}
                           />
                       </Col>
                   </Row>
                   <br/>
                   <Row gutter={10}>
                       <Col span={12}>
                           <TextArea
                               className="markdown-content"
                               rows={35}
                               placeholder="Content of the Article"
                               value={articleContent}
                               onChange={changeContent}
                           />
                       </Col>
                       <Col span={12}>
                           <div className="show-html"
                                dangerouslySetInnerHTML={{__html:markdownContent}}
                           ></div>
                       </Col>
                   </Row>
               </Col>
               <Col span={6}>
                    <Row>
                        <Col span={24} style={{marginBottom:'25px'}}>
                            <Button size="large" style={{marginRight:'20px'}}>temporary stock</Button>
                            <Button type="primary" size="large" onClick={saveArticle}>Publish</Button>
                            <br/>
                        </Col>

                        <Col span={24}>
                            <TextArea
                                rows={4}
                                placeholder="Introduction of article"
                                onChange={changeIntroduce}
                                value={introducemd}
                            />
                            <br/>
                            <br/>
                            <div className="introduce-html"
                                dangerouslySetInnerHTML={{__html:introducehtml}}
                            ></div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker
                                    placeholder="published date"
                                    size="large"
                                    onChange={(date, dateString)=>{setShowDate(dateString)}}
                                />
                            </div>
                        </Col>
                        {
                            articleId !== 0 ?
                                <Col span={24}>
                                    <Card>
                                        {tags.map((tag, index) => {

                                            const isLongTag = tag.length > 20;

                                            const tagElem = (
                                                <Tag
                                                    className="edit-tag"
                                                    key={tag['Id']}
                                                    closable={true}
                                                    onClose={() => handleClose(tag)}
                                                >
                                                                              <span>
                                                                                {isLongTag ? `${tag['name'].slice(0, 20)}...` : tag['name']}
                                                                              </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag['name']} key={tag['Id']}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}
                                        {inputVisible && (
                                            <Select
                                                showSearch
                                                style={{width: 200}}
                                                placeholder="Select a tag"
                                                optionFilterProp="children"
                                                onChange={value => handleInputChange(value)}
                                                onBlur={value => handleInputChange(value)}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {allTags.map(tag =>
                                                    <Option value={tag["Id"]} key={tag["Id"]}>{tag["name"]}</Option>
                                                )}
                                            </Select>
                                        )}
                                        {!inputVisible && (
                                            <Tag className="site-tag-plus" onClick={showInput}>
                                                <PlusOutlined/> New Tag
                                            </Tag>
                                        )}
                                    </Card>
                                </Col>
                                :
                                <br/>
                        }
                    </Row>
               </Col>
           </Row>
        </div>
    )


}


export default AddArticle
