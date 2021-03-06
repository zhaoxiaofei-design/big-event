// 入口函数
$(function () {
    // 加载form模块
    var form = layui.form;

    // 如果插件layui.all.js引入在结构前面，则使用更新渲染
    form.render('select'); // 否则下拉框不显示

    // 加载laypage模块
    var laypage = layui.laypage;


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
                    // 把时间处理成正常的格式
                    /* res.data.forEach(function (item, index) {
                        res.data[index].pub_date = formatDate(res.data[index].pub_date);

                    }); */
                    // 调用模板引擎渲染文章列表
                    var str = template('tpl-article', res); // 第一个参数是模板id，第二个参数是值
                    $('tbody').html(str);

                    // res.total 表示数据总数
                    // 调用showpage，因为只有这里有数据总数
                    showpage(res.total);
                }
            }
        });
    }
    // 页面加载完毕，调用函数
    renderArticle();

    // ----------------------------------- 分页 -------------------------------
    function showPage(t) {
        //执行一个laypage实例
        laypage.render({
            elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
            count: t, //数据总数，从服务端得到
            limit: data.pagesize, // 每页显示多少条
            limits: [2, 3, 4, 5, 6], // 下拉框可设置每页多少条
            curr: data.pagenum, // 当前页
            // groups:5,
            // prev:'上一页'
            layout: ['limit', 'prev', 'page', 'next', 'skip', 'count'], // 自定义排版
            jump: function (obj, first) {
                // console.log(obj); // 分页参数

                if (first === undefined) { // 如果是第一次执行函数，first是true；后续点击页码时，first是undefined
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;

                    renderArticle();
                }
            }
        });
    }
    //  showPage();

    // ---------------------------------- 获取所有的分类，渲染到下拉框中 --------
    $.ajax({
        url: '',
        success: function (res) {
            var str = template('tpl-category', res);
            $('#category').html(str);

            form.render('select'); // 更新渲染
        }
    });

    // ---------------------------------- 搜索区 -----------------------------
    $('#search-from').on('submit', function (e) {
        e.preventDefault();
        var p = $(this).serializeArray();

        // 判断是否选择了分类
        if (p[0].value) {
            data.cate_id = p[0].value;
        } else {
            delete data.cate_id; // delete 删除对象的属性
        }
        // 判断是否选择了状态
        if (p[1].value) {
            data.state = p[1].value;
        } else {
            delete data.state;
        }
        // 搜索之后，看第一页的数据
        data.pagenum = 1;
        // 调用renderArticle，重新获取数据
        renderArticle();
    });

    // ---------------------------------- 删除文章区 -----------------------------
    $('body').on('click', 'delete', function () {
        var that = $(this);
        // 询问是否要删除
        layer.confirm('是否要删除？', function (index) {
            // 点击了确定 获取文章的id
            var id = attr("data-id");
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        renderArticle();
                    }
                }
            });
            layer.close(index);
        });
    });

    // 模板引擎的过滤器功能
    template.defaults.import.add123 = function (value) {
        // return '123' + value;
        return '<span style="color:red;">' + value + '</span>'
    }
    // ---------------------------------- 转换时间格式的函数 -----------------------------
    // 形参 x 就是传进来的时间
    function formatDate(x) {
        var d = new Date(x);
        var year = d.getFullYear();
        var month = addZero(d.getMonth() + 1);
        var day = addZero(d.getDate());
        var hour = addZero(d.getHours());
        var minute = addZero(d.getMinutes());
        var second = addZero(d.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

    }
    // 补零函数
    template.defaults.import.formatData = function addZero(n) {
        return n < 0 ? '0' + n : n;

    }
});