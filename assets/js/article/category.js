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

    // ------------------ 删除分类功能 ---------------------------------
    // 找到删除按钮，注册单击事件，询问是否要删除
    $('body').on('click', '.delete', function () {
        // 在询问之前，先获取id
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                // 把接口中的 :id 换成实际的数字即可（新的传参方式）
                url: '/my/article/deletecate/' + id,
                // url: '/my/article/deletecate/1' // 删除id为1的分类
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        // 如果删除成功 则重新渲染
                        renderCategory();
                    }
                }
            });
            layer.close(index);
        });
    });
});