function renderCategory() {
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            // 调用template函数
            var str = template('tpl-category', res);
            /* var str = template {
                'tpl-category',
                {
                    status: 0,
                    message: 'cheng',
                    data: [各项数据]
                }
            } */
            // tbody 是模板（数据放入tbody中）
            $('tbody').html(str);
            // $('tbody').html(template('tpl-category', res));
        }
    });
}

// 入口函数
$(function () {
    // ------------------ 分类查询、通过模板引擎渲染到页面 ---------------
    renderCategory();
});