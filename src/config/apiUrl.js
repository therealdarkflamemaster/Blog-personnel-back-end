let ipUrl = 'http://127.0.0.1:7002/admin/'

let servicePath = {
    checkLogin: ipUrl + 'checkLogin', // 检查用户名密码
    getTypeInfo: ipUrl + 'getTypeInfo', // 获得文章类别文字信息
    addArticle: ipUrl+ 'addArticle', // 添加文章
    updateArticle: ipUrl+ 'updateArticle', // 文章修改
}

export default servicePath
