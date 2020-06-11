// 入口函数
$(function () {
    // 加载表单模块
    var form = layui.form;
    //-----------------------表单验证-------------------
    form.verify({ // 调用方法
        // 验证规则
        len: [/^[\S]{6,12}$/, '长度必须在6~12位之间，且不能出现空格'],

        // 验证原密码与新密码不能相同
        diff: function (val) { // 新密码使用验证规则
            // val 表示新密码
            // 获取原密码
            var oldPwd = $('.oldPwd').val();
            if (oldPwd === val) { // 判断新密码与原密码
                return '新密码不能和原密码相同'
            }
        },
        // 验证新密码与确认密码必须一致
        same: function (val) {
            // val 表示确认密码
            // 获取新密码
            var newPwd = $('.newPwd').val();
            if (val !== newPwd) {
                return '两次密码不一致，请重新输入';
            }
        }
    });

    //---------------------密码重置功能-----------------
    // 获取表单
    $('form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();

        // Ajax提交原密码和新密码
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            // this 指向表单
            data: $(this).serialize(), // 使用serialize方法时，一定要检查表单各项的name
            success: function (res) {
                // 提示
                layer.msg(res.message);
                if (res.status === 0) { // 判断服务器返回状态
                    // 更新成功，重置表单
                    // reset方法，可以重置表单； 但是是一个DOM方法，需要把jQuery对象转成DOM对象
                    $('form')[0].reset();
                }
            },
        });
    });
});