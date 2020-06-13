// 入口函数
$(function () {
    // 下拉框不显示，加载form模块
    var form = layui.form;

    // ---------------------- 获取分类，渲染到下拉框中 --------------------------
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            var str = template('tpl-category', res);
            $('select').html(str);

            // 模板引擎处理完之后，重新渲染select
            form.render('select'); // 更新渲染
        }
    });

    // 富文本编辑器 替换内容区
    // 1. 修改内容区的多行文本域的name为content
    initEditor();

    // ---------------------- 图片处理 -----------------------------------------
    // 实现基本的剪裁效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮 可以选择图片（自行添加一个文件域）
    $('.image-btn').click(function () { // image-btn 是按钮
        $('#file').click(); // file 是文件域的id
    });

    // 文件域切换时，可以更改图片
    $('#file').change(function () {
        // 1.找到文件对象
        var fileObj = this.files[0];
        // 2.创建url
        var url = URL.createObjectURL(fileObj);
        // 3.更换剪裁区的图片
        $image.cropper('destroy').attr('src', url).cropper(options);

    });

    // ----------------------- 处理按钮 ----------------------------------------
    // 两个按钮（发布、存为草稿） 都可以造成表单提交 和 触发表单的提交事件，所以两个按钮都是submit类型
    var s = '已发布'; // 默认状态
    // 点击发布，修改 s 为已发布
    $('button:contains("发布")').click(function () {
        s = '已发布';
    });
    // 点击存为草稿，修改 s 为草稿
    $('button:contains("存为草稿")').click(function () {
        s = '草稿';
    });



    // ---------。。。----------- 实现文章发布 -------------------------------------
    $('form').on('submit', function (e) {
        // 阻止表单提交行为
        e.preventDefault();
        //收集表单中的各项数据
        /* var data = $(this).serialize(); */
        // var data = new FormData(表单的DOM对象); // 可以根据表单各项的name属性收集数据
        var data = new FormData(this); // 修改表单各项的name 分别为title、cate_id、content
        // 追加 state
        data.append('state', s);
        // 裁剪图片 得到canvas 画布
        var canvas = $image.cropper('getCroppedCanvas', {
            // 大小根据 前面的 "剪裁选项"
            width: 400,
            height: 280
        });
        // 调用canvas中的 toBlob，把图片转成blob(二进制形式)
        canvas.toBlob(function (blob) {

            // 把二进制形式的图片，追加到data中
            data.append('cover_img', blob);
            for (var ele of data) { // data中包括了三项值

            }
            // ajax提交给接口
            $.ajax({
                url: '/my/article/add',
                type: 'POST',
                data: data,
                // 提交 FormData对象，必须指定两个false
                contentType: false,
                processData: false,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        // 添加成功时，跳转到 文章列表页article.html
                        location.href = '/article/article.html';
                    }
                }
            });
        });

    });
});