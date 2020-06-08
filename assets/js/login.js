$(function () {
    //------------------切换登录和注册的盒子---------------
    $('#goto-reg').click(function () {
        $('#login').hide().next().show();
    });
    $('#goto-login').click(function () {
        $('#login').show().next().hide();
    });

    //-----------------注册功能-----------------------
    // 监听注册表单的提交事件
    $('#register form').on('submit', function (e) {

        // 阻止默认行为
        e.preventDefault();
        // 获取输入的账号和密码
        var data = $(this).serialize(); // serialize 是根据表单项的name属性获取值的
        // ajax提交账号和密码到接口
        $.ajax({
            type: "POST",
            url: "http://www.liulongbin.top:3007/api/reguser",
            data: data,
            // dataType: "dataType",
            success: function (res) {
                // 根据接口返回的结果
                alert(res.message);
                if (res.status == 0) {
                    $('#login').show().next().hide();
                }
            }
        });

    });

    //----------------注册的表单验证-------------------
    // 使用layui的内置模块,必须先加载
    var form = layui.form;
    // 调用form提供的方法
    form.verify({
        // 自定义验证规则
        len: function (val) {
            if (val.trim().length < 6 || val.trim().length > 12) {
                // ，密码长度必须是6~12位
                return "您输入密码有误";
            }
        },
        same: function (val) {
            // 密码框值获取方式
            var password = $('.pass').val();
            // 比较密码和重复密码
            if (val !== password) {
                return '密码不一致，请重新输入'
            }
        }
    });

    // --------------完成登录功能----------------------
    // 监听登录表单的提交事件
    $('#login form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // ajax提交账号和密码
        $.ajax({
            type: "POST",
            url: "http://www.liulongbin.top:3007/api/login",
            data: $(this).serialize(),
            // dataType: "dataType",
            success: function (res) {
                // 根据服务器返回的结果
                /// alert(res.message);
                layer.msg(res.message);
                if (res.status == 0) {
                    location.href = '/index.html';

                    localStorage.setItem('token', res.token);
                }
            }
        });
    });
});