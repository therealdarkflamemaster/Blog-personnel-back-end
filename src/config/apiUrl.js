let ipUrl = 'http://127.0.0.1:7001/admin/'

let servicePath = {
    checkLogin: ipUrl + 'checkLogin', // 检查用户名密码
    getTypeInfo: ipUrl + 'getTypeInfo', // 获得文章类别文字信息
    addArticle: ipUrl+ 'addArticle', // 添加文章
    updateArticle: ipUrl+ 'updateArticle', // 文章修改
    getArticleList: ipUrl+ 'getArticleList', // 文章表格
    delArticle: ipUrl+ 'delArticle/', // 删除文章
    getArticleById: ipUrl+ 'getArticleById/', // 根据id获得文章
    getTags: ipUrl+ 'getTags', //获得全部的Tags
    getArticlesByTagId: ipUrl+ 'getArticlesByTagId/', // 通过tag id过滤出 文章
    getTagsComplete: ipUrl+ 'getTagsComplete', //获得较为完整的tag 信息
    addTag: ipUrl+ 'addTag', //添加新的Tag
}

export default servicePath
