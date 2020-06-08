// 入口函数
$(function () {
    // 进入到index页面之后 马上发送ajax请求 获取用户的信息 并渲染到页面中
    getUserInfo();

    //--------------退出功能----------------------
    $('#logout').click(function () {
        layer.confirm('确定要退出吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //1. 删除token
            localStorage.removeItem('token');

            //2. 跳转到 login.html
            location.href = '/login.html';
            // 关闭弹出层
            layer.close(index);
        })
    });
});

// 入库函数外面封装， 方便在其他位置调用
function getUserInfo() { // 完成ajax请求，
    $.ajax({
        type: 'GET',
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        // 在ajax请求成功之后触发
        success: function (res) {
            if (res.status === 0) {
                // 1.设置欢迎语 （有昵称，就使用昵称；没有昵称，使用用户名）
                var myname = res.data.nickname || res.data.username;
                $('.myname').text(myname);

                // 2. 设置头像（有图片，就使用图片；没有图片，使用名字的首字母）
                if (res.data.user_pic) {
                    // 使用图片
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-atar').hide();
                } else {
                    var t = myname.substr(0, 1).toUpperCase();

                    $('.text-atar').text(t).css('display', 'inline-block');
                    $('.layui-nav-img').hide();
                }
            } else if (res.status === 1 && res.message === '身份认证失败!') {
                // 说明用户使用了一个假的token,或者就没有token
                // 删除假的token
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = '/login.html';
            }
        },
        // 在ajax请求完成之后触发
        complete: function (xhr) {
            // 判断身份认证是否成功
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 删除假token
                localStorage.removeItem('token');
                // 跳转到登录页面
                location.href = '/login.html';
            }
        },
        // 设置请求头
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    });
}