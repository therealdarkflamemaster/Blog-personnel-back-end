import React, {useState, useEffect} from "react";
import marked from 'marked';
import '../static/css/AddArticle.css'
import {Row, Col, Input, Select, Button, DatePicker, message} from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'
import {render} from "react-dom";
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
    const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType, setSelectType] = useState("select type") //选择的文章类别

    useEffect(()=>{
        getTypeInfo()
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

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true
        }).then(
            res => {
                if(res.data.data == 'not login'){
                    localStorage.removeItem('openId')
                    props.history.push('/')
                    console.log('fuck')
                }else {
                    setTypeInfo(res.data.data)
                }
            }
        )
    }


    const selectTypeHandler = (value) => {
        setSelectType(value)
    }

    const saveArticle = () =>{



        if(!selectedType){
            message.error("没有选择文章类型")
            return false
        }else if (!articleTitle){
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
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        let dateText = showDate.replace('-','/')
        dataProps.addTime = (new Date(dateText).getTime())/1000

        if(articleId == 0){
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
                    console.log(res.data.data[0]);
                    let articleInfo = res.data.data[0];
                    setArticleTitle(articleInfo.title)
                    setArticleContent(articleInfo.article_content)

                    let html = marked(articleInfo.article_content)
                    setMarkdownContent(html)
                    setIntroducemd(articleInfo.introduce)
                    let tmpInt = marked(articleInfo.introduce)
                    setIntroducehtml(tmpInt)
                    setShowDate(articleInfo.addTime)
                    setSelectType(articleInfo.typeId)
                }
            )
    }

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
                       <Col span={4}>
                           &nbsp;
                           <Select defaultValue={selectedType} size="large" value={selectedType} onChange={selectTypeHandler}>
                               {
                                   typeInfo.map((item,index)=>{
                                       return(
                                           <Option key= {index} value={item.Id}>{item.typeName}</Option>
                                       )
                                   })
                               }
                           </Select>
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
                    </Row>
               </Col>
           </Row>
        </div>
    )


}


export default AddArticle
