let ipUrl = 'http://140.238.62.46:7001/admin/'

let servicePath = {
    checkLogin: ipUrl + 'checkLogin', // 检查用户名密码
    addArticle: ipUrl+ 'addArticle', // 添加文章
    updateArticle: ipUrl+ 'updateArticle', // 文章修改
    getArticleList: ipUrl+ 'getArticleList', // 文章表格
    delArticle: ipUrl+ 'delArticle/', // 删除文章
    getArticleById: ipUrl+ 'getArticleById/', // 根据id获得文章
    getTags: ipUrl+ 'getTags', //获得全部的Tags
    getArticlesByTagId: ipUrl+ 'getArticlesByTagId/', // 通过tag id过滤出 文章
    getTagsByArticleId: ipUrl+ 'getTagsByArticleId/', // 通过一篇文章获得其的所有Tags
    getTagsComplete: ipUrl+ 'getTagsComplete', //获得较为完整的tag 信息
    addTag: ipUrl+ 'addTag', //添加新的Tag
    addArticleToTag: ipUrl+ 'addArticleToTag', //添加新的tag和article之间的链接
    delTag: ipUrl+ 'delTag/', // 删除Tag
    delLinkByTagId: ipUrl+ 'delLinkByTagId/', // 删除Link
    delLinkByArticleIdAndTagId: ipUrl+ 'delLinkByArticleIdAndTagId/', // 根据 提供的 ArticleId 和 TagId 删除 在link中的一条数据
}

export default servicePath
