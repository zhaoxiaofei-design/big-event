// 入口函数
$(function () {
    // $.ajaxPrefilter
    $.ajaxPrefilter(function (option) {
        // option 就是ajax选项
        option.url = 'http://www.liulongbin.top:3007' + option.url;
        // 在ajax请求完成之后触发
        option.complete = function (xhr) {
            // 判断身份认证是否成功
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                // 删除假token
                localStorage.removeItem('token');
                // 跳转到登录页面
                window.parent.location.href = '/login.html';
            }
        }
        // 设置请求头
        option.headers = {
            'Authorization': localStorage.getItem('token')
        }
    });
});