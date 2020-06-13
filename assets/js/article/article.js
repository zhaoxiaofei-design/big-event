// 入口函数
$(function () {
    // 加载form模块
    var form = layui.form;

    // 如果插件layui.all.js引入在结构前面，则使用更新渲染
    form.render('select'); // 否则下拉框不显示

    // 设置请求参数
    var data = {
        pagenum: 1, // 页码  1表示获取第1页的数据
        pagesize: 5, // 每页显示多少条数据
        //cate_id:
        //state:
    }

    function renderArticle() {
        $.ajax({
            url: '/my/article/list',
            data: data,
            success: function (res) {
                if (res.status === 0) {
                    // 调用模板引擎渲染文章列表
                    var str = template('tpl-article', res); // 第一个参数是模板id，第二个参数是值
                    $('tbody').html(str);
                }
            }
        });
    }
    // 页面加载完毕，调用函数
    renderArticle();
});