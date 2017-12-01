$(function(){
    // =========================== 锚点 ================================================
    $('#laotie_header').on('click', 'a', function (e) {
        $(this).siblings('a').removeClass('header_style').end().addClass('header_style');
    });
    // ======================== 鼠标放在图片上面出现二维码 ===============================
    
})