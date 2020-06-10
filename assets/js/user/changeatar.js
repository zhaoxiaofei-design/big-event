// 入口函数
$(function () {
    // 实现剪裁的效果
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 点击 "上传" 选择图片
    $('button:contains("上传")').click(function () {
        // 用代码的方式触发 上传文件(文件域) 的单击事件
        //$('#file').click();
        $('#file').trigger('click');
    });
    // 切换图片之后，更改剪裁区的图片
    // 当文件域的内容改变的时候，更换剪裁区的图片
    $('#file').change(function () {

        // 找到文件对象
        // $image.attr('src','http://images.....')
        var fileObj = this.files[0];
        // 调用JS内置对象URL的createObjectURL方法，为文件对象生成临时的url
        var url = URL.createObjectURL(fileObj);

        // 更换剪裁区的图片（销毁之前的剪裁区 --> 更换图片 --> 重新生成剪裁区）
        $image.cropper('destroy').attr('src', url).cropper(options);
    });
    // 点击 "确定" 剪裁图片，同时更改头像
    $('button:contains("确定")').click(function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                layer.msg(res.message); // 提示一下
                if (res.status === 0) {
                    // 更改成功 调用父页面的getUserInfo
                    window.parent.getUserInfo();
                }
            },
            // my接口  带token
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            complete: function (xhr) { // 判断token是否失效
                if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                    // 清除过期 或者无效的token
                    localStorage.removeItem('token');
                    // 跳转到登录页  window表示当前窗口
                    window.parent.location.href = '/login.html';
                }
            }
        });
    });
});