/**
    fixing cq behavior/bug when CQ URL re-writer adds "/index.htm" to every URL even though the URL contains anchor, e.g.
    "/cro/2012/06/best-and-worst-used-cars.html#moveto/index.htm" -> "/cro/2012/06/best-and-worst-used-cars.html#moveto"

**/

jQuery(document).ready(function() {
    jQuery("div.paragraph a[href*='#']").filter(function() {return /^.*\/index\.htm$/.test(this.href);}).each(function(index, el) {
        var href = jQuery(el).attr('href');
        if (href.length >= 10) {
            jQuery(el).attr('href', href.substr(0, href.length - 10));
        }
    });

    /**
		fixing problem with scrolling pages in authoring environment after navigation by bookmmark link
    **/
    if(document.URL.indexOf('#') != -1 && document.cookie.match(/cq-scrollpos=/)){
		var path = document.URL.match(/\/cro.*/);
        if(path && path[0] && path[0].match(/.*\.htm/)){
            document.cookie ='cq-scrollpos=; path=' + path[0].match(/.*\.htm/)[0]  +  '; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
    }

});



