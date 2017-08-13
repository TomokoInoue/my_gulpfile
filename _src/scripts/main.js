;(function() {
    'use strict';

    $(function() {

        /*--------------------------
         ページトップボタンの処理
        --------------------------*/
        var $topBtn = $('#back_to_top');
        var topY = 1200;

        // 最初はボタンを非表示にする
        $topBtn.hide();

        // 下にスクロールした時に表示非表示にする
        $(window).scroll(function() {

            if($(this).scrollTop() > topY) {
                $topBtn.fadeIn();
            } else {
                $topBtn.fadeOut();
            }
        });


        /*--------------------------
         スクロール処理
        --------------------------*/
        $('#back_to_top').hide();

        // スクロールした位置で表示、非表示にする
        $(window).scroll(function() {
            console.log($(this).scrollTop());

            // 取得したスクロールの垂直位置が60より大きかった場合
            if ($(this).scrollTop() > 60) {
                $('.top_page_btn').fadeIn(); // フェードして表示
            } else {
                $('.top_page_btn').fadeOut(); // フェードして非表示
            }
        });

        // クリックした時
        $('a[href^="#"]').on('click', function(evt) {
            evt.preventDefault();

            var $link = $(this).attr('href');
            var $target = $($link === "#" || $link === "" ? "html" : $link);
            var $position = $target.offset().top -110; // コンテンツ要素のトップから110px空ける

            // 指定の場所へ移動する
            $("html, body").animate({
                scrollTop: $position,
                easing: 'linear'
            }, 500);
        });


        /*--------------------------
         アコーディオン処理
        --------------------------*/
        var $toggleBtnElm = $('.rule_btn');
            $toggleBtnElm.on('click',function(evt){
            evt.preventDefault();

            $('.overview_rule').slideToggle();
            $(this).toggleClass('show');
        });


        /*--------------------------
         SNSシェアポップアップの処理
        --------------------------*/
        // Facebook
        $('.js-fb').on('click', function(evt){
            evt.preventDefault();
            popupSns(this.href, 700, 450, 'fbwindow');
        });

        // Twitter
        $('.js-tw').on('click', function(evt){
            evt.preventDefault();
            popupSns(this.href, 550, 420, 'tweetwindow');
        });

        // SNSのポップアップを表示するための処理
        function popupSns(href, w, h, winName, aIndex){
            var x = (screen.width - w) / 2;
            var y = (screen.height - h) / 2;
            var url = href;

            window.open(url, winName, 'left=' + x +', top=' + y + ', width=' + w + ', height=' + h + ', personalbar=0, toolbar=0, scrollbars=1, sizable=1');
        }
    });
})();
