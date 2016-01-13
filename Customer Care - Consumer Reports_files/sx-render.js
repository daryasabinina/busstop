function readCookie(inName)
{
    var theNameWithEquals = inName + "=";
    var theCookieArray = document.cookie.split(';');
    for (var i = 0; i < theCookieArray.length; i++)
    {
        var c = theCookieArray[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(theNameWithEquals) == 0) return c.substring(theNameWithEquals.length, c.length);
    }
    return "";
}

function randomString(inStringLength, inSource)
{
    var theText = "";
    for (var i = 0; i < inStringLength; i++)
    {
        var thePosition = Math.floor(Math.random() * inSource.length);
        theText += inSource.substring(thePosition, thePosition + 1);
    }
    return theText;
}

// This is a pretty horrible hack for JIRA task CROP-675
function x04kill()
{
    var theBugs = jQuery("div .bug");
    if (theBugs)
    {
        if (theBugs.length > 0)
        {
            var theBug = theBugs[0];
            var theImgs = theBug.getElementsByTagName("img");
            if (theImgs)
            {
                if (theImgs.length > 0)
                {
                    var theImg = theImgs[0];
                    var theSrc = theImg.getAttribute("src");
                    if (theSrc.indexOf("cro_cr_plus_full_badge.gif") != -1)
                    {
                        var theAd = document.getElementById("x04");
                        if (theAd)
                        {
                            theAd.parentNode.removeChild(theAd);
                        }
                        var theAdContainers = jQuery("dd .bottompremium");
                        if (theAdContainers)
                        {
                            if (theAdContainers.length > 0)
                            {
                                var theAdContainer = theAdContainers[0];
                                if (theAdContainer)
                                {
                                    theAdContainer.innerHTML = "<div style='background: transparent url(/etc/designs/cro/application-resources/modules/common/images/cro_cr_plus_org_slug.gif) no-repeat scroll right bottom; padding-left: 7px; padding-top: 2px; padding-bottom: 0px; margin-bottom: 2px; margin-right: 3px;'>Get unlimited new and used car price reports.<br/><span style='font-weight: normal;'>Choose car above.</span></div>";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


function renderHomepageAd(divtag){
    if(divtag != undefined && divtag.length > 0){
        renderAd(divtag[0] , "adhomepagetag");
    }
}

function renderAds(){
    x04kill();
    var theDivList = jQuery("div .adtag");
    for (var x = 0; x < theDivList.length; x++){
        renderAd(theDivList[x], "adtag");
    }
    renderElectronicsHeaderJsAd("x95",theDivList);
}

// This variable "isAnAdServerModalPath" is used for custom ForeSee implementation,
// please notify the ForeSee development team if this ever get changed.
isAnAdServerModalPath = false;

function isAnAdPath(checkPath) {
    var hostPath = buildHostPath();
    var adServerModalPaths = [
        "/cro/electronics-computers/",
        "/cro/home-garden/",
        "/cro/appliances/"
    ];

    adServerModalPaths.forEach(function(adPath) {
        if (checkPath.indexOf(hostPath + adPath) == 0) {
            isAnAdServerModalPath = true;
        }
    });

    return isAnAdServerModalPath;
}

function renderElectronicsHeaderJsAd(adId,theDivList){
    if(theDivList!=undefined && theDivList.length>0){
        var adPath = theDivList[0].getAttribute("path");
        if(adPath!=undefined){
            if(isAnAdPath(adPath) || isAnAdPath('cu' + document.location.pathname)) {
                addJsAdToHeadSection(adId,adPath);
            }
        }
    }
}

//this random string has to be same for all the adds in the page irrespective of their location & time of trigger.
var theRandomStr="";
function getRandomString(){
    if(theRandomStr==""){
        theRandomStr = randomString(9, "0123456789");
    }
    return theRandomStr;
}

var thePositionList="";
function getAdPositionList(){
    if(thePositionList==""){
        var theDivList = jQuery("div .adtag,div .adhomepagetag");
        if(theDivList.length > 0){
            thePositionList = theDivList[0].getAttribute("id");
            for (var x = 1; x < theDivList.length; x++){
                thePositionList += "," + theDivList[x].getAttribute("id");
            }
        }
    }
    return thePositionList;
}

function buildHostPath(){
    return document.location.hostname.match('consumer.org') ? 'test.cu' : 'cu';
}

function buildPath (){
    var hostName = buildHostPath();
    var pathName = document.location.pathname;
    return hostName + pathName;
}

function addJsToHeadSectionByPath(id){
    addJsAdToHeadSection(id,buildPath());
}

function addJsAdToHeadSection(id,adPath,type){
    var adsType = type ? '&type=' + type : '';
    var theRandomNumber = getRandomString();
    var theAdScript = document.createElement("script");
    if(thePositionList !== '') {
        thePositionList += ',' + id;
    }
    var theAdCookie = readCookie("userAds");
    if (!theAdCookie || !CRUserInfo.getUser())
    {
        theAdCookie = "";
    }
    else
    {
        if ((theAdCookie.length >= 1) && (theAdCookie.substr(theAdCookie.length - 1) != '&'))
        {
            theAdCookie = theAdCookie + "&";
        }
    }

    var theSrc = "http://oascentral.consumerreports.org/RealMedia/ads/adstream_sx.ads/" +
        adPath + "/1"+theRandomNumber + "@" + (thePositionList ? thePositionList + "!" : "") + id + "?url=" + encodeURIComponent(window.location.href) + "&" +
        theAdCookie + "article=112345&XE&status=active" + OAS_rdl + "&if_nt_CookieAccept=" + OAS_CA + "&XE" + adsType;
    theAdScript.setAttribute("src",theSrc);
    document.getElementsByTagName('head')[0].appendChild(theAdScript);
}

function renderAd(theDiv, location){
    var theRandomOverride = getRandomString(); //using getRandomString() instead of randomString(9, "0123456789"); making sure to use: same random number for all ads irrespective of their location & time of trigger.
    var theAd = document.createElement("iframe");
    theAd.setAttribute("width", theDiv.getAttribute("width"));
    theAd.setAttribute("height", theDiv.getAttribute("height"));
    if (theDiv.getAttribute("passthrustyle"))
    {
        if (typeof(theAd.style.cssText) == 'string')
        {
            theAd.style.cssText = theDiv.getAttribute("passthrustyle");
        }
        theAd.setAttribute("style", theDiv.getAttribute("passthrustyle"));
    }
    if (theDiv.getAttribute("passthruclass"))
    {
        theAd.className = theDiv.getAttribute("passthruclass");
        theAd.setAttribute("class", theDiv.getAttribute("passthruclass"));
    }
    if (theDiv.getAttribute("allowtransparency"))
    {
        theAd.allowtransparency = "true";
        theAd.setAttribute("allowtransparency", "true");
    }
    theAd.setAttribute("scrolling", "no");
    var theBrowser = navigator.appName;
    if(theBrowser == "Microsoft Internet Explorer"){
        theAd.frameBorder = theAd.marginWidth = theAd.marginHeight = 0;
    } else {
        theAd.setAttribute("frameborder", "0");
        theAd.setAttribute("marginwidth", "0");
        theAd.setAttribute("marginheight", "0");
    }
    theAd.setAttribute("id", theDiv.getAttribute("id"));
    theAd.setAttribute("name", theDiv.getAttribute("id"));
    var theAdCookie = readCookie("userAds");
    if (!theAdCookie || !CRUserInfo.getUser())
    {
        theAdCookie = "";
    }
    else
    {
        if ((theAdCookie.length >= 1) && (theAdCookie.substr(theAdCookie.length - 1) != '&'))
        {
            theAdCookie = theAdCookie + "&";
        }
    }
    var thePath = "";
    if(theDiv.getAttribute("path")){
        thePath = theDiv.getAttribute("path");
    }else{
        thePath = buildPath();
    }

    var theSrc = "http://oascentral.consumerreports.org/RealMedia/ads/adstream_sx.ads/" + thePath +
        "/1" + theRandomOverride + "@" + getAdPositionList() + "!" + theDiv.getAttribute("id") + "?url=" + encodeURIComponent(window.location.href) + "&" +
        theAdCookie + "article=112345&XE&status=active" + OAS_rdl + "&if_nt_CookieAccept=" + OAS_CA + "&XE" + getHasBuyingGuideOnlyString(theDiv.getAttribute("id"));
    // OAS_rdl and OAS_CA are set by https://oascentral.consumerreports.org/Scripts/oas_analytics.js
    theAd.setAttribute("src", theSrc);
    theDiv.parentNode.insertBefore(theAd, theDiv);
    theDiv.parentNode.removeChild(theDiv);
}

function getHasBuyingGuideOnlyString(id) {
    var checkBuyingGuideOnlyAds = ["x55", "x57", "x56", "Top"];
    return window.hasBuyingGuideOnly && checkBuyingGuideOnlyAds.indexOf(id) !== -1 && !CRUserInfo.hasSubscriptions() ? "&bg=y" : "";
}

function adjustIFrame(iframeId, height) {
    if(iframeId && height) {
        var frame = document.getElementById(iframeId)
        if (frame) {
            frame.height = height;
        }
    }
}

function getFrameId(url) {
    var frames = /@(.*[,!])+(.*)\?/.exec(url);
    return frames ? frames[2] : null;
}

function getHeaderDonateUrl() {
    var theCacheBuster = randomString(9,"0123456789");
    window.open("http://oascentral.consumerreports.org/RealMedia/ads/click_lx.ads/cu/header/donateclicktracker/" + theCacheBuster + "/x75/Consumer/Donate_CU_ROS-Header_LI-LO_Clicks_x75/shim.gif/1", "_blank");
}

function getFooterDonateUrl() {
    var theCacheBuster = randomString(9,"0123456789");
    window.open("http://oascentral.consumerreports.org/RealMedia/ads/click_lx.ads/cu/cro/footer/donateclicktracker/" + theCacheBuster + "/x76/Consumer/Donate_CU_ROS-Footer_LI-LO_Clicks_x76/shim.gif/1", "_blank");
}

if ((typeof window.postMessage != 'undefined') && (typeof window.addEventListener != 'undefined')) {
    window.addEventListener('message', function(event){
        adjustIFrame(getFrameId(event.data.url), event.data.height);
    }, false);
}

function renderAdSrcs()
{
    x04kill();
    var theRandomOverride = randomString(9, "0123456789");
    var theIFrameList = jQuery("iframe .adtag");
    var thePositionList = "";
    if(theIFrameList.length > 0)
    {
        thePositionList = theIFrameList[0].getAttribute("id");
        for (var x = 1; x < theIFrameList.length; x++)
        {
            thePositionList += "," + theIFrameList[x].getAttribute("id");
        }
    }
    for (var x = 0; x < theIFrameList.length; x++)
    {
        var theAd = theIFrameList[x];
        var theAdCookie = readCookie("userAds");
        if (!theAdCookie)
        {
            theAdCookie = "";
        }
        else
        {
            if ((theAdCookie.length >= 1) && (theAdCookie.substr(theAdCookie.length - 1) != '&'))
            {
                theAdCookie = theAdCookie + "&";
            }
        }
        var thePath = "";
        if(theAd.getAttribute("path")){
            thePath = theAd.getAttribute("path");
        }else{
            thePath = buildPath();
        }
        var theSrc = "http://oascentral.consumerreports.org/RealMedia/ads/adstream_sx.ads/" + thePath +
            "/1" + theRandomOverride + "@" + thePositionList + "!" + theAd.getAttribute("id") + "?url=" + encodeURIComponent(window.location.href) + "&" +
            theAdCookie + "article=112345&XE&status=active" + OAS_rdl + "&if_nt_CookieAccept=" + OAS_CA + "&XE";
        // OAS_rdl and OAS_CA are set by https://oascentral.consumerreports.org/Scripts/oas_analytics.js
        theAd.setAttribute("src", theSrc);
    }
}

/*
 Developed by Robert Nyman, http://www.robertnyman.com
 Code/licensing: http://code.google.com/p/getelementsbyclassname/
 */

var getElementsByClassName = function (className, tag, elm){
    if (document.getElementsByClassName) {
        getElementsByClassName = function (className, tag, elm) {
            elm = elm || document;
            var elements = elm.getElementsByClassName(className),
                nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
                returnElements = [],
                current;
            for(var i=0, il=elements.length; i<il; i+=1){
                current = elements[i];
                if(!nodeName || nodeName.test(current.nodeName)) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    else if (document.evaluate) {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = "",
                xhtmlNamespace = "http://www.w3.org/1999/xhtml",
                namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
                returnElements = [],
                elements,
                node;
            for(var j=0, jl=classes.length; j<jl; j+=1){
                classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
            }
            try {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
            }
            catch (e) {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
            }
            while ((node = elements.iterateNext())) {
                returnElements.push(node);
            }
            return returnElements;
        };
    }
    else {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = [],
                elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
                current,
                returnElements = [],
                match;
            for(var k=0, kl=classes.length; k<kl; k+=1){
                classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
            }
            for(var l=0, ll=elements.length; l<ll; l+=1){
                current = elements[l];
                match = false;
                for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
                    match = classesToCheck[m].test(current.className);
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    return getElementsByClassName(className, tag, elm);
};

// Donate light-box
jQuery(function ($) {
    var buildUrl = function() {
        var hostName = document.location.hostname.match('consumer.org') ? 'test.cu' : 'cu';
        var pathName = document.location.pathname;
        return hostName + pathName;
    }

    var DONATE_TAG_ID = "x20";
    var PATH = buildUrl();
    var STRUCTURE_TO_CREATE = '<div id="donate-iframe-div" class="donate-iframe-div" style="display:none;">' +
        '<img id="donate-lightbox-close-btn" class="donate-lightbox-close-btn" style="display:none;" src="/etc/designs/cro/application-resources/modules/ratingschart/b_close.png" alt="x">' +
        '<h3>Donate to Consumer Reports</h3>' +
        '<div id="' + DONATE_TAG_ID + '" class="adtag" passthruclass="donate-iframe" path="' + PATH + '" width="420" height="255"></div>' +
        '</div>';

    var animate = function(event) {
        var togglePopup = function() {
            $('#donate-iframe-div, #donate-lightbox-fade, #donate-lightbox-close-btn').toggle();
        }
        if(event.target.id=="donate-lightbox-close-btn") {
            togglePopup();
        } else {
            var s = s_gi(s_account),
                isHeader = jQuery(event.currentTarget).closest(".header").length > 0,
                overrides = {};
            overrides.linkTrackVars='prop48,eVar48';
            if (!!window.isDonatePopup) {
                if(!$('#donate-iframe-div').length) {
                    $(STRUCTURE_TO_CREATE).appendTo('body');
                    $('<div/>',{id:'donate-lightbox-fade'}).addClass('donate-lightbox-black_overlay').css('display', 'none').appendTo('body');
                    $('#donate-lightbox-close-btn').bind('click', animate);
                    if(thePositionList !== '') {
                        thePositionList += ',' + DONATE_TAG_ID;
                    }
                    renderAd(document.getElementById(DONATE_TAG_ID));
                }
                overrides.prop48 = overrides.eVar48 = s.pageName + " | donate_lightbox";
                if(isHeader) {
                    overrides.linkTrackEvents = 'event24,event32';
                    overrides.events='event24,event32';
                }else{
                    overrides.linkTrackEvents = 'event24,event33';
                    overrides.events='event24,event33';
                }
                s.tl(event.target, 'o', 'Donate', overrides);
                togglePopup();
            } else {
                overrides.prop48 = overrides.eVar48 = s.pageName + " | donate_default";
                if(isHeader) {
                    overrides.linkTrackEvents = 'event24,event32';
                    overrides.events='event24,event32';
                    s.tl(event.target, 'o', 'Donate', overrides);
                    getHeaderDonateUrl();
                }else{
                    overrides.linkTrackEvents = 'event24,event33';
                    overrides.events='event24,event33';
                    s.tl(event.target, 'o', 'Donate', overrides);
                    getFooterDonateUrl();
                }
            }
            event.preventDefault();
        }
    }
    $('.donate-lightbox-btn').attr("href","javascript:void()");
    $('.donate-lightbox-btn').bind('click', animate);
});


//collapsibleText component script
jQuery(function($){
    $('.collapsible-text-content').removeClass('hidden').addClass('collapse');
    $('.collapsible-text-label.collapsible').click(function(){
        $(this).siblings('.collapsible-text-content').toggle(200).end().toggleClass('collapsed');

        var target = event.currentTarget || event;
        var sourceTarget = event.target || target;
        var track = jQuery(target).text().trim();
        var s = s_gi(s_account);
        var overrides = {};
        var pattern = /collapsed$/ig;
        var classValue = (sourceTarget != null) ? $(this).attr("class") : null;

        if(track!=undefined && (classValue != null && pattern.test(classValue))){
            overrides.linkTrackVars='prop48,eVar48';
            overrides.prop48 = overrides.eVar48 = s.pageName + " | " + track;
            s.tl(sourceTarget, 'o', track, overrides);
        }

        return false;
    });
});

//predictive search tracking on mobile
jQuery(function($){
    var isMobile = (typeof CUMobileSettings === "object");

    if(isMobile){
        $('.results-outer-box').on("click", ".results-inner-box a", function (e) {
                                        var keyword = $(e.currentTarget).text();
                                        CUMobile.setCookie('predictSearch', keyword, 1);
                                  });
    }
});
var headerElementsTracking = function(source){
    var s = s_gi(s_account),
        overrides = {},
        target = source.currentTarget || source,
        sourceTarget = source.target || target,
        track = jQuery(sourceTarget).data("track") || jQuery(target).data("track"),
        trackTitle = jQuery(sourceTarget).data("track-title") || jQuery(target).data("track-title");
    if(track!=undefined){
        overrides.linkTrackVars='prop48,eVar48,eVar22';
        overrides.linkTrackEvents = 'event32';
        overrides.events='event32';
        overrides.prop48 = overrides.eVar48 = s.pageName + " | " + track;
        overrides.eVar22 = "+1";
        if (trackTitle === 'Search' || trackTitle === 'Search_mobile') {
            var searchElementId = jQuery(sourceTarget).data("search-element") || jQuery(target).data("search-element") || 'search';
            var searchKeyword = jQuery(sourceTarget).data("search-keyword") || jQuery(target).data("search-keyword") || jQuery('#'+searchElementId).val();
            if (searchKeyword) searchKeyword = searchKeyword.toLowerCase();
            overrides.prop10 = overrides.eVar2 = searchKeyword;
            overrides.prop11 = s.pageName;
            overrides.linkTrackVars += ',prop10,prop11,eVar2';
            if (trackTitle === 'Search_mobile'){
                delete overrides.eVar67;
                overrides.linkTrackVars = overrides.linkTrackVars.replace(',eVar67','');
                overrides.linkTrackVars += ',prop58,eVar58';
                overrides.prop10 = overrides.eVar2 = !!jQuery(sourceTarget).text() ?  jQuery(sourceTarget).text() : jQuery('#search').val();
            }
            overrides.linkTrackEvents += ',event2';
            overrides.events += ',event2';
        }
        s.tl(sourceTarget, 'o', trackTitle, overrides);
    }
};

var footerElementsTracking = function(event){
    var s = s_gi(s_account),
        overrides = {},
        track = "-footer",
        trackTitle = "Footer";
    if(jQuery(event.currentTarget).prop("tagName") == "IMG"){
        trackTitle = jQuery.trim(jQuery(event.currentTarget).attr("alt"));
    }else{
        trackTitle = jQuery.trim(jQuery(event.currentTarget).text());
    }
    track = trackTitle.toLowerCase().replace(/\s/g, "_") + "-footer";
    overrides.linkTrackVars='prop48,eVar48';
    overrides.linkTrackEvents = 'event33';
    overrides.events='event33';
    overrides.prop48 = overrides.eVar48 = s.pageName + " | " + track;
    if(trackTitle != "Donate")
        s.tl(event.target, 'o', trackTitle, overrides);
};

//header/footer track events
jQuery(function($){
    $("#sign-up-myaccount, #sign-up-cservice, #sign-up-sitefeatures, #sign-in-link, #sign-in-link2, #sign-in-btn," +
        " .sign-in-link, #AZ-link a, .nvm-nav-item a, .logo a, div#main_nav a, #subscribe-link,"+
        ".ifCRO a, .ifHealth a, .ifCBDP a, .ifAPSNew a, .ifAPSUsed a, .ifCRMag a,"+
        ".ifOnHealth a, .ifMoneyAdviser a, .ifShopSmart a, #user_acount_button, #sign-in-manage-account, #main-sub-nav a,"+
        "#typeahead .input-box-button").click(headerElementsTracking);

    if ($.fn.live)
        $(".results-inner-box a, .results-inner-box-active a").live("click", headerElementsTracking);
    else
        $(".results-inner-box a, .results-inner-box-active a").on("click", headerElementsTracking);

    $(".footer a, .footer .buttons img").click(footerElementsTracking);
});
