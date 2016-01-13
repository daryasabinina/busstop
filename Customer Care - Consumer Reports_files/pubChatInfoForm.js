//
// Copyright (C) 2011 Wilke/Thornton, Inc.
//
// File:     js/entries/pubChatInfoForm.js
// Created:  9.7
// Modified: 2011/06/20 - Anne D. Ryan 
//              CRS-273 - Created for base 9.7
//           2011/10/10 - Anne D. Ryan 
//             CRS-1102 - Added email validation.
//           2012/10/25 - Anne D. Ryan
//             CRS-1427 - Disable Send after pressed, to avoid duplicates.
//           2013/02/15 - Anne D. Ryan
//             CRS-1605 - Chrome fix to Disable Send after pressed.
//           2014/05/20 - Anne D. Ryan
//             CRS-2111 - Support checkbox form fields.
//           2014/08/11 - Anne D. Ryan
//             CRS-1921 - New mobile chat interface.
//           2014/07/02 - Anne D. Ryan
//             CRS-2168 - Support passed-in form field defaulting. jsLint cleanup.
//           2015/02/26 - Anne D. Ryan
//             CRS-2448 - Email: Allow > 4 characters after last period.

/*global Wt, cstrAppURL, WtUtil, window, cstrBtnSendChatMsg,
         sysMsgChatRequiredFields */

//
// NOTE: Ext is not available
//

//
// Set up Wt.page namespace
//

try {
    if (!Wt) {
        Wt = {};
    }
} catch (e) {
    Wt = {};
}

if (!Wt.chat) {
    Wt.chat = {};
}

//
// Class Definitions
//

/**
 * @class Wt.chat.pubChatInfoFormHandler
 * A singleton class used by the chat module, as the
 * handler for the <code>webspeed/public/chat/pubChatInfoForm.htm</code> page.
 * 
 * @singleton
 * @namespace Wt.chat
 */
 
Wt.chat.pubChatInfoFormHandler = function () {
    var _singleton;

    //
    // The singleton object, with its public properties and functions
    //
    
    _singleton = {

        //
        // Configuration properties
        //
        
        startOptions: {},
    
        //
        // Public properties
        //        
        
        //
        // Public functions
        //

        onReady: function() {
            this.startOptions = WtUtil.getUrlParams();
            this.updateDocumentTitle( this.startOptions.title || "" );
            
            // set event handlers 
            document.getElementById('cmdSend').onclick = function() {                
                Wt.chat.pubChatInfoFormHandler.createChatSession();
            };
            
            this.initButtonValues();
            this.defaultFormFieldValues();
            this.sessionData = {};
            
            var elements = document.getElementById("frmEntry").elements;
            if ( elements.length === 1 ) {   // just the SEND button
                // No form fields, so hide SEND button.
                // Happens when chat is unavailable.
                document.getElementById("sendButtonDiv").style.display = "none"; 
            }
        },
            
        //
        // Private properties
        //
        
    
        //
        // Private functions
        //
        
    
        /**   
         *  Validate form fields 
         */
        anyErrors: function() {
            var element;
            var elements;  
            var form; 
            var mask;   
            var msg = "";   
            var required;  
            
            form = document.getElementById("frmEntry");
            elements = form.elements;
            for (var i = 0, len = elements.length; i < len; ++i) {
                element = elements.item(i);
                required = this.hasAttribute(element, "wtrequired");
                if ( required && ( !element.value || element.value  === "" )) {
                    try {
                        msg = sysMsgChatRequiredFields.textContent 
                              || sysMsgChatRequiredFields.innerText;
                    } catch(e) {}
                    msg = ( msg === "" || msg.indexOf("[") === 0 ) ? 
                            "Please enter values for the required fields" : msg;
                            
                    alert (msg);
                    return true;
                }
                // email validation
                if ( element.value.replace(" ","") !== "" 
                && element.id.indexOf("email") !== -1 ) {
                    mask = /^[a-z0-9_%+-][a-z0-9\._%+-]*@[a-z0-9-][a-z0-9\.-]*\.[a-z]{2,}$/i; 
                    if (! mask.test(element.value)) {
                        try {
                            msg = sysMsgChatEmailInvalid.textContent 
                              || sysMsgChatEmailInvalid.innerText;
                        } catch(e2) {}
                        msg = ( msg === "" || msg.indexOf("[") === 0 ) ? 
                                "Email format is invalid." : msg;
                        alert (msg);
                        return true;
                    }
                }
            }        
            return false;
        },
        
        /**
         * Copies data from the response object to the Chat Session Data object. 
         *   
         * @param {Object} response  The Ajax response object.  
         *      
         * @return {Boolean} Sucessful?
         */
        copyDataFromServer: function(response) {        
            this.sessionData = {};
            for (var prop in response) {   
                if (prop !== "err" && prop !== "info" && prop !== "warn" ) {
                    try {
                        this.sessionData[prop] = this.getResponseValue(response, prop); 
                    } catch (e){}
                }   
            }
            return true;            
        },
        
    
        /**   
         *  Creates a new chat session 
         */
        createChatSession: function() { 
            var elements;
            var form; 
            var jsonUrl;
            var objElem;
            var params = {};
            var urlParams = "";
            
            
            // validate form data            
            if ( this.anyErrors() ) { return; }

            document.getElementById("sendButtonDiv").disabled = true;    // does not work in chrome
            document.getElementById("cmdSend").disabled = true;

            params = this.startOptions;
            form = document.getElementById("frmEntry");
            
            if ( form ) {
                elements = form.elements;
                for (var i = 0, len = elements.length; i < len; ++i) {
                    objElem = elements.item(i);
                    if (objElem.value) {
                        name = (objElem.id || objElem.name);
                        params[name] = objElem.value;

                        if (objElem.type && objElem.type === "checkbox") {
                            params[name] = objElem.checked ? "yes" : "no";
                        }

                        if (objElem.tagName === "TEXTAREA") {
                            params.initialText = name;
                        }
                    }
                }
            }
            
            if ( params ) {
              urlParams = "&" + WtUtil.urlEncode(params);
            }
            
            jsonUrl = cstrAppURL
                    + "w/public/chat/wsChatsessionNew.w" 
                    + "?upRespFormat=json"
                    + "&upAction=update"
                    + "&chatAction=getMessage"
                    + "&upLock=no"                   
                    + urlParams; 
                    
            Wt.chat.pubChatInfoFormHandler._jsonp(jsonUrl, 
                      "Wt.chat.pubChatInfoFormHandler.postChatsessionComplete");
        },         
        
        hasAttribute: function(element, attributeName) {
            try {
                return element.hasAttribute(attributeName);
            } catch (e) {
                // Fall through to next way of seeing if the attribute exists
            }
            
            try {
                return (element.getAttributeNode(attributeName) ? true : false);
            } catch (e2) {
                // Fall through to next way of seeing if the attribute exists
            }
            
            return (element.getAttribute(attributeName) !== null);
        },


        /**
         * Defaults data from URL param values to the Info Form fields
         */
        defaultFormFieldValues: function() {
            var elements,
                fieldId,
                form,
                i,
                len,
                objElem,
                value;

            form = document.getElementById("frmEntry");
            if ( form ) {
                elements = form.elements;
                for (i = 0, len = elements.length; i < len; ++i) {
                    objElem = elements.item(i);
                    fieldId = objElem.id || "";
                    if (this.startOptions[fieldId]) {
                        value = this.startOptions[fieldId];
                        if (objElem.type && objElem.type === "checkbox") {
                            objElem.checked = (value == "yes" || value == "true" ? true : false);
                        } else {
                            objElem.value = value;
                        }
                    }
                }
            }
        },
        
        /**
         * Extracts a specific response element's value.  
         *   
         * @param {Object} response  The wtResponse object. 
         * @param {String} tagName  The name of the requested element. 
         *      
         * @return {Object} The reference to the newly created chat window. 
         */
        getResponseValue: function(response, tagName) {
            var value = "";
            try {
                value = response[tagName];
            } catch(e) {}
            
            return value;
        },


        initButtonValues: function() {
            var element;
            element = document.getElementById('cmdSend');
            if (element) {
               element.innerHTML = cstrBtnSendChatMsg;
            }
        },

        
        /**
         * jsonp Submits a call using the Cross Domain script tag functionality
         * @url {String} URL to json building server program.
         * @callback {String} name of function for returned script to call to eval JSON.
         * @query {Object} additional query string for URL
         */
        _jsonp: function (url, callback, query) {                
            if (url.indexOf("?") > -1) {
                url += "&callback=";
            } else {
                url += "?callback=";
            }
            url += callback + "&";
            if (query) {
                url += encodeURIComponent(query) + "&";
            }
            url += new Date().getTime().toString(); // prevent caching  
            var script = document.createElement("script");        
            script.setAttribute("src",url);
            script.setAttribute("type","text/javascript");                
            document.body.appendChild(script);
        },
    
        /**
         * Opens the chat session window
         *   
         * @param {Object} options The options for the request. 
         * The properties that are recognized are:
         *      
         *   window : Object (Optional)
         *       An object which may contain the following properties:
         *              
         *       top : Number (Optional)
         *             The position of the top edge of the chat window in pixels.
         *       left : Number (Optional)
         *             The position of the left edge of the chat window in pixels.
         *       width : Number (Optional)
         *             The width of the chat window in pixels. 
         *             Default is 360.
         *       height : Number (Optional)
         *             The height of the top of the chat window in pixels. 
         *             Default is 660.
         *       name : String (Optional)
         *             The internal (browser) name of the chat window.
         *       title : String (Optional)
         *             The title of chat window. Default is "CRS Chat Session".
         *       cssUrl : String (Optional)
         *             The fully-qualified URL of an external stylesheet 
         *             to apply to the chat window.
         *       logoUrl : String (Optional)
         *             The fully-qualified URL of an image (e.g. PNG, JPG, JIF) 
         *             to insert at the top of the chat window.
         *       headerHtml : String (Optional)
         *             An HTML fragment to insert at the top of the chat window, 
         *             immediately after the <body> tag.
         *       footerHtml : String (Optional)
         *             An HTML fragment to insert at the bottom of the chat window, 
         *             immediately before the </body> tag. 
         *             Default is none.
         *             
         *   form : Object (Optional)
         *       A reference to a <form> element containing data to be passed 
         *       to the server and added to the contact, e.g. the consumer's name, 
         *       email address, initial question, etc. 
         *       As an alternative (or in addition), specific values may be passed 
         *       to the server using the info property  
         *   info : Object (Optional)
         *       An object which may contain additional property-value pairs 
         *       to be passed to the server and added to the contact, 
         *       e.g. a product / UPC based on the current web page. 
         *       As an alternative (or in addition), the values entered 
         *       into a <form> element may be passed using the form property.
         *   site : String (Optional)
         *       A character string which will be mapped 
         *       to a specific CRS import source table, 
         *       to define processing rules for the sent data.  
         *       Mapped via the CRS config chat/importSource.
         *   clickStream : Array (Optional)
         *       An array of 0..n page IDs to be passed to the server and added 
         *       to the Contact; useful for analyzing how the consumer traverses 
         *       the website before requesting chat.  
         *   shoppingCart : String (Optional)
         *       The ID of an active shopping cart to be passed to the server 
         *       and added to the Contact; useful if the rep will be assisting 
         *       the consumer in purchase decisions, or to tie the chat with a purchase.
         *            
         * @return {Object} The reference to the newly created chat window.  
         */            
        openChatsession: function() {
            var pageUrl,
                url,
                urlParams = "";
            
            this.sessionData.mode = "edit";
            this.sessionData.chatrequestor = "initiator";
            
            
            try {
                // clear the value used to open this window, so not duplicated 
                delete this.startOptions.upHtmlFile;
            } catch(e) {}
            
            if ( this.startOptions ) {
              urlParams = urlParams + "&" + WtUtil.urlEncode(this.startOptions);
            }
            
            if ( this.sessionData ) {
              urlParams = urlParams + "&" + WtUtil.urlEncode(this.sessionData);
            }

            pageUrl = "webspeed/public/chat/pubChatSession.htm";

            url = cstrAppURL + "w/public/ntOpen.w?upHtmlFile="
                + pageUrl + urlParams;
            
            window.location.replace(url);      
        },    
    
        postChatsessionComplete: function(jsonString) {
            var err;
            var msg = "";
            var response; 
            var result;
            
            try {
                result = eval(jsonString);
                response = result.wtResponse;
            } catch(e) {
                if (this.msgUnavailable) {
                    this.status = "offline";
                    this.msg = this.msgUnavailable;
                }
                return false;
            }
            
            err = this.getResponseValue(response, "err");
            if ( err ) {
                msg = (this.getResponseValue(response, "errMsg") || err);
                this.status = "offline";
                this.msg = msg; 
                alert (msg);  
                return false; 
            } 
            
            // Set session params from returned values
            var chatAvailable = this.copyDataFromServer(response);  
            
            if (chatAvailable) {
                this.openChatsession(); 
            }
        },
        
        /* 
        * Updates the Document title on the Window
        */    
        updateDocumentTitle: function(newTitle) {      
            try {
                if (newTitle !== "") { 
                    document.title = newTitle;
                }
            } catch (e) { }
            return true;
        }
    
    };
    
    return _singleton;
}();


window.onload = function() {
    var mobileUrl;

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        mobileUrl = window.location.href.replace("chat/pubChatInfoForm", "mobile/chat/chatInfoForm");
        window.location.replace(mobileUrl);
    } else {
        window.document.body.style.visibility = "visible";
        Wt.chat.pubChatInfoFormHandler.onReady();
    }
};
