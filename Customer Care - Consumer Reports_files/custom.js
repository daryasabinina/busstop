function MobileSupport() {
	var instance = null, ua = navigator.userAgent,
		p = navigator.platform, fromHex = function(v) {
		if (typeof v == 'undefined' || v == null)
			throw new TypeError();
		return parseInt(v, 16);
	};
	MobileSupport = function() {
		return instance;
	}
	MobileSupport.prototype = this;
	
	MobileSupport.prototype.constructor = MobileSupport;
	
	this.respondsTo = function() {
		var _v = 0;
		for(var _p in this.system) {
			_v |= this.system[_p];
		}
		return !!(_v ^ fromHex(00)) || this.clientWidth() <= 1081;
	}
    this.clientWidth = function() {
		var _w = window.innerWidth, _d = document
        if (typeof _w != "number"){
        	_w = (_d.compatMode == "CSS1Compat") ?
            	_d.documentElement.clientWidth :
        		_d.body.clientWidth;
        }
		return _w;
    }
	this.system = {
		iphone: 0,
		ipad: 0,
		ios: 0,
		android: 0,
		mac: 0,
		nokiaN: 0,
		winMobile: 0
	}
	
	with(this.system) {
		iphone = (ua.indexOf("iPhone") > -1) ? fromHex(01) : 0;
		ipod = (ua.indexOf("iPod") > -1) ? fromHex(02) : 0;
		ipad = (ua.indexOf("iPad") > -1) ? fromHex(04) : 0;
		mac = (p.indexOf("Mac") == 0) ? fromHex(80) : 0;
		nokiaN = (ua.indexOf("NokiaN") > -1) ? fromHex(08) : 0;
	}
	if (this.system.mac && ua.indexOf("Mobile") > -1){
		if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
			this.system.ios = (RegExp.$1) ? fromHex(10) : 0;
		}
	}
	if (/Android (\d+\.\d+)/.test(ua)){
		this.system.android = (RegExp.$1) ? fromHex(20) : 0;
	}
	
	if(/Windows Phone (OS )?(\d+.\d+)/.test(ua)){
		this.system.winMobile = (RegExp.$2) ? fromHex(40) : 0;
	}
	instance = new MobileSupport();
	return instance;
}

function sizeTrack() {
	if (new MobileSupport().respondsTo()) {
		$(".heroimage-wrapper-fixed").attr("data-min-height", 0)
    }
}

!function($){
    $(document).ready(function(){
        $(".hero-image-wrapper").removeAttr("data-ratio");
    });
}(jQuery);