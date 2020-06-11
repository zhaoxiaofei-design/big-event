// 全局变量  加载layui的form模块
var form = layui.form;

// 封装函数：
function renderUser() {
    // 获取用户信息  为表单赋值
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status === 0) { // 如果获取数据成功
                // 数据是 res.data
                // （为表单赋值）设置数据(id、username、nickname、email)
                /*  $('input[name="id"]').val(res.data.id);
                 $('input[name="username"]').val(res.data.username);
                 // 昵称 和 邮箱 没设置默认undefined
                 $('input[name="nickname"]').val(res.data.nickname);
                 $('input[name="email"]').val(res.data.email); */

                // 使用layui提供的快速为表单赋值
                form.val('source', res.data); // 第二个参数是需要赋值的数据
            }
        },
    });
}
// 入口函数
$(function () {
    // ---------------------设置input的value值 （数据回填、为表单赋值）------------
    renderUser();

    // ---------------------监听表单提交事件，完成信息跟新  -----------------------
    $('form').on('submit', function (e) {
        // 1.阻止表单提交行为
        e.preventDefault();
        // 2.收集表单各项的值
        var data = $(this).serialize(); // 不能收集 禁用元素的值
        // 3.Ajax提交给接口
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                // 2.更新完成之后 （看案例效果）
                // 提示一下
                layer.msg(res.data);
                // 更新欢迎语 调用父页面的一个函数 getUserInfo();
                window.parent.getUserInfo();
            },
        });
    });

    // --------------------重置----------------------------
    $('button[type="reset"]').click(function (e) {
        // 阻止默认清空表单行为
        e.preventDefault();
        // 恢复成和之前没改一样
        renderUser();
    });
});