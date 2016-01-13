// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
;(function($){
    $.fn.hero = function(){
        var $wrapper = $(this).first();
        var $videoControls = $(".hero-image-wrapper .vjs-control-bar");

        var ratio = $wrapper.data("ratio") || 0.3;
        var minHeight = $.GLOBAL_OVERWRITE_HERO_MIN_HEIGHT || $wrapper.data("min-height") || 0;

        var $innerWrapper = $wrapper.find(".inner-wrapper");

        var scrollTop;
        var animate = function(){
            if (( (scrollTop = $(document).scrollTop()) < $wrapper.height() - minHeight )) {
                if (scrollTop < 0) scrollTop = 0;
                $wrapper.css({
                    transform : "translate3d(0, -" +   Math.floor(scrollTop ) + "px ,0)"
                });
                $innerWrapper.css({
                    transform : "translate3d(0, " +   Math.floor(scrollTop * ratio ) + "px ,0)"
                });
                $videoControls.css({
                    bottom : Math.floor(scrollTop * ratio ) + "px"
                });
                
                if ($("html").hasClass("hero-image-pinned")){
                    $(window).trigger('heroImageUnpinned');
                    $(window).trigger('heroImagePinnedEvent',0);
                    $("html").removeClass("hero-image-pinned");
                }
            } else {
                $wrapper.css({
                    transform : "translate3d(0, -" +   Math.floor($wrapper.height() - minHeight) + "px ,0)"
                });
                $innerWrapper.css({
                    transform : "translate3d(0, " +   Math.floor(($wrapper.height() - minHeight) * ratio) + "px ,0)"
                });
                $videoControls.css({
                    bottom : Math.floor(($wrapper.height() - minHeight) * ratio) + "px"
                });

                if (!$("html").hasClass("hero-image-pinned")){
                    $(window).trigger('heroImagePinned');
                    $(window).trigger('heroImagePinnedEvent',minHeight);
                    $("html").addClass("hero-image-pinned");
                }
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    };

    //$(function(){
    //    $('*[data-ratio]').each(function(){
    //        $(this).hero();
    //    });
    //});
})(jQuery);
/*
// @name: Responsive-img.js
// @version: 1.1
// 
// Copyright 2013-2014 Koen Vendrik, http://kvendrik.com
// Licensed under the MIT license
*/function makeImagesResponsive(){var e=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,t=document.getElementsByTagName("body")[0].getElementsByTagName("img");if(t.length===0)return;var n;t[0].hasAttribute?n=function(e,t){return e.hasAttribute(t)}:n=function(e,t){return e.getAttribute(t)!==null};var r=window.devicePixelRatio?window.devicePixelRatio>=1.2?1:0:0;for(var i=0;i<t.length;i++){var s=t[i],o=r&&n(s,"data-src2x")?"data-src2x":"data-src",u=r&&n(s,"data-src-base2x")?"data-src-base2x":"data-src-base";if(!n(s,o))continue;var a=n(s,u)?s.getAttribute(u):"",f=s.getAttribute(o),l=f.split(",");for(var c=0;c<l.length;c++){var h=l[c].replace(":","||").split("||"),p=h[0],d=h[1],v,m;if(p.indexOf("<")!==-1){v=p.split("<");if(l[c-1]){var g=l[c-1].split(/:(.+)/),y=g[0].split("<");m=e<=v[1]&&e>y[1]}else m=e<=v[1]}else{v=p.split(">");if(l[c+1]){var b=l[c+1].split(/:(.+)/),w=b[0].split(">");m=e>=v[1]&&e<w[1]}else m=e>=v[1]}if(m){var E=d.indexOf("//")!==-1?1:0,S;E===1?S=d:S=a+d;s.src!==S&&s.setAttribute("src",S);break}}}}if(window.addEventListener){window.addEventListener("load",makeImagesResponsive,!1);window.addEventListener("resize",makeImagesResponsive,!1)}else{window.attachEvent("onload",makeImagesResponsive);window.attachEvent("onresize",makeImagesResponsive)};
;(function($){

    var AreaVisibleDetect = function(el, options){
        this.el = el;
        this.$el = $(el);
        this.options = $.extend({}, AreaVisibleDetect.defaults, options);
        
        this.init();
    };

    $.extend(AreaVisibleDetect.prototype, {
        init : function(){
            this.wasOutOfArea = false;
            this.namespaceOfEvent = this.options.areaName + ".viewportChanged";
            requestAnimationFrame( this.animate.bind(this) );
        },
        isOutOfArea: function () {
            var viewPortOffsetTop       = $(window).scrollTop(),
                viewPortBottomOffsetTop = $(window).scrollTop() + $(window).height();

            var areaOffsetTop  = this.$el.offset().top,
                areaHeight     = this.$el.outerHeight();

            var middleOfTheAreaOffsetTop = areaOffsetTop + areaHeight / 2;

            return viewPortOffsetTop > middleOfTheAreaOffsetTop || viewPortBottomOffsetTop < middleOfTheAreaOffsetTop;
            
        },
        isOnArea: function () {
            return !this.isOutOfArea();
        },
        animate : function animate(){
            if (this.wasOutOfArea) {
                if (this.isOnArea()) {
                    this.wasOutOfArea = false;
                    $(window).trigger(this.namespaceOfEvent + ".in", this.$el);
                }
            } else {
                if (this.isOutOfArea()) {
                    this.wasOutOfArea = true;
                    $(window).trigger(this.namespaceOfEvent + ".out", this.$el);
                }
            }
            requestAnimationFrame( this.animate.bind(this) );
        }
    });
    
    $.fn.areaVisible = function(options){
        return this.each(function(){
            $(this).data('areaVisible', new AreaVisibleDetect(this, options));
        });
    };

    AreaVisibleDetect.defaults = {
        areaName : "area"
    }
}(jQuery));
;(function($){
    $(window).bind("heroVideoReady", function(event, player){
        var $el = $( player.el()).closest(".hero-image-wrapper");

        $el.areaVisible({
            areaName : "hero" 
        });

        $(window).bind("hero.viewportChanged.out",  player.pause.bind(player));

        player.on("loadedmetadata", function(meta){
            var $poster = $(".hero-vjs-poster");

            $poster.find(".play-button").show().click(function(){
                player.play();
                $(this).parent().fadeOut(400, function(){
                    $(this).closest(".hero-component-wrapper")
                        .removeClass("image")
                        .addClass("video")
                        .find(".inner-wrapper.video").css('visibility','visible');
                    $(".hero-image-par").addClass("video");
                });
            });
        });

    });
}(jQuery));


$(function() {
    $(".hero-vjs-poster")
        .closest(".hero-component-wrapper")
        .removeClass("video")
        .addClass("image");
});
function configYoutubeHeroSection(config) {
    var $container, selector, _preset, $player;

    if (config.id && config.videoURL) {
        selector = '#' + config.id;

        /**
         *  @configuration:  https://github.com/pupunzi/jquery.mb.YTPlayer/wiki
         */

        _preset = {
            videoURL: config.videoURL,
            containment: selector + ' .videoWrapper',
            startAt: 0,
            quality: 'large',
            mute: true,
            autoPlay: config.autoPlay === 'true',
            showControls: config.showControls  === 'true',
            loop: config.loop === 'true',
            ratio: 'auto',
            showYTLogo: false,
            locationProtocol: '//'
        };

        $container = jQuery(selector);
        $player = $container.find('.player');
        $player.YTPlayer(_preset);

        if (!_preset.autoPlay) {
            $container.on('click', function () {
                $player.YTPTogglePlay();
            });
        }

        $container.on("YTPReady", function(e){
            $('.hero-component-wrapper .hero-vjs-poster').hide();
            $('.hero-component-wrapper .inner-wrapper.video').css('visibility','visible');
        });

    }
}
/**
 * JQuery plugin for creating of a drop zone for CQ content finder objects
 *
 * @param {function} cbFunction - call-back function to handle drop event
 *
 *      cbFunction(ds, e, dd, element)
 *      Parameters:
 *      	@param {CQ.Ext.dd.DragSource} ds - The drag source that was dragged over this drop zone
 *      	@param {Event} e - The event
 *      	@param {Object} dd - An object containing arbitrary data supplied by the drag source
 *      	@param {Element} element - An jquery html element
 *      Returns:
 *			Boolean - True if the drop was valid, else false
 */

(function($){

    $.fn.addDropZone = function(cbFunction,allowFunction)
    {

        return this.each(function(){

            var element = this;

            var target = new CQ.Ext.Panel({
                renderTo: element,

                afterRender:function() {

                    CQ.Ext.Panel.prototype.afterRender.apply(this, arguments);
                    this.dd = new CQ.Ext.dd.DropZone(element, {
                        ddGroup: 'media',
                        title: 'dropZone',

                        notifyDrop:function(ds, e, dd) {
                            if(allowFunction(dd)){
                                return cbFunction(ds, e, dd, element);
                            }
                            return false;
                        },

                        normalize: function() {},

                        onContainerOver : function(dd, e, data){
                            if(allowFunction(data)){
                                $(element).css("border","10px solid #b9db52")
                                return this.dropAllowed
                            } else {
                                return this.dropNotAllowed
                            }
                        },
                        notifyOut : function(dd, e, data){
                            $(element).css("border","")
                        },

                        flash: function(){}

                    });
                },

                getDropTargets: function() {
                    return [ this.dd ];
                }

            })

            CQ.WCM.registerDropTargetComponent(target)

        });
    };

    $.fn.addMultipleBrightCoveVideoDropZone = function(nodePath,storedVideoIds){
        this.addDropZone(function (ds, e, dd, element) {
            var videoIds = []
            if(storedVideoIds.length>0){
                videoIds = videoIds.concat(storedVideoIds)
            }
            for(var i in dd.records){
                if(i!="remove"){
                    videoIds = videoIds.concat(parseInt(dd.records[i].id));
                }
            }
            var params = {
                "./videoID" : videoIds,
                "./isVideoMetaDataUpdated" : "true",
                "./sling:resourceType" : "electronics/components/general/videoWidget"
            }

            CQ.HTTP.post(CQ.shared.HTTP.encodePath(nodePath),
                function(options, success, response) {
                    if (success) {
                        window.location.reload();
                    }
                },
                params
            );

            return true;
        }, function(dd){
            return dd.records[0].data.videoId ? true : false;
        })
    };

    $.fn.addSingleBrightCoveVideoDropZone = function(nodePath){
        this.addDropZone(function (ds, e, dd, element) {
            CQ.HTTP.post(CQ.shared.HTTP.encodePath(nodePath),
                function(options, success, response) {
                    if (success) {
                        window.location.reload();
                    }
                },
                {
                    "./videoID" : parseInt(dd.records[0].id)
                }
            );

            return true;
        }, function(dd){
            return dd.records[0].data.videoId ? true : false;
        })
    };
})(jQuery);

$.fn.heroImageDropZone = function(nodePath, isAutopopulateTitle){
    this.addDropZone(function (ds, e, dd, element) {
        $.get(CQ.shared.HTTP.encodePath(nodePath) + ".1.json").always(function(data){
            var storedId = getStoreId();
            var isVideoDropped = storedId.indexOf("/content/dam") == -1;

            CQ.HTTP.post(CQ.shared.HTTP.encodePath(nodePath),
                function (options, success, response) {
                    if (success) {
                        window.parent.location.reload();
                    }
                },
                getParams()
            );

            //return id of dropped video or image (for image id contains DAM path)
            function getStoreId() {
                var id = "";
                for(var i in dd.records){
                    if(i!="remove"){
                        id = dd.records[i].id;
                    }
                }
                return id;
            }

            //generate additional request params for image or video
            function getParams() {
                var params = {};
                if (isVideoDropped) {
                    params["./videoId"] = storedId;
                    params["./type"] = getType();
                    params["./videoService"] = "brightcove";
                } else {
                    params["./fileReference"] = storedId;
                    params["./type"] = getType();
                    params["./imageCrop"] = calculateCrop();
                }
                return params;
            }

            function calculateCrop(){
                var data = CQ.HTTP.eval(CQ.HTTP.get(CQ.HTTP.externalize(storedId + '.infinity.json')));
                var width = data['jcr:content'].metadata['tiff:ImageWidth'];
                var height = data['jcr:content'].metadata['tiff:ImageLength'];
                var ratio = getRatio(width, height);
                return [0, 0, ratio.width, ratio.height].join(",");
            }

            function getRatio(imageWidth, imageHeight){
                var resultWidth = 0,
                    resultHeight = 0,
                    ratioWidth = 2.36,
                    ratioHeight = 1,
                    imageWidthRatio=imageWidth/imageHeight;

                if(imageWidthRatio >= ratioWidth){
                    resultHeight = imageHeight;
                    resultWidth = Math.round(imageHeight * ratioWidth);
                } else {
                    resultWidth = imageWidth;
                    resultHeight = Math.round(imageWidth / ratioWidth);
                }

                return {
                    width:resultWidth,
                    height:resultHeight
                }
            }

            function getType() {
                return !isVideoDropped || data['sling:resourceType'].indexOf("electronics/components/general/buyingguide/heroimage") > -1
                    ? 'image'
                    : 'video';
            }
        });
            
        return true;
    }, function(dd){
        return dd.records[0].data.videoId || dd.records[0].id.indexOf("/content/dam") > -1;
    });
    return this;
};
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
;(function($){

})(jQuery);
function configYoutubeHeroSection(config) {
    var $container, selector, _preset, $player;

    if (config.id && config.videoURL) {
        selector = '#' + config.id;

        /**
         *  @configuration:  https://github.com/pupunzi/jquery.mb.YTPlayer/wiki
         */

        _preset = {
            videoURL: config.videoURL,
            containment: selector + ' .videoWrapper',
            startAt: 0,
            quality: 'large',
            mute: true,
            autoPlay: config.autoPlay === 'true',
            showControls: config.showControls  === 'true',
            loop: config.loop === 'true',
            ratio: 'auto',
            showYTLogo: false,
            locationProtocol: '//'
        };

        $container = jQuery(selector);
        $player = $container.find('.player');
        $player.YTPlayer(_preset);

        if (!_preset.autoPlay) {
            $container.on('click', function () {
                $player.YTPTogglePlay();
            });
        }

        $container.on("YTPReady", function(e){
            $('.hero-component-wrapper .hero-vjs-poster').hide();
            $('.hero-component-wrapper .inner-wrapper.video').show();
        });

    }
}
/**
 * Brightcove JavaScript MAPI Wrapper 1.2 (16 FEBRUARY 2011)
 * (Formerly known as Kudos)
 *
 * REFERENCES:
 *	 Website: http://opensource.brightcove.com
 *	 Source: http://github.com/brightcoveos
 *
 * AUTHORS:
 *	 Brian Franklin <bfranklin@brightcove.com>
 *	 Matthew Congrove <mcongrove@brightcove.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, alter, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the following conditions:
 *
 * 1. The permission granted herein does not extend to commercial use of
 * the Software by entities primarily engaged in providing online video and
 * related services.
 *
 * 2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, SUITABILITY, TITLE,
 * NONINFRINGEMENT, OR THAT THE SOFTWARE WILL BE ERROR FREE. IN NO EVENT
 * SHALL THE AUTHORS, CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY WHATSOEVER, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE, INABILITY TO USE, OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * 3. NONE OF THE AUTHORS, CONTRIBUTORS, NOR BRIGHTCOVE SHALL BE RESPONSIBLE
 * IN ANY MANNER FOR USE OF THE SOFTWARE.  THE SOFTWARE IS PROVIDED FOR YOUR
 * CONVENIENCE AND ANY USE IS SOLELY AT YOUR OWN RISK.  NO MAINTENANCE AND/OR
 * SUPPORT OF ANY KIND IS PROVIDED FOR THE SOFTWARE.
 */

var BCMAPI = new function () {
	this.token = "";
	this.callback = "BCMAPI.flush";
	this.url = "http://api.brightcove.com/services/library";
	this.calls = [
		{ "command" : "find_all_videos", "def" : false },
		{ "command" : "find_video_by_id", "def" : "video_id" },
		{ "command" : "find_video_by_id_unfiltered", "def" : "video_id" },
		{ "command" : "find_videos_by_ids", "def" : "video_ids" },
		{ "command" : "find_videos_by_ids_unfiltered", "def" : "video_ids" },
		{ "command" : "find_video_by_reference_id", "def" : "reference_id" },
		{ "command" : "find_video_by_reference_id_unfiltered", "def" : "reference_id" },
		{ "command" : "find_videos_by_reference_ids", "def" : "reference_ids" },
		{ "command" : "find_videos_by_reference_ids_unfiltered", "def" : "reference_ids" },
		{ "command" : "find_videos_by_campaign_id", "def" : "campaign_id" },
		{ "command" : "find_videos_by_tags", "def" : "or_tags" },
		{ "command" : "find_videos_by_text", "def" : "text" },
		{ "command" : "find_videos_by_user_id", "def" : "user_id" },
		{ "command" : "find_modified_videos", "def" : "from_date" },
		{ "command" : "find_related_videos", "def" : "video_id" },
		{ "command" : "find_all_playlists", "def" : false },
		{ "command" : "find_playlist_by_id", "def" : "playlist_id" },
		{ "command" : "find_playlists_by_ids", "def" : "playlist_ids" },
		{ "command" : "find_playlist_by_reference_id", "def" : "reference_id" },
		{ "command" : "find_playlists_by_reference_ids", "def" : "reference_ids" },
		{ "command" : "find_playlists_for_player_id", "def" : "player_id" },
		{ "command" : "search_videos", "def" : "all" }
	];

	/**
	 * Injects API calls into the head of a document
	 * @since 0.1
	 * @param string [pQuery] The query string for the API call to inject
	 * @return true
	 */
	this.inject = function (pQuery) {
        var callbackName = pQuery.substring(pQuery.indexOf('callback') + 9);
        callbackName = callbackName.indexOf('&') != -1 ? callbackName.substr(0,callbackName.indexOf('&')) : callbackName;
        jQuery.ajax({
            url : '/bin/brightcovevideo.json',
            data: 'pQuery='+encodeURIComponent(pQuery),
            type: 'GET',
            dataType: 'jsonp',
            jsonp: false,
            jsonpCallback: callbackName,
            error :  function( jqXHR, textStatus, errorThrown ) {
                console.error(textStatus);
            }
        })
        return true;
    };

	/**
	 * Performs an API query.
	 * @since 1.0
	 * @param string [pCommand] A Brightcove API method
	 * @param mixed [pParams] Either an object containing the API parameters to apply to the given command, or a single value which is applied to the command's default selector
	 * @return true
	 */
	this.find = function (pCommand, pParams) {
		pCommand = pCommand.toLowerCase().replace(/(find_)|(_)|(get_)/g, "");
		pParams = pParams || null;
		var pDefault = null;
		var pQuery = "";

		for (var pCall in this.calls) {
			if (typeof this.calls[pCall].command == "undefined") {
				continue;
			}

			if (pCommand == this.calls[pCall].command.toLowerCase().replace(/(find_)|(_)|(get_)/g, "")) {
				pCommand = this.calls[pCall].command;

                if (typeof this.calls[pCall].def != "undefined") {
                    pDefault = this.calls[pCall].def;
                }

                break;
            }
        }

        pQuery = "command=" + pCommand;

        if ((typeof pParams == "object") && pParams) {
            for (var pParam in pParams) {
                if (pParam == "selector") {
                    pQuery += "&" + pDefault + "=" + encodeURIComponent(pParams[pParam]);
                } else {
                    pQuery += "&" + pParam + "=" + encodeURIComponent(pParams[pParam]);
                }
            }

            if (typeof pParams.callback != "string") {
                pQuery += "&callback=" + this.callback;
            }

        } else if (pParams) {
            pQuery += "&" + pDefault + "=" + encodeURIComponent(pParams) + "&callback=" + this.callback;
        } else {
            pQuery += "&callback=" + this.callback;
        }
        this.inject(pQuery);
        return true;
    };

    /**
     * Performs an API search query
     * @since 1.0
     * @param mixed [pParams] Either an object containing the API parameters to apply to the given command, or a single value which is applied to the command's default selector
     * @return true
     */
    this.search = function (pParams) {
        return this.find("search_videos", pParams);
    };

    /**
     * Default callback which does nothing
     * @since 0.1
     * @param mixed [pData] The data returned from the API
     * @return true
     */
    this.flush = function (pData) {
        return true;
    };
}();
(function(jQuery){
	var myCarousel = function (elem, opt) {
		var settings = jQuery.extend({
			start:1,
			vscroll:1,
			btnLeft:'left-arrow-btn',
			btnRight:'right-arrow-btn',
			viewport:'carousel-viewport',
			list:'carousel-list',
			listItem:'carousel-list-item',
			circular: true,
			visible: 4,
			scrollDuration: 500,
            disabledClass:'disabled',
            activeItem:0
		}, opt);

		var listItems = jQuery(elem).find("."+settings.listItem),
			list = jQuery(elem).find("."+settings.list),
			btnLeft = jQuery(elem).find("."+settings.btnLeft),
			btnRight = jQuery(elem).find("."+settings.btnRight),
			size = listItems.size(),
			vscroll = settings.vscroll,
			start = settings.start,
			width = listItems.outerWidth(true),
			scrolling = false,
			currSlide = 1,
			currPos = 0,
			visible = settings.visible;

        //Set buttons initial state
        changeButtonsState();

        //Right button click event
		btnRight.bind("click", function(){slideScroll('right')});

		//Left button click event
		btnLeft.bind("click", function(){slideScroll('left')});

		//ListItem click event
        listItems.bind("click", function(){
            listItems.eq(settings.activeItem).removeClass("on");
            settings.activeItem = listItems.index(this);
            listItems.eq(settings.activeItem).addClass("on");
        });

		function slideScroll(vscrollTo) {
			if (!isListScrollRequired(vscrollTo)) return;

			currSlide = recalculateCurrSlideIndex(vscrollTo);
			currPos = (currSlide - 1) * listItems.outerWidth(true);

			//Start list animation
			list.animate({left : -currPos}, settings.scrollDuration);
			changeButtonsState();
		}

		function isListScrollRequired(vscrollTo) {
		    return ( vscrollTo == 'right' && ((currSlide + visible) <= size) )
		        || ( vscrollTo == 'left' && (currSlide > start) )
		}

		function recalculateCurrSlideIndex(vscrollTo){
		    return currSlide + (vscrollTo == 'right' ? vscroll : -1*vscroll);
		}

		function changeButtonsState() {
		    //Left arrow disable/enable conditions
		    if (currSlide < visible) {
		        btnLeft.addClass('disabled').removeClass('enabled');
		    } else {
                btnLeft.addClass('enabled').removeClass('disabled');
            }

            //Right arrow disable/enable conditions
            if (currSlide + visible > size) {
                btnRight.addClass('disabled').removeClass('enabled');
            } else {
                btnRight.addClass('enabled').removeClass('disabled');
            }

		}

        //Recalculation the list position after window resize.
		$( window ).resize(function() {
            width = listItems.outerWidth(true);
            currPos = (currSlide - 1) * width;
            list.css({left : -currPos});
        });
	};
	
	jQuery.fn.carousel = function (opt) {
		return this.each(function() {
			var elem = jQuery(this);
			var myplugin = new myCarousel(elem, opt);
			elem.data("carousel", myplugin);
		});
	};
})(jQuery);
(function() {
	var isMobile = (typeof CUMobileSettings === "object");
    //namespace
    cr = typeof cr !== 'undefined' ? cr : {};
    cr.videoWidget = {};

    /**
     * Returns a promise that resolve to the CarouselPlaylist.
     * The resolved object contains a the following structure:
     *  getFirstVideo -- (function) returns the first video in the playlist
     *  getVideoById -- (function) returns the video for the supplied id, null if no
     * @param config
     * @returns {Promise}
     */
    cr.videoWidget.createCarouselPlaylist = function (config) {
        var deferred = jQuery.Deferred();
        var carouselPlaylist = {};
        var videos = [];
        var $mobileTitle = getElement("videoTitle");
        if(isMobile) {
            $mobileTitle.removeClass("hide");
        }
        var selectedVideo;

        /**
         * Returns the first video from the initialized playlist.
         * The returned object has the following attributes:
         *  id -- brightcove id of the video
         *  thumbnailURL -- the url of the thumbnail image
         *  name -- the name of the video
         * @returns {Video}
         */
        carouselPlaylist.getFirstVideo = function () {
            if (videos.length > 0) {
                return videos[0];
            }
        };

        /**
         * Returns a Video for the supplied id, null if the video with the supplied
         * id is not part of the current playlist
         * @param videoId
         * @returns {Video}
         */
        carouselPlaylist.getVideoById = function(videoId) {
            for (var i = 0; i < videos.length; i++) {
                if (videos[i].id == videoId) {
                    return videos[i];
                }
            }
            return null;
        };

        /**
         * Marks the video with the supplied id as selected.
         * @param videoId
         */
        carouselPlaylist.markVideoSelected = function(videoId){
            getElement('carousel-list')
                .find('.carousel-list-item')
                .each(function(index, carouselListItem){
                    var $carouselListItem = jQuery(carouselListItem);
                    $carouselListItem.removeClass('on');
                    if($carouselListItem.attr('data-video-id') == videoId){
                        $carouselListItem.addClass('on');

                        if(isMobile) {
                            $mobileTitle.text($carouselListItem.find(".title-text").text())
                        }
                    }
                });
        };

        /**
         * Returns the name of the delegate function to process the videos
         * @returns {string}
         */
        function getProcessVideosDelegateName() {
            return 'playlist_processVideos_delegate_' + config.carouselId;
        }

        /**
         * Loads the videos using the brightcove API service
         */
        function loadVideos() {
            BCMAPI.callback = getProcessVideosDelegateName();
            BCMAPI.find("find_videos_by_ids", {"video_ids": config.videoIDs});
        }

        /**
         * Parses the brightcove response and initializes the playlist
         * @param pResponse
         */
        function processVideos(pResponse) {
            if (pResponse && pResponse != null && pResponse.items) {
                jQuery.each(pResponse.items, function (index, video) {
                    if(video){
                        videos.push({
                            id: video.id,
                            thumbnailURL: video.thumbnailURL,
                            name: video.name,
                            length: video.length
                        })
                    }
                });

            }

            initCarousel();
            updateVideosMetadata();

            deferred.resolve(carouselPlaylist);
        }

        /**
         * Initializes the carousel
         */
        function initCarousel() {
            if (videos.length < 2) {
                getElement('carousel-videos').hide();
            } else {
                var $carouselList = getElement('carousel-list');
                $carouselList.html('');
                
                
                
                jQuery.each(videos, function (index, video) {
                    $carouselList.append(createCarouselItem(video));
                });



                // not if mobile
                if(!isMobile){
	                $carouselList.on('click', '.carousel-list-item', carouselPlaylist, function (event) {
                        var videoId = jQuery(this).attr('data-video-id');
                        var video = carouselPlaylist.getVideoById(videoId);
                        selectVideo(video);
	                });

                    var vscroll = 4;

                    getElement('carousel-videos').carousel({visible: vscroll, vscroll: vscroll});
				}


            }
        }

        function selectVideo(video, cueVideo) {
            if (config.onVideoSelected) {
                config.onVideoSelected(video, cueVideo);
            }
            carouselPlaylist.markVideoSelected(video.id);
        }

        /**
         * Creates the HTML to represent the item for the carousel
         * @param video
         * @returns {string}
         */
        function createCarouselItem(video) {
            var retVal = "";
            if (video != undefined && video != null) {
                retVal = '<div class="carousel-list-item"' +
                    'data-video-id="' + video.id + '">' +
                    '<div class="video-thumbnail">';
                    
                    
                    if (!isMobile) {
	                    retVal = retVal + '<div class="image-wrp">' +
	                    '	<div class="now-playing">Now Playing</div>' +
	                    '	<div class="image-wrp-content"><img src="' + video.thumbnailURL + '" alt="' + video.name + '"/></div>'+
	                    '	<div class="play-overlay-icon"><img src="/etc/designs/electronics/images/icon_vid_play_sm.png"/></div>' +
	                    '</div>' +
	                    '<div class="video-duration">' + millisToMinutesAndSeconds(video.length) + '</div>' +
	                    '<div class="play-overlay"></div>';
                    }
                    
                   
                    retVal = retVal + '<span class="title-text">' + video.name + '</span>' +
                    '</div>' +
                    '</div>';
            }
            return retVal;
        }

        /**
         * Updates the video metadata inside the JCR.
         * This information is stored under the videoWidget node
         */
        function updateVideosMetadata() {
            if (config.isEdit && config.isVideoMetaDataUpdated) {
                var propVal = "";
                jQuery.each(videos, function (index, video) {
                    var name = video.name && video.name.replace(/[|]/g, '&#124;');
                    propVal += video.id + '$' + video.thumbnailURL + '$' + name + "|";
                });

                var params = {
                    "./videoProps": propVal,
                    "./isVideoMetaDataUpdated": "false"
                }

                CQ.HTTP.post(CQ.shared.HTTP.encodePath(config.nodePath),
                    function (options, success, response) {
                        if (success) {
                            //window.location.reload();
                        }
                    },
                    params
                );
            }
        }

        if(isMobile){
	     getElement("videoWidget").swipe({
	        //Generic swipe handler for all directions
	        swipeLeft: function(event, direction, distance, duration, fingerCount){nextVideo()},
			swipeRight: function(event, direction, distance, duration, fingerCount){prevVideo()}

		});
        }

		function nextVideo(){
            var $next =$(".carousel-list-item.on").eq(0).next();
            if($next.length == 0) return;
			var video =  carouselPlaylist.getVideoById($next.attr("data-video-id"));
            selectVideo(video, true);
		};
		
		// probably make this "changeVideo(direction)"
		
		function prevVideo(direction){
			// if no matching selector, return
			var $prev = $(".carousel-list-item.on").eq(0).prev(); // next/prev() based on direction
            if($prev.length === 0) return;
            var video =  carouselPlaylist.getVideoById($prev.attr("data-video-id"));
            selectVideo(video, true);
		};

        /**
         * Returns a jQuery object that is found by looking up the element
         * by id with config.id as its suffix
         * @param baseName
         * @returns {jQuery}
         */
        function getElement(baseName) {
            return jQuery('#' + baseName + '_' + config.carouselId);
        }


        /**
         * initialize the playlist
         */

        //global callback function for brightcove API
        window[getProcessVideosDelegateName()] = function (response) {
            processVideos(response);
        };

        loadVideos();

        return deferred.promise();
    };




    /**
     * Returns a promise that resolve to the VideoPlayer.
     * The resolved video player contains the following attributes:
     *  cueVideo(videoId) -- (function) cues the video in the player
     *  playVideo(videoId) -- (function) plays the video with the supplied videoId in the player
     *
     * @param config
     * @returns {Promise}
     */
    cr.videoWidget.createVideoPlayer = function (config) {
        var deferred = jQuery.Deferred();
        var videoPlayer = {};
        var bcPlayer = null;

        /**
         * Cues the video in the player
         * @param videoId
         */
        videoPlayer.cueVideo = function (videoId) {
            bcPlayer.catalog.getVideo(videoId, function (error, video) {
                bcPlayer.catalog.load(video);
                updateSocialPlugin();
            });

        };

        /**
         * Plays the video in the player
         * @param videoId
         */
        videoPlayer.playVideo = function (videoId) {
            bcPlayer.catalog.getVideo(videoId, function (error, video) {
                bcPlayer.catalog.load(video);
                updateSocialPlugin();
                bcPlayer.play();
                $placeholder.parent().addClass("playing").removeClass("paused");

            });
        };


        /**
         * Creates the HTML for the video tag
         * @returns {string}
         */
        function createVideoTagHtml() {
            return '<video id="' + config.id + '"' +
                'data-account="' + config.accountId + '"' +
                'data-player="'  + config.playerId + '"' +
                'data-video-id="" ' +
                'data-embed="default" ' +
                'class="vjs-default-skin " ' +
                'width="' + config.width + '" ' +
                'height="' + config.height + '" ' +
                'controls>' +
                '</video>';
        }

        /**
         * Updates the social plugin to reflect the current video in the player
         */
        function updateSocialPlugin(){
            if(typeof bcPlayer.croSocial === 'function'){
                var mediainfo = bcPlayer.mediainfo;
                if(mediainfo) {
                    var socialOptions = {};
                    socialOptions.title = mediainfo.title;
                    socialOptions.description = mediainfo.description;
                    socialOptions.url = createSharingUrl(mediainfo);
                    socialOptions.services = {
                        facebook: true,
                        google: true,
                        twitter: true,
                        tumblr: false,
                        pinterest: true,
                        linkedin: false
                    };
                    bcPlayer.croSocial(socialOptions);
                }


            }
        }

        /**
         * Returns the URL to be used in the sharing plugin
         * @param mediainfo
         * @returns {String}
         */
        function createSharingUrl(mediainfo){
            var result;
            if(config.canonicalPath){
                result = window.location.protocol + '//' + window.location.host + config.canonicalPath;
            }
            //default to current href
            if(!result){
                result = window.location.href;
            }
            result += (result.match(/\?/) ? '&' : '?') + 'video_id=' + mediainfo.id;
            return result;
        }

        /**
         * Initialize the video player
         */

        $placeholder = jQuery('#' + config.videoPlaceHolder);
        $placeholder.append(createVideoTagHtml()); //.css("border","1px solid #f00");

        loadBrightcoveScript(config).done(function () {
            videojs(config.id).ready(function(){
                bcPlayer = this;
                var $placeholder = jQuery('#' + config.videoPlaceHolder);

                bcPlayer.on("play",function(){
                    setTimeout(function(){
                        if (!bcPlayer.paused() ) $placeholder.parent().addClass("playing").removeClass("paused");
                    },250);

                });
                bcPlayer.on("pause",function(){
                    setTimeout(function(){
                        if (bcPlayer.paused()) $placeholder.parent().addClass("paused").removeClass("playing");
                    },500);

                });

                $("body").on("click",".playing .carousel-videos",function(){
                //setTimeout(function(){
                    bcPlayer.pause();
                   $placeholder.parent().addClass("paused").removeClass("playing");
                //},500);
                });
               
                
                jQuery('.vjs-default-skin')
                    .css('width', config.width)
                    .css('height', config.height);
                deferred.resolve(videoPlayer);
                
                
            });
        });

        return deferred.promise();
    };

    /**
     * Returns the value of a query string parameter matching the supplied name.
     * @param name
     * @returns {String}
     */
    cr.videoWidget.getQueryStringParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    /**
     * Loads the initial video into the supplied player.
     * The following logic is used to determine which video to load:
     *  1. if "video_id" query string parameter is present load that video
     *  2. else, load the first video from the supplied playlist
     * @param playlist
     * @param player
     */
    cr.videoWidget.loadInitialVideo = function(playlist, player){
        var video;

        //check if location.href contains the video_id query string parameter
        var videoId = cr.videoWidget.getQueryStringParameterByName('video_id');
        if(videoId){
            video = playlist.getVideoById(videoId);
        }
        //default to first video in the playlist
        if(!video){
            video = playlist.getFirstVideo();
        }
        player.cueVideo(video.id);
        playlist.markVideoSelected(video.id);
    };

    /**
     * Loads the brightcove javascript (index.min.js) file.
     * @returns {Promise}
     */
    function loadBrightcoveScript(config){
        if(typeof cr.videoWidget.brightcoveScriptPromise === 'undefined'){
            //makes sure we utilize browser caching
            cr.videoWidget.brightcoveScriptPromise = jQuery.ajax({
                dataType: 'script',
                cache: true,
                url: '//players.brightcove.net/'+ config.accountId +'/'+ config.playerId +'_default/index.min.js'
            });
        }
        return cr.videoWidget.brightcoveScriptPromise;
    }

    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = Math.floor((millis % 60000) / 1000);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

}());
/**
 * JQuery plugin for creating of a drop zone for CQ content finder objects
 *
 * @param {function} cbFunction - call-back function to handle drop event
 *
 *      cbFunction(ds, e, dd, element)
 *      Parameters:
 *      	@param {CQ.Ext.dd.DragSource} ds - The drag source that was dragged over this drop zone
 *      	@param {Event} e - The event
 *      	@param {Object} dd - An object containing arbitrary data supplied by the drag source
 *      	@param {Element} element - An jquery html element
 *      Returns:
 *			Boolean - True if the drop was valid, else false
 */

(function($){

    $.fn.addDropZone = function(cbFunction,allowFunction)
    {

        return this.each(function(){

            var element = this;

            var target = new CQ.Ext.Panel({
                renderTo: element,

                afterRender:function() {

                    CQ.Ext.Panel.prototype.afterRender.apply(this, arguments);
                    this.dd = new CQ.Ext.dd.DropZone(element, {
                        ddGroup: 'media',
                        title: 'dropZone',

                        notifyDrop:function(ds, e, dd) {
                            if(allowFunction(dd)){
                                return cbFunction(ds, e, dd, element);
                            }
                            return false;
                        },

                        normalize: function() {},

                        onContainerOver : function(dd, e, data){
                            if(allowFunction(data)){
                                $(element).css("border","10px solid #b9db52")
                                return this.dropAllowed
                            } else {
                                return this.dropNotAllowed
                            }
                        },
                        notifyOut : function(dd, e, data){
                            $(element).css("border","")
                        },

                        flash: function(){}

                    });
                },

                getDropTargets: function() {
                    return [ this.dd ];
                }

            })

            CQ.WCM.registerDropTargetComponent(target)

        });
    };

    $.fn.addMultipleBrightCoveVideoDropZone = function(nodePath,storedVideoIds){
        this.addDropZone(function (ds, e, dd, element) {
            var videoIds = []
            if(storedVideoIds.length>0){
                videoIds = videoIds.concat(storedVideoIds)
            }
            for(var i in dd.records){
                if(i!="remove"){
                    videoIds = videoIds.concat(parseInt(dd.records[i].id));
                }
            }
            var params = {
                "./videoID" : videoIds,
                "./isVideoMetaDataUpdated" : "true",
                "./sling:resourceType" : "electronics/components/general/videoWidget"
            }

            CQ.HTTP.post(CQ.shared.HTTP.encodePath(nodePath),
                function(options, success, response) {
                    if (success) {
                        window.location.reload();
                    }
                },
                params
            );

            return true;
        }, function(dd){
            return dd.records[0].data.videoId ? true : false;
        })
    };

    $.fn.addSingleBrightCoveVideoDropZone = function(nodePath){
        this.addDropZone(function (ds, e, dd, element) {
            CQ.HTTP.post(CQ.shared.HTTP.encodePath(nodePath),
                function(options, success, response) {
                    if (success) {
                        window.location.reload();
                    }
                },
                {
                    "./videoID" : parseInt(dd.records[0].id)
                }
            );

            return true;
        }, function(dd){
            return dd.records[0].data.videoId ? true : false;
        })
    };
})(jQuery);

/* Based on Pinterest bookmarklet code from http://assets.pinterest.com/js/pinmarklet.js
 Modified by Cameron Clark
 */
function selectPinImage(prepend,append,hidden,within,elements){var m={k:"PIN_"+(new Date).getTime(),checkDomain:{url:"//api.pinterest.com/v2/domains/filter_nopin/"},cdn:{"https:":"https://a248.e.akamai.net/passets.pinterest.com.s3.amazonaws.com","http:":"http://passets-cdn.pinterest.com"},embed:"//pinterest.com/embed/?",pin:"pinterest.com/pin/create/bookmarklet/",minImgSize:80,maxCheckCount:20,thumbCellSize:200,check:elements||["meta","iframe","embed","object","img","video","a"],checkHidden:(typeof hidden!=="undefined"?hidden:false),parentElement:within||document,prependText:prepend||"",appendText:append||"",url:{fivehundredpx:/^https?:\/\/500px\.com\/photo\//,etsy:/^https?:\/\/.*?\.etsy\.com\/listing\//,facebook:/^https?:\/\/.*?\.facebook\.com\//,flickr:/^https?:\/\/www\.flickr\.com\//,googleImages:/^https?:\/\/.*?\.google\.com\/search/,googleReader:/^https?:\/\/.*?\.google\.com\/reader\//,kickstarter:/^https?:\/\/.*?\.kickstarter\.com\/projects\//,netflix:/^https?:\/\/.*?\.netflix\.com/,pinterest:/^https?:\/\/.*?\.?pinterest\.com\//,slideshare:/^https?:\/\/.*?\.slideshare\.net\//,soundcloud:/^https?:\/\/soundcloud\.com\//,stumbleUpon:/^https?:\/\/.*?\.stumbleupon\.com\//,tumblr:/^https?:\/\/www\.tumblr\.com/,vimeo:/^https?:\/\/vimeo\.com\//,youtube:/^https?:\/\/www\.youtube\.com\/watch\?/},via:{og:{tagName:"meta",property:"property",content:"content",field:{"og:type":"pId","og:url":"pUrl","og:image":"pImg"}}},seek:{etsy:{id:"etsymarketplace:item",via:{tagName:"meta",property:"property",content:"content",field:{"og:title":"pTitle","og:type":"pId","og:url":"pUrl","og:image":"pImg","etsymarketplace:price_value":"pPrice","etsymarketplace:currency_symbol":"pCurrencySymbol"}},fixImg:{find:/_570xN/,replace:"_fullxfull"},fixTitle:{suffix:". %s%, via Etsy."},checkNonCanonicalImages:true},fivehundredpx:{id:"five_hundred_pixels:photo",via:"og",fixImg:{find:/\/3.jpg/,replace:"/4.jpg"},fixTitle:{find:/^500px \/ Photo /,replace:"",suffix:", via 500px."}},flickr:{via:{tagName:"link",property:"rel",content:"href",field:{canonical:"pUrl",image_src:"pImg"}},fixImg:{find:/_m.jpg/,replace:"_z.jpg"},fixTitle:{find:/ \| Flickr(.*)$/,replace:"",suffix:", via Flickr."}},kickstarter:{id:"kickstarter:project",via:"og",media:"video",fixTitle:{find:/ \u2014 Kickstarter$/,replace:"",suffix:", via Kickstarter."}},slideshare:{id:"article",via:"og",media:"video"},soundcloud:{id:"soundcloud:sound",via:"og",media:"video",fixTitle:{find:/ on SoundCloud(.*)$/,replace:"",suffix:", via SoundCloud."}},youtube:{id:"video",via:"og",fixTitle:{find:/ - YouTube$/,replace:"",suffix:", via YouTube."}}},stumbleFrame:["tb-stumble-frame","stumbleFrame"],tag:{img:{flickr:{att:"src",match:[/staticflickr.com/,/static.flickr.com/]},fivehundredpx:{att:"src",match:[/pcdn\.500px\.net/]},behance:{att:"src",match:[/^http:\/\/behance\.vo\.llnwd\.net/]},netflix:{att:"src",match:[/^http:\/\/cdn-?[0-9]\.nflximg\.com/,/^http?s:\/\/netflix\.hs\.llnwd\.net/]},youtube:{att:"src",match:[/ytimg.com\/vi/,/img.youtube.com\/vi/]}},video:{youtube:{att:"src",match:[/videoplayback/]}},embed:{youtube:{att:"src",match:[/^http:\/\/s\.ytimg\.com\/yt/,/^http:\/\/.*?\.?youtube-nocookie\.com\/v/]}},iframe:{youtube:{att:"src",match:[/^http:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\-_]+)/]},vimeo:{att:"src",match:[/^http?s:\/\/vimeo.com\/(\d+)/,/^http:\/\/player\.vimeo\.com\/video\/(\d+)/]}},object:{youtube:{att:"data",match:[/^http:\/\/.*?\.?youtube-nocookie\.com\/v/]}}},msg:{check:"",cancelTitle:"Cancel",grayOut:"Sorry, cannot pin this image.",noPinIncompletePage:"Sorry, can't pin from non-HTML pages. If you're trying to upload an image, please visit pinterest.com.",bustFrame:"We need to hide the StumbleUpon toolbar to Pin from this page.  After pinning, you can use the back button in your browser to return to StumbleUpon. Click OK to continue or Cancel to stay here.",noPin:"Sorry, pinning is not allowed from this domain. Please contact the site operator if you have any questions.",privateDomain:"Sorry, can't pin directly from %privateDomain%.",notFound:"Sorry, couldn't find any pinnable images or video on this page.",installed:"The bookmarklet is installed! Now you can click your Pin It button to pin images as you browse sites around the web."},pop:"status=no,resizable=yes,scrollbars=yes,personalbar=no,directories=no,location=no,toolbar=no,menubar=no,width=632,height=270,left=0,top=0",rules:["#_shim {z-index:8675309; position: absolute; background: transparent; top:0; right:0; bottom:0; left:0; width: 100%; border: 0;}","#_bg {z-index:8675310; position: absolute; top:0; right:0; bottom:0; left:0; background-color:#f2f2f2; opacity:.95; width: 100%; }","#_bd {z-index:8675311; position: absolute; text-align: center; width: 100%; top: 0; left: 0; right: 0; font:16px hevetica neue,arial,san-serif; }","#_bd #_hd { z-index:8675312; -moz-box-shadow: 0 1px 2px #aaa; -webkit-box-shadow: 0 1px 2px #aaa; box-shadow: 0 1px 2px #aaa; position: fixed; *position:absolute; width:100%; top: 0; left: 0; right: 0; height: 45px; line-height: 45px; font-size: 14px; font-weight: bold; display: block; margin: 0; background: #fbf7f7; border-bottom: 1px solid #aaa; }","#_bd #_hd a#_x { display: block; cursor: pointer; color: #524D4D; line-height: 45px; text-shadow: 0 1px #fff; float: right; text-align: center; width: 100px; height: 45px; border-left: 1px solid #aaa; }","#_bd #_hd a#_x:hover { color: #524D4D; background: #e1dfdf; text-decoration: none; }","#_bd #_hd a#_x:active { color: #fff; background: #cb2027; text-decoration: none; text-shadow:none;}","#_bd #_hd #_logo {height: 43px; width: 100px; display: inline-block; margin-right: -100px; background: transparent url(_cdn/images/LogoRed.png) 50% 50% no-repeat; border: none;}","#_bd #_spacer { display: block; height: 50px; }","#_bd span._pinContainer { height:200px; width:200px; display:inline-block; background:#fff; position:relative; -moz-box-shadow:0 0  2px #555; -webkit-box-shadow: 0 0  2px #555; box-shadow: 0 0  2px #555; margin: 10px; }","#_bd span._pinContainer { zoom:1; *border: 1px solid #aaa; }","#_bd span._pinContainer img { margin:0; padding:0; border:none; }","#_bd span._pinContainer span.img, #_bd span._pinContainer span._play { position: absolute; top: 0; left: 0; height:200px; width:200px; overflow:hidden; }","#_bd span._pinContainer span._play { background: transparent url(_cdn/images/bm/play.png) 50% 50% no-repeat; }","#_bd span._pinContainer cite, #_bd span._pinContainer cite span { position: absolute; bottom: 0; left: 0; right: 0; width: 200px; color: #000; height: 22px; line-height: 24px; font-size: 10px; font-style: normal; text-align: center; overflow: hidden; }","#_bd span._pinContainer cite span._mask { background:#eee; opacity:.75; *filter:alpha(opacity=75); }","#_bd span._pinContainer cite span._behance { background: transparent url(_cdn/images/attrib/behance.png) 180px 3px no-repeat; }","#_bd span._pinContainer cite span._flickr { background: transparent url(_cdn/images/attrib/flickr.png) 182px 3px no-repeat; }","#_bd span._pinContainer cite span._fivehundredpx { background: transparent url(_cdn/images/attrib/fivehundredpx.png) 180px 3px no-repeat; }","#_bd span._pinContainer cite span._kickstarter { background: transparent url(_cdn/images/attrib/kickstarter.png) 182px 3px no-repeat; }","#_bd span._pinContainer cite span._slideshare { background: transparent url(_cdn/images/attrib/slideshare.png) 182px 3px no-repeat; }","#_bd span._pinContainer cite span._soundcloud { background: transparent url(_cdn/images/attrib/soundcloud.png) 182px 3px no-repeat; }","#_bd span._pinContainer cite span._vimeo { background: transparent url(_cdn/images/attrib/vimeo.png) 180px 3px no-repeat; }","#_bd span._pinContainer cite span._vimeo_s { background: transparent url(_cdn/images/attrib/vimeo.png) 180px 3px no-repeat; }","#_bd span._pinContainer cite span._youtube { background: transparent url(_cdn/images/attrib/youtube.png) 180px 3px no-repeat; }","#_bd span._pinContainer a { text-decoration:none; background:transparent url(_cdn/images/bm/button.png) 60px 300px no-repeat; cursor:pointer; position:absolute; top:0; left:0; height:200px; width:200px; }","#_bd span._pinContainer a { -moz-transition-property: background-color; -moz-transition-duration: .25s; -webkit-transition-property: background-color; -webkit-transition-duration: .25s; transition-property: background-color; transition-duration: .25s; }","#_bd span._pinContainer a:hover { background-position: 60px 80px; background-color:rgba(0, 0, 0, 0.5); }","#_bd span._pinContainer a._hideMe { background: rgba(128, 128, 128, .5); *background: #aaa; *filter:alpha(opacity=75); line-height: 200px; font-size: 10px; color: #fff; text-align: center; font-weight: normal!important; }"]};var a=window[m.k]={w:window,d:document,n:navigator,a:m,s:{},f:function(){return{callback:[],kill:function(b){if(typeof b==="string"){b=a.d.getElementById(b)}b&&b.parentNode&&b.parentNode.removeChild(b)},get:function(b,c){var d=null;return d=typeof b[c]==="string"?b[c]:b.getAttribute(c)},set:function(b,c,d){if(typeof b[c]==="string"){b[c]=d}else{b.setAttribute(c,d)}},make:function(b){var c=false,d,e;for(d in b){if(b[d].hasOwnProperty){c=a.d.createElement(d);for(e in b[d]){b[d][e].hasOwnProperty&&typeof b[d][e]==="string"&&a.f.set(c,e,b[d][e])}break}}return c},listen:function(b,c,d){if(typeof a.w.addEventListener!=="undefined"){b.addEventListener(c,d,false)}else{typeof a.w.attachEvent!=="undefined"&&b.attachEvent("on"+c,d)}},getSelection:function(){return(""+(a.w.getSelection?a.w.getSelection():a.d.getSelection?a.d.getSelection():a.d.selection.createRange().text)).replace(/(^\s+|\s+$)/g,"")},pin:function(b){var c=a.a.pin+"?",d="false",e=a.f.get(b,"pinImg"),g=a.f.get(b,"pinUrl")||a.d.URL,f=a.v.selectedText||a.f.get(b,"pinDesc")||a.d.title;f=a.a.prependText+f+a.a.appendText;g=g.split("#")[0];if(b.rel==="video"){d="true"}c=c+"media="+encodeURIComponent(e);c=c+"&url="+encodeURIComponent(g);c=c+"&title="+encodeURIComponent(a.d.title.substr(0,500));c=c+"&is_video="+d;c=c+"&description="+encodeURIComponent(f.substr(0,500));if(a.v.inlineHandler){c=c+"&via="+encodeURIComponent(a.d.URL)}if(a.v.hazIOS){a.w.setTimeout(function(){a.w.location="pinit12://"+c},25);a.w.location="http://"+c}else{a.w.open("http://"+c,"pin"+(new Date).getTime(),a.a.pop)}},close:function(b){if(a.s.bg){a.d.b.removeChild(a.s.shim);a.d.b.removeChild(a.s.bg);a.d.b.removeChild(a.s.bd)}a.w.hazPinningNow=false;b&&a.w.alert(b);a.v.hazGoodUrl=false;a.w.scroll(0,a.v.saveScrollTop)},click:function(b){b=b||a.w.event;var c=null;if(c=b.target?b.target.nodeType===3?b.target.parentNode:b.target:b.srcElement){if(c===a.s.x){a.f.close()}else{if(c.className!==a.a.k+"_hideMe"){if(c.className===a.a.k+"_pinThis"){a.f.pin(c);a.w.setTimeout(function(){a.f.close()},10)}}}}},keydown:function(b){((b||a.w.event).keyCode||null)===27&&a.f.close()},behavior:function(){a.f.listen(a.s.bd,"click",a.f.click);a.f.listen(a.d,"keydown",a.f.keydown)},presentation:function(){var b=a.f.make({STYLE:{type:"text/css"}}),c=a.a.cdn[a.w.location.protocol]||a.a.cdn["http:"],d=a.a.rules.join("\n");d=d.replace(/#_/g,"#"+m.k+"_");d=d.replace(/\._/g,"."+m.k+"_");d=d.replace(/_cdn/g,c);if(b.styleSheet){b.styleSheet.cssText=d}else{b.appendChild(a.d.createTextNode(d))}a.d.h.appendChild(b)},addThumb:function(b,c,d){(d=b.getElementsByTagName(d)[0])?b.insertBefore(c,d):b.appendChild(c)},thumb:function(b){if(b.src){if(!b.media){b.media="image"}var c=a.a.k+"_thumb_"+b.src,d=a.f.make({SPAN:{className:a.a.k+"_pinContainer"}}),e=a.f.make({A:{className:a.a.k+"_pinThis",rel:b.media,href:"#"}}),g=a.f.make({SPAN:{className:"img"}}),f=new Image;a.f.set(f,"nopin","nopin");b.page&&a.f.set(e,"pinUrl",b.page);if(a.v.canonicalTitle||b.title){a.f.set(e,"pinDesc",a.v.canonicalTitle||b.title)}b.desc&&a.f.set(e,"pinDesc",b.desc);f.style.visibility="hidden";f.onload=function(){var i=this.width,h=this.height;if(h===i){this.width=this.height=a.a.thumbCellSize}if(h>i){this.width=a.a.thumbCellSize;this.height=a.a.thumbCellSize*(h/i);this.style.marginTop=0-(this.height-a.a.thumbCellSize)/2+"px"}if(h<i){this.height=a.a.thumbCellSize;this.width=a.a.thumbCellSize*(i/h);this.style.marginLeft=0-(this.width-a.a.thumbCellSize)/2+"px"}this.style.visibility=""};f.src=b.thumb?b.thumb:b.src;a.f.set(e,"pinImg",b.src);if(b.extended){f.className="extended"}g.appendChild(f);d.appendChild(g);b.media!=="image"&&d.appendChild(a.f.make({SPAN:{className:a.a.k+"_play"}}));g=a.f.make({CITE:{}});g.appendChild(a.f.make({span:{className:a.a.k+"_mask"}}));f=b.height+" x "+b.width;if(b.duration){f=b.duration%60;if(f<10){f="0"+f}f=~~(b.duration/60)+":"+f}if(b.total_slides){f=b.total_slides+" slides"}f=a.f.make({span:{innerHTML:f}});if(b.provider){f.className=a.a.k+"_"+b.provider}g.appendChild(f);d.appendChild(g);d.appendChild(e);e=false;if(b.dupe){g=0;for(f=a.v.thumbed.length;g<f;g+=1){if(a.v.thumbed[g].id.indexOf(b.dupe)!==-1){e=a.v.thumbed[g].id;break}}}if(e!==false){if(e=a.d.getElementById(e)){e.parentNode.insertBefore(d,e);e.parentNode.removeChild(e)}else{b.page||b.media!=="image"?a.f.addThumb(a.s.embedContainer,d,"SPAN"):a.f.addThumb(a.s.imgContainer,d,"SPAN")}}else{a.s.imgContainer.appendChild(d);a.v.hazAtLeastOneGoodThumb+=1}(b=a.d.getElementById(c))&&b.parentNode.removeChild(b);d.id=c;a.f.set(d,"domain",c.split("/")[2]);a.v.thumbed.push(d)}},call:function(b,c){var d=a.f.callback.length,e=a.a.k+".f.callback["+d+"]",g=a.d.createElement("SCRIPT");a.f.callback[d]=function(f){c(f,d);a.v.awaitingCallbacks-=1;a.f.kill(e)};g.id=e;g.src=b+"&callback="+e;g.type="text/javascript";g.charset="utf-8";a.v.firstScript.parentNode.insertBefore(g,a.v.firstScript);a.v.awaitingCallbacks+=1},ping:{checkDomain:function(b){var c,d;if(b&&b.disallowed_domains&&b.disallowed_domains.length){c=0;for(d=b.disallowed_domains.length;c<d;c+=1){if(b.disallowed_domains[c]===a.w.location.host){a.f.close(a.a.msg.noPin);return}else{a.v.badDomain[b.disallowed_domains[c]]=true}}c=0;for(d=a.v.thumbed.length;c<d;c+=1){a.v.badDomain[a.f.get(a.v.thumbed[c],"domain")]===true&&a.f.unThumb(a.v.thumbed[c].id.split("thumb_").pop())}}},info:function(b){if(b){if(b.err){a.f.unThumb(b.id)}else{if(b.reply&&b.reply.img&&b.reply.img.src){var c="";if(b.reply.page){c=b.reply.page}if(b.reply.nopin&&b.reply.nopin===1){a.f.unThumb(b.id)}else{if(a.v.scragAllThumbs===true){a.s.embedContainer.innerHTML="";a.s.imgContainer.innerHTML=""}a.f.thumb({provider:b.src,src:b.reply.img.src,height:b.reply.img.height,width:b.reply.img.width,media:b.reply.media,desc:b.reply.description,page:c,duration:b.reply.duration||0,total_slides:b.reply.total_slides||0,dupe:b.id})}}}}}},unThumb:function(b){b=a.a.k+"_thumb_"+b;var c=a.d.getElementById(b);if(c){if(a.v.canonicalImage){if(a.a.k+"_thumb_"+a.v.canonicalImage===b){return}}b=c.getElementsByTagName("A")[0];b.className=a.a.k+"_hideMe";b.innerHTML=a.a.msg.grayOut;a.v.hazAtLeastOneGoodThumb-=1}},getExtendedInfo:function(b){if(!a.v.hazCalledForInfo[b]){a.v.hazCalledForInfo[b]=true;a.f.call(a.a.embed+b,a.f.ping.info)}},getId:function(b){for(var c,d=b.u.split("?")[0].split("#")[0].split("/");!c;){c=d.pop()}if(b.r){c=parseInt(c,b.r)}return encodeURIComponent(c)},seekCanonical:function(b){var c=a.a.seek[b],d=null,e=null,g,f,i,h,l,j={pPrice:"",pCurrencySymbol:""};if(!c||!c.via){return null}if(typeof c.via==="string"&&a.a.via[c.via]){d=a.a.via[c.via]}else{if(typeof c.via==="object"){d=c.via}}g=a.v[d.tagName]||a.d.getElementsByTagName(d.tagName);l=g.length;for(h=0;h<l;h+=1){f=a.f.get(g[h],d.property);if((i=a.f.get(g[h],d.content))&&f){if(d.field[f]){j[d.field[f]]=i}}}if(j.pId&&j.pId!==c.id){return null}if(j.pUrl&&j.pImg){e=new Image;e.onload=function(){a.f.thumb({media:c.media||"image",provider:b,src:this.src,title:this.title,height:this.height,width:this.width});a.v.tag.push(e)};a.v.canonicalTitle=j.pTitle||a.d.title;if(c.fixTitle){if(a.v.canonicalTitle.match(c.fixTitle.find)){a.v.canonicalTitle=a.v.canonicalTitle.replace(c.fixTitle.find,c.fixTitle.replace);if(c.fixTitle.suffix){a.v.canonicalTitle+=c.fixTitle.suffix}}}a.v.canonicalTitle=a.v.canonicalTitle.replace(/%s%/,j.pCurrencySymbol+j.pPrice);e.title=a.v.canonicalTitle;e.setAttribute("page",j.pUrl);if(c.fixImg){if(j.pImg.match(c.fixImg.find)){j.pImg=j.pImg.replace(c.fixImg.find,c.fixImg.replace)}}if(c.checkNonCanonicalImages){a.v.checkNonCanonicalImages=true}a.v.canonicalImage=e.src=j.pImg;return e}return null},hazUrl:{etsy:function(){a.f.seekCanonical("etsy")},fivehundredpx:function(){var b=a.f.seekCanonical("fivehundredpx");if(b){b.setAttribute("extended",true);b.setAttribute("dupe",b.src);a.f.getExtendedInfo("src=fivehundredpx&id="+encodeURIComponent(b.src))}},flickr:function(){var b=a.f.seekCanonical("flickr");if(b){b.setAttribute("extended",true);b.setAttribute("dupe",b.src);a.f.getExtendedInfo("src=flickr&id="+encodeURIComponent(b.src))}},kickstarter:function(){},soundcloud:function(){},slideshare:function(){},youtube:function(){var b=a.f.seekCanonical("youtube");if(b){b.setAttribute("extended",true);a.f.getExtendedInfo("src=youtube&id="+encodeURIComponent(b.getAttribute("page").split("=")[1].split("&")[0]))}},vimeo:function(){var b=a.f.getId({u:a.d.URL,r:10}),c="vimeo";if(a.w.location.protocol==="https:"){c+="_s"}b>1000&&a.f.getExtendedInfo("src="+c+"&id="+b)},googleImages:function(){a.v.inlineHandler="google"},tumblr:function(){a.v.inlineHandler="tumblr"},netflix:function(){a.v.inlineHandler="netflix"},pinterest:function(){a.f.close(a.a.msg.installed)},facebook:function(){a.f.close(a.a.msg.privateDomain.replace(/%privateDomain%/,"Facebook"))},googleReader:function(){a.f.close(a.a.msg.privateDomain.replace(/%privateDomain%/,"Google Reader"))},stumbleUpon:function(){var b=0,c=a.a.stumbleFrame.length,d;for(b=0;b<c;b+=1){if(d=a.d.getElementById(a.a.stumbleFrame[b])){a.f.close();if(a.w.confirm(a.a.msg.bustFrame)){a.w.location=d.src}break}}}},hazSite:{flickr:{img:function(b){if(b.src){b.src=b.src.split("?")[0];a.f.getExtendedInfo("src=flickr&id="+encodeURIComponent(b.src))}}},fivehundredpx:{img:function(b){if(b.src){b.src=b.src.split("?")[0];a.f.getExtendedInfo("src=fivehundredpx&id="+encodeURIComponent(b.src))}}},behance:{img:function(b){if(b.src){b.src=b.src.split("?")[0];a.f.getExtendedInfo("src=behance&id="+encodeURIComponent(b.src))}}},netflix:{img:function(b){if(b=b.src.split("?")[0].split("#")[0].split("/").pop()){id=parseInt(b.split(".")[0]);id>1000&&a.v.inlineHandler&&a.v.inlineHandler==="netflix"&&a.f.getExtendedInfo("src=netflix&id="+id)}}},youtube:{img:function(b){b=b.src.split("?")[0].split("#")[0].split("/");b.pop();(id=b.pop())&&a.f.getExtendedInfo("src=youtube&id="+id)},iframe:function(b){(b=a.f.getId({u:b.src}))&&a.f.getExtendedInfo("src=youtube&id="+b)},video:function(b){(b=a.f.get(b,"data-youtube-id"))&&a.f.getExtendedInfo("src=youtube&id="+b)},embed:function(b){var c=a.f.get(b,"flashvars"),d="";if(c){if(d=c.split("video_id=")[1]){d=d.split("&")[0]}d=encodeURIComponent(d)}else{d=a.f.getId({u:b.src})}d&&a.f.getExtendedInfo("src=youtube&id="+d)},object:function(b){b=a.f.get(b,"data");var c="";if(b){(c=a.f.getId({u:b}))&&a.f.getExtendedInfo("src=youtube&id="+c)}}},vimeo:{iframe:function(b){b=a.f.getId({u:b.src,r:10});b>1000&&a.f.getExtendedInfo("src=vimeo&id="+b)}}},parse:function(b,c){b=b.split(c);if(b[1]){return b[1].split("&")[0]}return""},handleInline:{google:function(b){if(b){var c,d=0,e=0,g=a.f.get(b,"src");if(g){e=b.parentNode;if(e.tagName==="A"&&e.href){b=a.f.parse(e.href,"&imgrefurl=");c=a.f.parse(e.href,"&imgurl=");d=parseInt(a.f.parse(e.href,"&w="));e=parseInt(a.f.parse(e.href,"&h="));c&&g&&b&&e>a.a.minImgSize&&d>a.a.minImgSize&&a.f.thumb({thumb:g,src:c,page:b,height:e,width:d});a.v.checkThisDomain[c.split("/")[2]]=true}}}},tumblr:function(b){var c=[];c=null;c="";if(b.src){for(c=b.parentNode;c.tagName!=="LI"&&c!==a.d.b;){c=c.parentNode}if(c.tagName==="LI"&&c.parentNode.id==="posts"){c=c.getElementsByTagName("A");(c=c[c.length-1])&&c.href&&a.f.thumb({src:b.src,page:c.href,height:b.height,width:b.width})}}}},hazTag:{img:function(b){if(a.v.inlineHandler&&typeof a.f.handleInline[a.v.inlineHandler]==="function"){a.f.handleInline[a.v.inlineHandler](b)}else{if(!b.src.match(/^data/)){if(b.height&&b.height>0&&b.width&&b.width>0){a.f.checkImg(b,b.height,b.width)}else{if(a.a.checkHidden){d=new Image;d.onload=function(){a.f.checkImg(b,this.height,this.width)};d.src=b.src}}}}}},checkImg:function(img,h,w){if(h>a.a.minImgSize&&w>a.a.minImgSize){a.f.thumb({src:img.src,height:h,width:w,title:img.title||img.alt});if(img.parentNode.tagName==="A"&&img.parentNode.href){var c=img.parentNode,d=c.href.split(".").pop().split("?")[0].split("#")[0];if(d==="gif"||d==="jpg"||d==="jpeg"||d==="png"){d=new Image;d.onload=function(){a.f.thumb({src:this.src,height:this.height,width:this.width,title:this.title,dupe:this.getAttribute("dupe")})};d.setAttribute("dupe",img.src);d.title=c.title||c.alt||img.title||img.alt;d.src=c.href}}}},checkTags:function(){var b,c,d,e,g,f,i,h,l;b=0;for(c=a.a.check.length;b<c;b+=1){g=a.a.parentElement.getElementsByTagName(a.a.check[b]);d=0;for(e=g.length;d<e;d+=1){f=g[d];!a.f.get(f,"nopin")&&(a.a.checkHidden||a.f.isVisible(f))&&a.v.tag.push(f)}}b=0;for(c=a.v.tag.length;b<c;b+=1){g=a.v.tag[b];f=g.tagName.toLowerCase();if(a.a.tag[f]){for(i in a.a.tag[f]){if(a.a.tag[f][i].hasOwnProperty){h=a.a.tag[f][i];if(l=a.f.get(g,h.att)){d=0;for(e=h.match.length;d<e;d+=1){l.match(h.match[d])&&a.f.hazSite[i][f](g)}}}}}a.f.hazTag[f]&&a.f.hazTag[f](g)}a.f.checkDomainBlacklist()},getHeight:function(){return Math.max(Math.max(a.d.b.scrollHeight,a.d.d.scrollHeight),Math.max(a.d.b.offsetHeight,a.d.d.offsetHeight),Math.max(a.d.b.clientHeight,a.d.d.clientHeight))},structure:function(){a.s.shim=a.f.make({IFRAME:{height:"100%",width:"100%",allowTransparency:true,id:a.a.k+"_shim"}});a.f.set(a.s.shim,"nopin","nopin");a.d.b.appendChild(a.s.shim);a.s.bg=a.f.make({DIV:{id:a.a.k+"_bg"}});a.d.b.appendChild(a.s.bg);a.s.bd=a.f.make({DIV:{id:a.a.k+"_bd"}});a.s.bd.appendChild(a.f.make({DIV:{id:a.a.k+"_spacer"}}));a.s.hd=a.f.make({DIV:{id:a.a.k+"_hd"}});a.s.x=a.f.make({A:{id:a.a.k+"_x",innerHTML:a.a.msg.cancelTitle}});a.s.hd.appendChild(a.s.x);a.s.hd.appendChild(a.f.make({SPAN:{id:a.a.k+"_logo"}}));a.s.bd.appendChild(a.s.hd);a.s.embedContainer=a.f.make({SPAN:{id:a.a.k+"_embedContainer"}});a.s.bd.appendChild(a.s.embedContainer);a.s.imgContainer=a.f.make({SPAN:{id:a.a.k+"_imgContainer"}});a.s.bd.appendChild(a.s.imgContainer);a.d.b.appendChild(a.s.bd);var b=a.f.getHeight();if(a.s.bd.offsetHeight<b){a.s.bd.style.height=b+"px";a.s.bg.style.height=b+"px";a.s.shim.style.height=b+"px"}a.w.scroll(0,0)},checkUrl:function(){var b;for(b in a.a.url){if(a.a.url[b].hasOwnProperty){if(a.d.URL.match(a.a.url[b])){a.f.hazUrl[b]();if(a.v.hazGoodUrl===false){return false}}}}return true},checkPage:function(){if(a.f.checkUrl()){if(!a.v.canonicalImage||a.v.checkNonCanonicalImages){a.f.checkTags()}if(a.v.hazGoodUrl===false){return false}}else{return false}return true},checkDomainBlacklist:function(){var b=a.a.checkDomain.url+"?domains=",c,d=0;for(c in a.v.checkThisDomain){if(a.v.checkThisDomain[c].hasOwnProperty&&!a.v.checkDomainDone[c]){a.v.checkDomainDone[c]=true;if(d){b+=","}d+=1;b+=encodeURIComponent(c);if(d>a.a.maxCheckCount){a.f.call(b,a.f.ping.checkDomain);b=a.a.checkDomain.url+"?domains=";d=0}}}d>0&&a.f.call(b,a.f.ping.checkDomain)},isVisible:function(obj){if(obj==document){return true}if(!obj){return false}if(!obj.parentNode){return false}if(obj.style){if(obj.style.display=="none"){return false}if(obj.style.visibility=="hidden"){return false}}if(window.getComputedStyle){var style=window.getComputedStyle(obj,"");if(style.display=="none"){return false}if(style.visibility=="hidden"){return false}}var style=obj.currentStyle;if(style){if(style.display=="none"){return false}if(style.visibility=="hidden"){return false}}return a.f.isVisible(obj.parentNode)},init:function(){a.d.d=a.d.documentElement;a.d.b=a.d.getElementsByTagName("BODY")[0];a.d.h=a.d.getElementsByTagName("HEAD")[0];if(!a.d.b||!a.d.h){a.f.close(a.a.msg.noPinIncompletePage)}else{if(a.w.hazPinningNow!==true){a.w.hazPinningNow=true;var b=a.n.userAgent;a.v={saveScrollTop:a.w.pageYOffset,hazGoodUrl:true,hazAtLeastOneGoodThumb:0,awaitingCallbacks:0,thumbed:[],hazIE:function(){return/msie/i.test(b)&&!/opera/i.test(b)}(),hazIOS:function(){return b.match(/iP/)!==null}(),firstScript:a.d.getElementsByTagName("SCRIPT")[0],selectedText:a.f.getSelection(),hazCalledForInfo:{},checkThisDomain:{},checkDomainDone:{},badDomain:{},meta:a.d.getElementsByTagName("META"),tag:[],canonicalTitle:""};a.v.checkThisDomain[a.w.location.host]=true;a.f.checkDomainBlacklist();a.f.presentation();a.f.structure();if(a.f.checkPage()){if(a.v.hazGoodUrl===true){a.f.behavior();if(a.f.callback.length>1){a.v.waitForCallbacks=a.w.setInterval(function(){if(a.v.awaitingCallbacks===0){if(a.v.hazAtLeastOneGoodThumb===0||a.v.tag.length===0){a.w.clearInterval(a.v.waitForCallbacks);a.f.close(a.a.msg.notFound)}}},500)}else{if(!a.v.canonicalImage&&(a.v.hazAtLeastOneGoodThumb===0||a.v.tag.length===0)){a.f.close(a.a.msg.notFound)}}}}}}}}}()};a.f.init()};
function SocialCounter(testURL){
	
	testURL = testURL || "";
	this.shareThreshold = 75; // make this 75 after testing
	
    this.selectors = {
        comments : ".fb-comment-count",
        shares   : ".social-shares-total",
		sharesContainer   : ".social-shares",
        commentText : ".fb-comments-text"
    }

	this.totalSocialShares = 0;
	this.totalFBComments = 0;
	this.commentString = function(){
		return (totalFBComments == 1) ? "Comment" : "Comments";
	}

	this.shareString = function(){
		return (totalSocialShares == 1) ? "Comment" : "Comments";
	}
	
	this.data = new Array();


	this.getPageURL = function(){
	  if (testURL != "") return testURL;
	  var pageURL = document.querySelector("link[rel='canonical']").getAttribute("href") || window.location["origin"]+window.location["pathname"];
	  return pageURL;

	}
	
	this.SocialData = function(name,count){
		this.name=name;
		this.count=count;
	}


	this.SocialData.prototype.getCount = function(){
		return this.count;
	}

	this.socialGatherStats = (function(){
		function addScript(url){
			var script = document.createElement('script');
			script.setAttribute("async",true);
			script.setAttribute("src",url);
			document.body.appendChild(script);
		}
		
		
	
		return {
			
			getFacebookCount : function(url,callbackName){ addScript("https://graph.facebook.com/"+url+"?callback="+callbackName);},
			getTwitterCount : function(url,callbackName){ addScript("http://cdn.api.twitter.com/1/urls/count.json?url="+url+"&callback="+callbackName); },
			getGooglePlusCount:function(callbackName){ addScript('https://apis.google.com/js/client.js?onload='+callbackName); },
			getPinterestCount:function(url,callbackName) { addScript('http://api.pinterest.com/v1/urls/count.json?callback=' + callbackName + '&url=' + url); }
		};
	})();



	this.twitterCallback = function(result){
		var count=(result.count)?parseInt(result.count):0;
		data.push(new SocialData('twitter',count));
		updateTotalShareCount(count);
	}
	
	this.pinterestCallback = function (result) {
		var count=(result.count)?parseInt(result.count):0;
		data.push(new SocialData('pinterest',count));
		updateTotalShareCount(count);
	}
	
	this.facebookCallback = function(result){
		var count=(result.shares)?parseInt(result.shares):0;
		data.push(new SocialData('facebook',count));
		updateTotalShareCount(count);
		
		//updateFBCommentCount((result.data[0])?parseInt(result.data[0].comment_count):0);

	}
	
	
	this.googlePlusCallback = function(inData){
		var params = {
			jsonrpc:"2.0",
			id:"gapiRpc",
			method:"pos.plusones.get",
			apiVersion:"v1",
			params:{
				groupId:"@self",
				id:getPageURL(),
				nolog:true,source:"widget",
				userId:"@viewer"
			}
		}
	
		gapi.client
			.request({path:'rpc',method:'POST',body:params})
			.execute(function(resp){
				try{
					var count=(resp.result.metadata.globalCounts.count)?parseInt(resp.result.metadata.globalCounts.count):0;
					data.push(new SocialData('googleplus',count));
					
					updateTotalShareCount(count);

				}catch(e){
					
				}});
	}
	
	
	this.roundShares = function(shareCount){
		if (shareCount < 1000) {
			return shareCount;
		} else {
			var shareText = "";
			
			if (shareCount < 100000) shareText = Math.round( (shareCount/1000) * 10 ) / 10;
			else shareText = Math.floor(shareCount/1000);
			
			return shareText + "K";
		}
		
	}
	
	this.updateTotalShareCount = function(increment){
		
		
		totalSocialShares += increment;
		//totalSocialShares = 125670;
	
		if (totalSocialShares >= shareThreshold) $(selectors.sharesContainer).removeClass("hide");

		$(selectors.shares).each(function(){
			
			$(this).html(roundShares(totalSocialShares));

		});
		
	}
	
	this.updateFBCommentCount = function(increment){
		return;
		totalFBComments  += parseInt(increment); 
		totalFBComments = 0; // just disable comment count for now;
		
		$(selectors.comments).each(function(){
				var commentCountString = (totalFBComments > 0) ? totalFBComments : "";
				$(this).html(commentCountString);
		});
		
		$(selectors.commentText).each(function(){
			$(this).html(commentString());
		});
	}
	
	
	
	socialGatherStats.getFacebookCount(getPageURL(),'facebookCallback');
	//socialGatherStats.getTwitterCount(getPageURL(),'twitterCallback');
	socialGatherStats.getGooglePlusCount('googlePlusCallback');
	socialGatherStats.getPinterestCount(getPageURL(),'pinterestCallback');
	
	
	

}



jQuery(function($){
	$('a.cr-modal').crModal();

    $( ".email-share" ).sendToFriend().detach().appendTo("body");

	// social shares counter + comment count & text
	SocialCounter();

    var $hero = $(".hero-image-wrapper");
    var $footer = $(".bgsectiondelimiter.sectiondelimiter, #footer, #pageFooter, #global-footer");

    if ($(".affix-sharing").length > 0){
        var $social = $(".affix-sharing").affixSocial({
            top : function(){
                return $hero.offset().top + $hero.height();
            },
            bottom : function(){
                var visibleFooter = $footer.filter(":visible");
                var visibleFooterOffsetTop = visibleFooter.length ? visibleFooter.offset().top : 0;
                return $(document).height() - visibleFooterOffsetTop;
            }
        });

        $().add($hero).add( $footer ).
            trackable().
            bind("positionChanged", $social.data("affixSocial").recalculate );
    }
});






function social_sharing(service, qStr) {
    var canonicalUrl = document.querySelector("link[rel='canonical']");
    var queryString = "";
    if (qStr) { queryString = qStr; }
    switch (service) {
        case 'facebook':
            var d = document, f = 'https://www.facebook.com/share', l = d.location, e = encodeURIComponent, p = '.php?src=bm&v=4&i=1435257055&u=' + e(canonicalUrl.href+queryString) + '&t=' + e(d.title);
            try {
                if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host))throw(0);
                share_internal_bookmarklet(p)
            } catch (z) {
                a = function () {
                    if (!window.open(f + 'r' + p, 'sharer', 'toolbar=0,status=0,resizable=1,width=626,height=436'))l.href = f + p
                };
                if (/Firefox/.test(navigator.userAgent))setTimeout(a, 0); else {
                    a()
                }
            }
            void(0)
            break;

        case 'twitter':
            (function () {
                window.twttr = window.twttr || {};
                var D = 550, A = 450, C = screen.height, B = screen.width, H = Math.round((B / 2) - (D / 2)), G = 0, F = document, E;
                if (C > A) {
                    G = Math.round((C / 2) - (A / 2))
                }
                window.twttr.shareWin = window.open('https://twitter.com/share', '', 'left=' + H + ',top=' + G + ',width=' + D + ',height=' + A + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
                E = F.createElement('script');
                E.src = 'https://platform.twitter.com/bookmarklets/share.js?v=1';
                F.getElementsByTagName('head')[0].appendChild(E)
            }());
            break;

        case 'gplus':
            window.open('https://plus.google.com/share?url=' + encodeURIComponent(canonicalUrl.href+queryString), 'popupwindow', 'scrollbars=yes,width=600,height=400');
            break;

        case 'pinterest':
            //selectPinImage();

            var images = $('img');
            var heroImage = $('.hero-image');
            if (images.length) {
                images.sort(function (img1, img2) {
                    return (img2.width * img2.height) - (img1.width * img2.height)
                });

                /*
                 * if '.hero-image' exists on the page ->
                 * set it as the first candidate for Pinterest thumbnail image
                 */
                if(heroImage.length) {
                    images = images.get();
                    images.unshift(heroImage.get(0));
                }
                var pinterest_share = 'https://www.pinterest.com/pin/create/bookmarklet/?media=' + images[0].src + '&url=' + encodeURIComponent(canonicalUrl.href+queryString) + '&description=' + encodeURI(document.title);

                window.open(pinterest_share, 'popupwindow', 'scrollbars=yes,width=750,height=550');
            }
            break;

        case 'email':
            $('body').css('overflow', 'hidden');
            $("#tellafriend-modal").removeClass("hide");
            $('#to').focus();
            break;
    }

}
function print_page(path){
    window.open(path,'win2','status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=1024,height=768,directories=no,location=no');
}
jQuery(function($){
    [
        [".social_sharing_module a.facebook", "Facebook Share"],
        [".social_sharing_module a.twitter", "Twitter Share"],
        [".social_sharing_module a.pinterest", "Pinterest Share"],
        [".social_sharing_module a.gplus", "GooglePlus Share"],
        [".social_sharing_module a.email", "Email Share"],
        [".social_sharing_module a.print", "Print"]
    ].forEach(function(item){
        $(item[0]).click(function(){
            if(El !== undefined && El.sc !== undefined)
                El.sc.socialLinkEvent.bind(El.sc, item[1])
        });
    });
});
/**
    require parsley.js
 */
;(function( $ ){

    var Plugin = function(el, options){
        this.options    = $.extend({}, options);
        this.$el        = $(el);
        this.form       = $("form", this.$el );
        this.pagePath   = $(".send-to-friend-path", this.$el ).val();
        this.spinner    = $(".send-to-friend-spinner", this.$el );
        this.message    = $(".send-to-friend-message", this.$el );
        this.errorMsg   = $(".send-to-friend-error-msg", this.$el );

        this.controlsPannel   = $(".send-to-friend-controls", this.$el );
        this.controlls  = $("input[type='email']", this.$el );
        this.init();
    };

    $.extend(Plugin.prototype, {
        init : function(){
            this.form.parsley();
            this.form.on( "submit", this.onSubmit.bind(this) );
            this.$el.on( "hidden.bs.modal", this.showControls.bind(this) );
        },
        onSubmit : function(){
            this.showSpinner();
            
            $.post("/bin/sendtoafriend?path=" + this.pagePath, this.form.serialize() )
                .always(this.hideSpinner.bind(this))
                .then(this.checkIfSent).then(this.showThanksMessage.bind(this)).then(this.clearForm.bind(this)).then(El.sc.socialLinkEvent.bind(El.sc, 'email_sent'))
                .fail(this.showErrorMessage.bind(this));
            
            return false;
        },
        checkIfSent : function( result, textStatus, jqXHR ){
            if (result.indexOf("Your message has been sent") === -1 && result.indexOf("Thanks! Email sent!") === -1) {
                return $.Deferred().reject(jqXHR, result, "Unsuccessfully sent").promise();
            }
        },
        showThanksMessage : function(){
            this.hideAll();
            this.message.removeClass("hide");
        },
        showErrorMessage : function(){
            this.hideAll();
            this.errorMsg.removeClass("hide")
        },
        showControls : function(){
            this.hideAll();
            this.controlsPannel.removeClass("hide");
        },
        clearForm : function(){
            this.controlls.val("").removeClass();
        },
        showSpinner : function(){
            this.spinner.removeClass("hide");
        },
        hideSpinner : function(){
            this.spinner.addClass("hide");
        },
        hideAll : function(){
            $().add(this.controlsPannel).add(this.errorMsg).add(this.message).addClass("hide");
        }
    });

    $.fn.sendToFriend = function(options){
        return this.each(function(){
            $(this).data('sendToFriend', new Plugin(this, options));
        });
    };
})( jQuery );

;(function ($) {

    $.fn.trackable = function(){
        return this.each(function(i, elem){
            var $elem = $(elem);
            
            var prev = {
                height  : $(elem).height(),
                top     : $(elem).offset().top
            };
            
            function check(){

                if ( $elem.is(":visible") ) {
                    if ( $elem.height() !== prev.height || $(elem).offset().top !== prev.top ) {
                        $elem.trigger("positionChanged");

                        prev = {
                            height  : $(elem).height(),
                            top     : $(elem).offset().top
                        };
                    }
                }
                requestAnimationFrame(check);
            }
            
            requestAnimationFrame(check);
        });
    };

}(jQuery));

;(function( $ ){

    function getParam (param){
        return param;
    }

    function applyState(clazz, stateFlag){
        if ( !this.$el.hasClass( clazz ) ){
            this[stateFlag] = true;
            this.$el.addClass( clazz );
            this.$wrapper.css( this.getPositionStyles() );
        }
    }
        
    function disableState(clazz, stateFlag) {
        if ( this.$el.hasClass( clazz ) ){
            this[stateFlag] = false;
            this.$el.removeClass( clazz );
            this.$wrapper.css(this.getPositionStyles());
        }
    }
    
    
    var Plugin = function(el, options){
        this.options    = $.extend({
            top     : 0,
            bottom  : 0
        }, options);

        if ( typeof this.options.top != 'function') {
            this.options.top = getParam.bind(this, this.options.top);
        }

        if ( typeof this.options.bottom != 'function') {
            this.options.bottom = getParam.bind(this, this.options.bottom);
        }

        this.$el        = $(el);
        this.$doc       = $(document);
        this.$wrapper   = $(".social_sharing_wrapper", this.$el);
        this.elHeight   = this.$wrapper.outerHeight();

        this.pulled = false;
        this.pinned = false;
        this.pushed = false;
        this._recalculate();
        setTimeout(this._recalculate.bind(this), 1000);
        this.init();
    };

    $.extend(Plugin.prototype, {
        init : function() {
            this.recalculate = $.throttle( 100, this._recalculate.bind(this) );
            
            this.pull   = applyState.bind(this, "social-pulled", "pulled");
            this.unpull = disableState.bind(this, "social-pulled", "pulled");
            
            this.pin    = applyState.bind(this, "social-fixed", "pinned");
            this.unpin  = disableState.bind(this, "social-fixed", "pinned");
            
            this.push   = applyState.bind(this, "social-pushed", "pushed");
            this.unpush = disableState.bind(this, "social-pushed", "pushed");


            $(window).resize( this.recalculate );
            $("*").load( this.recalculate );

            requestAnimationFrame(this.animate.bind(this));
        },
        _recalculate : function () {
            this.top    = this.options.top();
            this.bottom = this.options.bottom();

            this.pullPosition   = {
                top : this.top,
                bottom  : ""
            };
            
            this.pinPosition    = {
                top : 0,
                bottom : ""
            };
            this.pushPosition   = {
                top : "",
                bottom : this.options.bottom()
            };

            this.$wrapper.css(this.getPositionStyles());
        },
        animate : function(){
            if (this.$doc.height() - this.$doc.scrollTop() - this.bottom < this.elHeight){
                this.push();
                this.unpull();
                this.unpin();
            }else if (this.$doc.scrollTop() < this.top){
                this.pull();
                this.unpin();
                this.unpush();
            } else {
                this.pin();
                this.unpush();
                this.unpull();
            }
            requestAnimationFrame(this.animate.bind(this));
        },
        getPositionStyles : function () {
            var positionStyles = {
                top: "",
                bottom : ""
            };

            if (this.pulled) $.extend(positionStyles, this.pullPosition);
            if (this.pinned) $.extend(positionStyles, this.pinPosition);
            if (this.pushed) $.extend(positionStyles, this.pushPosition);

            return positionStyles;
        }
    });

    $.fn.affixSocial = function(options){
        return this.each(function(){
            $(this).data('affixSocial', new Plugin(this, options));
        });
    };

    $.fn.affixSocial.Constructor = Plugin;
})( jQuery );

/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * This plugin needs at least jQuery 1.4.2
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.2
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
 (function($){
	/**
	 * @class Class for calculating pagination values
	 */
	$.PaginationCalculator = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
	}

	$.extend($.PaginationCalculator.prototype, {
		/**
		 * Calculate the maximum number of pages
		 * @method
		 * @returns {Number}
		 */
		numPages:function() {
			return Math.ceil(this.maxentries/this.opts.items_per_page);
		},
		/**
		 * Calculate start and end point of pagination links depending on
		 * current_page and num_display_entries.
		 * @returns {Array}
		 */
		getInterval:function(current_page)  {
			var ne_half = Math.floor(this.opts.num_display_entries/2);
			var np = this.numPages();
			var upper_limit = np - this.opts.num_display_entries;
			var start = current_page > ne_half ? Math.max( Math.min(current_page - ne_half, upper_limit), 0 ) : 0;
			var end = current_page > ne_half?Math.min(current_page+ne_half + (this.opts.num_display_entries % 2), np):Math.min(this.opts.num_display_entries, np);
			return {start:start, end:end};
		}
	});

	// Initialize jQuery object container for pagination renderers
	$.PaginationRenderers = {}

	/**
	 * @class Default renderer for rendering pagination links
	 */
	$.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
		this.pc = new $.PaginationCalculator(maxentries, opts);
	}
	$.extend($.PaginationRenderers.defaultRenderer.prototype, {
		/**
		 * Helper function for generating a single link (or a span tag if it's the current page)
		 * @param {Number} page_id The page id for the new item
		 * @param {Number} current_page
		 * @param {Object} appendopts Options for the new item: text and classes
		 * @returns {jQuery} jQuery object containing the link
		 */
		createLink:function(page_id, current_page, appendopts){
			var lnk, np = this.pc.numPages();
			page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
			appendopts = $.extend({text:page_id+1, classes:""}, appendopts||{});
			if(page_id == current_page){
				lnk = $("<span class='current'>" + appendopts.text + "</span>");
			}
			else
			{
				lnk = $("<a>" + appendopts.text + "</a>")
					.attr('href', this.opts.link_to.replace(/__id__/,page_id));
			}
			if(appendopts.classes){ lnk.addClass(appendopts.classes); }
			lnk.data('page_id', page_id);
			return lnk;
		},
		// Generate a range of numeric links
		appendRange:function(container, current_page, start, end, opts) {
			var i;
			for(i=start; i<end; i++) {
				this.createLink(i, current_page, opts).appendTo(container);
			}
		},
		getLinks:function(current_page, eventHandler) {
			var begin, end,
				interval = this.pc.getInterval(current_page),
				np = this.pc.numPages(),
				fragment = $("<div class='pagination'></div>");

			// Generate "Previous"-Link
			if(this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)){
				fragment.append(this.createLink(current_page-1, current_page, {text:this.opts.prev_text, classes:"prev"}));
			}
			// Generate starting points
			if (interval.start > 0 && this.opts.num_edge_entries > 0)
			{
				end = Math.min(this.opts.num_edge_entries, interval.start);
				this.appendRange(fragment, current_page, 0, end, {classes:'sp'});
				if(this.opts.num_edge_entries < interval.start && this.opts.ellipse_text)
				{
					$("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
			}
			// Generate interval links
			this.appendRange(fragment, current_page, interval.start, interval.end);
			// Generate ending points
			if (interval.end < np && this.opts.num_edge_entries > 0)
			{
				if(np-this.opts.num_edge_entries > interval.end && this.opts.ellipse_text)
				{
					$("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
				begin = Math.max(np-this.opts.num_edge_entries, interval.end);
				this.appendRange(fragment, current_page, begin, np, {classes:'ep'});

			}
			// Generate "Next"-Link
			if(this.opts.next_text && (current_page < np-1 || this.opts.next_show_always)){
				fragment.append(this.createLink(current_page+1, current_page, {text:this.opts.next_text, classes:"next"}));
			}
			$('a', fragment).click(eventHandler);
			return fragment;
		}
	});

	// Extend jQuery
	$.fn.pagination = function(maxentries, opts){

		// Initialize options with default values
		opts = $.extend({
			items_per_page:10,
			num_display_entries:11,
			current_page:0,
			num_edge_entries:0,
			link_to:"#",
			prev_text:"Prev",
			next_text:"Next",
			ellipse_text:"...",
			prev_show_always:true,
			next_show_always:true,
			renderer:"defaultRenderer",
			show_if_single_page:false,
			load_first_page:true,
			callback:function(){return false;}
		},opts||{});

		var containers = this,
			renderer, links, current_page;

		/**
		 * This is the event handling function for the pagination links.
		 * @param {int} page_id The new page number
		 */
		function paginationClickHandler(evt){
			var links,
				new_current_page = $(evt.target).data('page_id'),
				continuePropagation = selectPage(new_current_page);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}

		/**
		 * This is a utility function for the internal event handlers.
		 * It sets the new current page on the pagination container objects,
		 * generates a new HTMl fragment for the pagination links and calls
		 * the callback function.
		 */
		function selectPage(new_current_page) {
			// update the link display of a all containers
			containers.data('current_page', new_current_page);
			links = renderer.getLinks(new_current_page, paginationClickHandler);
			containers.empty();
			links.appendTo(containers);
			// call the callback and propagate the event if it does not return false
			var continuePropagation = opts.callback(new_current_page, containers);
			return continuePropagation;
		}

		// -----------------------------------
		// Initialize containers
		// -----------------------------------
                current_page = parseInt(opts.current_page);
		containers.data('current_page', current_page);
		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;

		if(!$.PaginationRenderers[opts.renderer])
		{
			throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
		}
		renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);

		// Attach control events to the DOM elements
		var pc = new $.PaginationCalculator(maxentries, opts);
		var np = pc.numPages();
		containers.bind('setPage', {numPages:np}, function(evt, page_id) {
				if(page_id >= 0 && page_id < evt.data.numPages) {
					selectPage(page_id); return false;
				}
		});
		containers.bind('prevPage', function(evt){
				var current_page = $(this).data('current_page');
				if (current_page > 0) {
					selectPage(current_page - 1);
				}
				return false;
		});
		containers.bind('nextPage', {numPages:np}, function(evt){
				var current_page = $(this).data('current_page');
				if(current_page < evt.data.numPages - 1) {
					selectPage(current_page + 1);
				}
				return false;
		});

		// When all initialisation is done, draw the links
		links = renderer.getLinks(current_page, paginationClickHandler);
		containers.empty();
		if(np > 1 || opts.show_if_single_page) {
			links.appendTo(containers);
		}
		// call callback function
		if(opts.load_first_page) {
			opts.callback(current_page, containers);
		}
	} // End of $.fn.pagination block

})(jQuery);
jQuery(document).ready(function() {
    // Add dialog basis div with its iframe content into the page
    jQuery(document.body).append('<div class="iframe-dialog" style="display:none"><iframe class="iframe-content"></iframe></div>');

    var iframe = jQuery(".iframe-content");

    // Create a dialog window on the basis of the div appended above
    if (jQuery().dialog) {
        jQuery(".iframe-dialog").dialog({
            autoOpen: false, // the dialog is hidden until .dialog('open') function is called
            modal: true,
            width: 'auto',
            dialogClass: 'no-title-border iframe-dialog-wrapper',
            open: function(){
                jQuery(".ui-widget-overlay").css("height", jQuery(document).height()); // overlap all the page content
                jQuery(".ui-widget-overlay").bind("click", function() { // close the dialog after clicking outside of it
                    jQuery(".iframe-dialog").dialog("close");
                })
            },
            close: function(event, ui) {
                iframe.removeAttr('src');
            }
        }).siblings('div.ui-dialog-titlebar').removeClass('ui-corner-all').parent().removeClass('ui-corner-all'); // get rid of border radius
    }

    var isHeightDefined = false; // isHeightDefined equals true if user specified height manually in the RTE IFrame plugin
    /*
     Open the dialog after clicking on the links created by RTE IFrame plugin.
     The format of the links: <a href="iframeURL" class="iframe-element" data-height="height" data-width="width" data-title="title">
     */
    jQuery(".iframe-element").on("click", function(event) {
        var $this = jQuery(this);

        // get height, width and title from data attributes or set default values
        var height = $this.data('height'),
            width = $this.data('width') ? $this.data('width') : 610,
            title = $this.data('title') ? $this.data('title') : "",
            url = $this.attr('href');

        isHeightDefined = !!height;
        height = isHeightDefined ? height : jQuery(window).height()*0.9;

        // set extracted values to the iframe
        iframe.height(height);
        iframe.width(width);
        iframe.attr('src', url);
        jQuery(".iframe-dialog").dialog('open'); // open the dialog
        jQuery(".iframe-dialog-wrapper .ui-dialog-title").text(title); // change the dialog title

        //sent siteCatalyst request
        var $img = $this.children("img").eq(0),
            linkName;
        if(!!$img.length){
            linkName = $img.attr('alt');
            if(!!!linkName){
                var splitSrc = $img.attr('src').split("/");
                linkName = splitSrc[splitSrc.length - 1]
            }
        }else{
            linkName = $this.text();
        }
        var s = s_gi(s_account);
        s.prop48 = s.eVar48 = s.pageName + " | " + linkName;
        s.prop59 = s.eVar59 = linkName + " | main_nav";
        s.t();

        return false;
    });

    /*
     Receive messages sent by window.postMessage function from any URL.
     The current listener is supposed to receive height, width, title values and set them to the iframe.
     */
    jQuery(window).on("message", function(e) {
        // exit if iframe source and message source don't match
        if(!iframe.attr('src') || iframe.attr('src').indexOf(e.originalEvent.origin) < 0) {return;}
        var data = {};
        try {
            data = JSON.parse(e.originalEvent.data);
        } catch(e){ /* prevent json parsing error message */ }

        var dialog = jQuery(".ui-dialog.iframe-dialog-wrapper");

        // set actual iframe height, width, title if they exist in the received message
        if(data.height && !isHeightDefined) {iframe.animate({height: data.height});}
        if(data.width) {iframe.animate({width: data.width});}
        if(data.title) {dialog.find(".ui-dialog-title").text(data.title);}
        dialog.animate({"left": (jQuery(window).width() - dialog.width()) / 2 + "px"}); // center the dialog horizontally
    });

    iframe.bind('load', function(){
        try {
            if(window.top && window.top.postMessage){
                msg = {
                    "height": jQuery(this).contents().height(),
                    "width": jQuery(this).contents().width(),
                    "title": jQuery(this).contents().find('title').text()
                };

                // send actual iframe height, width, title to the parent window using window.postMessage function
                // iframes with consumerreports URLs will receive this message, parse it and set the posted values
                window.top.postMessage(JSON.stringify(msg), "*");
            }
        } catch(e){ /* prevent error message about cross-domain iframe access */ }
    });
});

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";


		// Create the defaults once
		var pluginName = "crModal",
				defaults = {
					modalBackground: "#cr-modal",
					modalContainer: "#cr-modal-inner",
					modalClose: ".modal-close"
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
				

							
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
												
	
	
	
							
						this.openModal(this.element,this.settings);
							

				},
				openModal: function (element,settings) {
					$(window).trigger("modalOpen");
					var me = this; 
										
					$(element).on("click",function(e){
						e.preventDefault();
			            var modal = $(settings.modalBackground);
			            if (modal.length == 0) {
				             modal = $('<div id = "' + settings.modalBackground.substr(1) + '"/>');
				             modal.appendTo("body");
			            }
			            
			            
			          
						
			           var  modalContainer = $(settings.modalContainer);
			           
			           if (modalContainer.length == 0) {
				            modalContainer = $('<div id = "' + settings.modalContainer.substr(1) + '"><span class="close"></span></div>');
				            modalContainer.appendTo(modal);
			            }
			            
			            modal.on("click", function( event ) {
						  me.closeModal(element,settings);
						});
						
						
			            
			            modalContainer.on("click focus", function( event ) {
						  event.stopPropagation();
						});
			            
						
			            $('body').addClass("no-scroll");
			            

			            modal.removeClass("hide");
			            me.moveTarget(element,settings);
			            
			            
						return false;
					});
	
				},
				
				
				moveTarget: function(element, settings){
					var me = this;		
					var targetSelector = $(element).attr("href");
					var target = $(targetSelector);
					
					
					
					if (target.length > 0) {
						
						target = target.eq(0); // just in case
						
						// first move anything in the modal back to the end of the body
						// maybe later we'll make a placeholder or something if things need to move back to a specific container
					

						//
						// make any .close-modal link close modal 
						$(target).on("click","a.close-modal",function(){
							me.closeModal(null, me.settings);
						});
						// keypress too
						$(document).keyup(function(e) {
						     if (e.keyCode == 27) { 
						        me.closeModal(null,me.settings);
						    }
						});

						$(settings.modalContainer).children().addClass("hide").appendTo("body");
						
						
						$(settings.modalContainer)
							.append(target.removeClass("hide"))
							.width(target.width())
							.height(target.outerHeight());
						
						
					}
					
				},
				
				
				closeModal: function(element, settings){
					$(window).trigger("closeModal");
					$('body').removeClass("no-scroll");
					$(settings.modalContainer).children().addClass("hide").appendTo("body").off("click keypress");
					$(settings.modalBackground).addClass("hide");
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {



				

				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );



El = typeof El !== 'undefined' ? El : {};
El.sc = {
    socialLinkEvent : function(linkName) {
        //todo: trigger custom event in order to bypass electronics sc tracking and pass appropriate link name.
    }
}

!function(){
    var ua = navigator.userAgent.toLowerCase(),
        isWebkit = ua.indexOf('webkit') !== -1,
        isAndroid23 = ua.search('android [23]') !== -1,
        isMobile = typeof orientation !== 'undefined',
        isWebkit3d = ('WebKitCSSMatrix' in window)
            && ('m11' in new window.WebKitCSSMatrix()) && !isAndroid23,
        isOpera = window.opera;
    BrowserObject = {
        isMobile: isMobile,
        isMobileWebkit: isWebkit3d,
        isMobileWebkit3d: isWebkit,
        isMobileOpera: isOpera,
        getPosition: function(el){
            var _p = {
                x: 0,
                y: 0
            }
            while(el &&
            !isNaN(el.offsetLeft) &&
            !isNaN(el.offsetTop)) {
                _p.x += el.offsetLeft;
                _p.y += el.offsetTop;
                el = el.offsetParent;
            }
            return _p;
        }
    }
}();

(function($){
    $.fn.extend({
        scrolling: function(_opts) {

            var _defaults = {
                limit: 30,
                prevent: false
            };

            var options = $.extend({}, _defaults, _opts);
            return this.each(function(){
                var $this = $(this), _data = {
                    startpageX: $this.width(),
                    startpageY: $this.height(),
                    pool: []
                };
                $this.on('touchstart', _data, function(e) {
                    event = e.originalEvent.touches[0];
                    e.data.startpageX = event.pageX;
                    e.data.startpageY = event.pageY;
                })

                $this.on('touchmove', _data, function(event) {
                    var e = event;
                    event = e.originalEvent.touches[0];
                    var dif = e.data.startpageY - event.pageY, offset = -1, el = $(this)[0], top = -1;
                    offset = (el.scrollHeight || 0) - (el.offsetHeight || 0);
                    top = el.scrollTop || 0;
                    if( (e.data.startpageX - event.pageX) > options.limit ) {
                        if (options.cancelCallback) {
                            options.cancelCallback.apply(null, [e, $this].slice());
                        }
                        return;
                    } else if (offset > 0) {
                        var _callback = function() {
                            var v = (Math.abs(dif) < offset) ? dif : (dif > 0) ? offset : -offset;
                            v += top;
                            v = (v < 0) ? 0 : (v > offset) ? offset : v;
                            el.scrollTop = v;
                        };
                        if (options.prevent) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        clearTimeout(e.data.pool.pop());
                        _callback = (options.doCallback) ? options.doCallback : _callback;
                        e.data.pool.push(setTimeout(_callback, 10));
                    }
                });
            });
        }
    });
})(jQuery);

var displayBBG = (function($){
    var _bb = $("<div>", {class:"m-nav-bbackground"}),
        isEixts = function() {
            return !!$(".m-nav-bbackground")[0];
        },
        toggle = function(_el) {
            var _el = $(".m-nav-bbackground"),
                _d = _el.css("display");
            if ("none" == _d) {
                _el.show();
                _el.parents(".content-container.container")[0].scrollIntoView();
                $("body").animate({scrollTop:'-=50'});
            } else {
                _el.hide();
            }
        };
    return function(_toggler) {
        if (isEixts()) {
            toggle(_toggler);
        } else {
            _bb.on("click", function(){
                _toggler.trigger("click");
            });
            $(".content-container.container").append(_bb);
            _toggler.parents(".content-container.container")[0].scrollIntoView();
            $("body").animate({scrollTop:'-=50'});
        }
    }
})(jQuery);

function adjustAffix() {
    var $hero = $(".heroimage-wrapper");
    var $timeline = $(".timeline-wrapper");

    $(".affix-sharing").each(function(){
        var _p = $(this).data('affixSocial');

        with(_p) {
            options.top = function(){
                return $hero.offset().top + $hero.height();
            };
            options.bottom = function(){
                return ($(document).height() - $timeline.offset().top);
            };
            _recalculate = function () {
                var _t = $timeline.offset().top - this.elHeight;
                this.top    = this.options.top();
                this.bottom = this.options.bottom();

                this.pullPosition = {
                    top : this.top,
                    bottom  : ""
                };

                this.pinPosition = {
                    top : 0,
                    bottom : ""
                };
                this.pushPosition = {
                    top : _t,
                    bottom : ""
                };

                this.$wrapper.css(this.getPositionStyles());
            }
        }
        $(".hero-image-wrapper, .bgsectiondelimiter.sectiondelimiter, #footer").unbind("positionChanged");
        _p.init();
        $timeline.trackable().on("positionChanged", _p.recalculate );
    });
}

!function($){

    $(document).ready(function(){

        if (new MobileSupport().respondsTo()) {

            var _sn = $("#socialNavbar #navbarCollapse");

            $(".about-us-menu").click(function(e){
                e.preventDefault();
                var _e, _el = $(".social-navbar.navbar-toggle").get(0);
                if (document.createEvent) {
                    _e = document.createEvent("MouseEvents");
                    _e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    _el.dispatchEvent(_e);
                } else if (document.createEventObject) {
                    _e = document.createEventObject();
                    _e.screenX = 0;
                    _e.screenY = 0;
                    _e.clientX = 0;
                    _e.clientY = 0;
                    _e.ctrlKey = false;
                    _e.altKey = false;
                    _e.shiftKey = false;
                    _e.button = 0;
                    _el.fireEvent("onclick");
                }
            });

            $(".social-navbar.navbar-toggle").click(function(e){
                displayBBG($(this));
            });

            _sn.scrolling({
                prevent: true
            });
        }

        $("#timeline-content").on("tl_loaded", function(){
            adjustAffix();
        });

        //Add class to active tab of navigation
        $('.adminMenu li a.on').parents('li').last().addClass('active');

        //Add class for two-column

        if (!$('.two-column').parents('body').hasClass('cq-wcm-edit')) {
            $('.two-column').parent('div').addClass('column-container');
        }

        //styles for policy
        $('.policy-content').parents('.articleCallout').addClass('policy');

        //styles for collapsible text headings
        $('.collapsibleText ~ .paragraphs div + div').closest('.articleSection').next().find('.article-section-title').css('margin-top', '0');
        $('.collapsibleText ~ .paragraphs div + div').closest('.articleSection').css({'font-size': '17px'})

        //animation for leadership
        if ($('.headline h1:contains("Profiles")').length > 0) {
            var contentPosition = $('.content-container').offset().top;
            $('body, html').on('click', '.anchor_nav_link', function() {
                $('body, html').animate({scrollTop: contentPosition }, '500', 'swing', function(){})
            });
        }

    });

}(jQuery);

$(document).ready(function(){
    $(".image-gallery-container").each(function(){
        var showNav = false,
            showHeader = false,
            captionPosition = "in",
            $galleryHeader = $(this).find(".image-gallery-header");
        if($galleryHeader.length > 0){
            showHeader = true;
        }
        $(this).find(".image-gallery").responsiveSlides({
            auto:false,
            pager:true,
            nav:true,
            'header':showHeader,
            'captionPosition':captionPosition
        });
    });
});
