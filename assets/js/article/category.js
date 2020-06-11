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
    var form = layui.form;
    var addIndex;
    var editIndex; // 表示编辑的弹层
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

    // ------------------ 点击 添加类别，弹层 ---------------------------
    $('.layui-card-header button').click(function () {
        addIndex = layer.open({
            type: 1,
            title: '添加类别',
            content: $('#tpl-add').html(),
            area: ['400px', '240px']
        });
    });

    // ------------------ 点击 确认添加，完成添加功能---------------------
    // 使用事件委托方式注册submit事件
    // 给form表单添加一个id
    $('#tpl-add form').on('submit', '#add-form', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // 无论成功或失败，提示
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功 重新渲染
                    renderCategory();
                    // 关闭弹层
                    layer.close(addIndex);
                }
            }
        });
    });

    // ----------------- 点击 编辑，弹层 --------------------------------
    $('body').on('click', 'edit', function () {
        // 获取三个自定义属性
        /*  var id = $(this).attr('data-id');
         var name = $(this).attr('data-name');
         var alias = $(this).attr('data-alias'); */

        var data = this.dataset; // dataset 是DOM属性，使用DOM对象this
        editIndex = layer.open({
            type: 1,
            title: '编辑类别',
            content: $('#tpl-edit').html(),
            area: ['400px', '240px'],
            success: function () {

                // edit-form 是表单的lay-filter属性值
                /* form.val('edit-form', {
                    id: id,
                    name: name,
                    alias: alias
                }); */
                form.val('edit-form', JSON.parse(JSON.stringify(data)));
            }
        });
    });

    // ----------------- 点击 确认修改，ajax提交数据完成修改 --------------
    $('body').on('submit', '#edit-form', function (e) {
        e.preventDefault();
        // var data = $(this).serialize();
        var data = $(this).serializeArray();
        data[0].name = 'Id';

        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    renderCategory();
                    layer.close(editIndex);
                }
            }
        });
    });
});