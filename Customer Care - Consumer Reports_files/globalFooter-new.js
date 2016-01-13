/* Start Global footer scripts */
(function ($) {
    $(document).ready(function () {
        if(window.location.href.indexOf("ec.consumer") != -1){
            $(".footer-wrapper .footer-cols").css( {
                "display": "table",
                "table-layout": "fixed",
                "width": "100%"
            });

            $(".footer-wrapper .footer-cols .footer-col:first-child").css( {
                "width": "25%",
                "border-right":"1px solid #FFF",
                "padding-left":"0",
                "padding-right": "15px"
            });

            $(".footer-wrapper .footer-cols .footer-col").css( {
                "display": "table-cell",
                "padding-left": "5%"
            });


            $(".footer-wrapper .footer-cols .footer-col .ourSiteList").css( {
                "float": "left",
                "width": "112px"
            });
        }
    });
})(jQuery);
/* End Global footer scripts */
