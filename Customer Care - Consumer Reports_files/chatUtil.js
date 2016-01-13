// © 2009 Wilke/Thornton, Inc.
//
//
//   File:     js/public/chat/util.js
//   Created:  2009/08/17 - Anne D. Ryan
// 
//   NOTES:    WTI public survey entry form javascript functions
// 
//   Modified: 2009/08/17 - Anne D. Ryan 
//               - CRS-111 - Created for public chat browser independance.
//                 Ajax, buildAppUrl, plus Post Form functions from ntEntry.js.
//             2010/01/06 - Anne D. Ryan 
//               - CRS-200 - eval json before callback.
//                 XMLHttpRequest backward compatibility.  

/* Originally from global.js  */

// Provide the XMLHttpRequest class for IE 5.x-6.x:
// Other browsers (including IE 7.x-8.x) ignore this
//   when XMLHttpRequest is predefined
if (typeof XMLHttpRequest == "undefined") {
  XMLHttpRequest = function() {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); }
      catch(e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch(e) {}
  };
}

//
// Class declarations
//
WtUtil = function() {
    var _debug = false;
    
    return {
    
        ajaxGetResponseValue: function(response, tagName) {
            var value = "";
            try {
                value = response[tagName];
            } catch(e) {}
            return value;
        },
        
        ajaxSendRequest: function(url, postData, isAsync, callback) {
            // Assumes Synchronus GET request, unless params indicate otherwise
            var async = (isAsync ? isAsync : false);
            var eTime = new Date;
            var method = (postData ? "POST" : "GET");
            var postQueryString = null; 
            var response;
            
            // Add timestamp to URL, as a cache buster   
            if (url) {
                url += (url.indexOf("?") == -1 ? "?" : (url.indexOf("?") !== url.length ? "&" : ""));
                url += eTime.getTime() + "=";
            }        
            
            var xmlHttp = new XMLHttpRequest();
            if (callback) {
                xmlHttp.onreadystatechange = function() {
                    //Call a function when the state changes.
                  	if(xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            if (url.indexOf("upRespFormat=json") >= 0 || (postQueryString.indexOf("upRespFormat=json") >= 0 )) {
                                try { 
                                    response = eval("(" + xmlHttp.responseText + ")").wtResponse;
                                } catch(e) {response = {}; }
                            } else {
                                response = xmlHttp.responseText;
                            }
                        } else {
                            response = undefined;
                        }
                      	callback.call(this, response);
                  	}
                }
            }
            xmlHttp.open(method, url, async); 
            
            if (postData) {
                postQueryString = WtUtil.urlEncode(postData);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.setRequestHeader("Content-Length", postQueryString.length);
            }
            xmlHttp.send(postQueryString);
            
            if (async == false) {
                if (xmlHttp.status != 200) {
                    throw "wsErrStatusNot200";
                }
                
                if (url.indexOf("upRespFormat=json") >= 0 || (postQueryString.indexOf("upRespFormat=json") >= 0 )) {
                    try { 
                        response = eval("(" + xmlHttp.responseText + ")").wtResponse;
                    } catch(e) {response = {}; }
                } else {
                    response = xmlHttp.responseText;
                }            
                return response;
            } 
            
            return true;
        },
        
        copyDataFromServer: function(response) {
            //set fields from returned values
            
            for (var prop in response) {   
                if (prop !== "err" && prop !== "info" && prop !== "warn" ) {
                    try {
                        document.getElementById(prop).value = response[prop];
                    } catch (e){}
                }   
            }
            return true;            
        },
        
        getUrlParams: function() {
            var aSearch = []; 
            var opt = []; 
            var params = {}; 
            
            aSearch = document.location.search.slice(1).split('&'); 
            for (i=0; i < aSearch.length; ++i) { 
                opt = aSearch[i].split('=', 2); 
                if (opt.length > 1) { 
                  params[opt[0]] = decodeURIComponent(opt[1]); 
                } else { 
                  params[opt[0]]=''; 
                }
            } 
            return params;
        },
        
         /**
         *  Revision of Ext.urlEncode         
         * Takes an object and converts it to an encoded URL. e.g. urlEncode({foo: 1, bar: 2}); would return "foo=1&bar=2".  
         * @return {String}
         */
        urlEncode : function(o){
            if(!o){
                return "";
            }
            var buf = [];
            for(var key in o){
                var ov = o[key], k = encodeURIComponent(key);
                var type = typeof ov;
                if(type == 'undefined'){
                    buf.push(k, "=&");
                } else if(type != "function" && type != "object"){
                    buf.push(k, "=", encodeURIComponent(ov), "&");
                } else if(ov.constructor.toString().indexOf("Array") > -1){
                    if (ov.length) {
	                      for(var i = 0, len = ov.length; i < len; i++) {
	                          buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
	                    }
	                  } else {
	                      buf.push(k, "=&");
	                  }
                }
            }
            buf.pop();
            return buf.join("");
        }
    }
} ();


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.leftTrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rightTrim = function() {
	return this.replace(/\s+$/,"");
}
