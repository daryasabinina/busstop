/*!
 * jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */
(function( jQuery, window, undefined ) {
// See http://bugs.jquery.com/ticket/13335
// "use strict";


var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
 jQuery.migrateMute = true;

// Show a message on the console so devs know we're active
if ( !jQuery.migrateMute && window.console && window.console.log ) {
	window.console.log("JQMIGRATE: Logging is active");
}

// Set to false to disable traces that appear with warnings
if ( jQuery.migrateTrace === undefined ) {
	jQuery.migrateTrace = true;
}

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}


var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn
migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = jQuery.fn.init,
	oldParseJSON = jQuery.parseJSON,
	// Note: XSS check is done below after string is trimmed
	rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

// $(html) "looks like html" rule change
jQuery.fn.init = function( selector, context, rootjQuery ) {
	var match;

	if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
			(match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {
		// This is an HTML string according to the "old" rules; is it still?
		if ( selector.charAt( 0 ) !== "<" ) {
			migrateWarn("$(html) HTML strings must start with '<' character");
		}
		if ( match[ 3 ] ) {
			migrateWarn("$(html) HTML text after last tag is ignored");
		}
		// Consistently reject any HTML-like string starting with a hash (#9521)
		// Note that this may break jQuery 1.6.x code that otherwise would work.
		if ( match[ 0 ].charAt( 0 ) === "#" ) {
			migrateWarn("HTML string cannot start with a '#' character");
			jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
		}
		// Now process using loose rules; let pre-1.8 play too
		if ( context && context.context ) {
			// jQuery object as context; parseHTML expects a DOM object
			context = context.context;
		}
		if ( jQuery.parseHTML ) {
			return oldInit.call( this, jQuery.parseHTML( match[ 2 ], context, true ),
					context, rootjQuery );
		}
	}
	return oldInit.apply( this, arguments );
};
jQuery.fn.init.prototype = jQuery.fn;

// Let $.parseJSON(falsy_value) return null
jQuery.parseJSON = function( json ) {
	if ( !json && json !== null ) {
		migrateWarn("jQuery.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

// Warn if the code tries to get jQuery.browser
migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	migrateWarn( "jQuery.sub() is deprecated" );
	return jQuerySub;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
jQuery.ajaxSetup({
	converters: {
		"text json": jQuery.parseJSON
	}
});


var oldFnData = jQuery.fn.data;

jQuery.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = jQuery.data( elem, name );
		evt = jQuery._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of jQuery.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i,
	oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

jQuery.fn.andSelf = function() {
	migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

// Since jQuery.clean is used internally on older versions, we only shim if it's missing
if ( !jQuery.clean ) {
	jQuery.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("jQuery.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from jQuery 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = jQuery.event.add,
	eventRemove = jQuery.event.remove,
	eventTrigger = jQuery.event.trigger,
	oldToggle = jQuery.fn.toggle,
	oldLive = jQuery.fn.live,
	oldDie = jQuery.fn.die,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
	jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
if ( jQuery.event.dispatch ) {
	migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
jQuery.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

jQuery.fn.error = function() {
	var args = Array.prototype.slice.call( arguments, 0);
	migrateWarn("jQuery.fn.error() is deprecated");
	args.splice( 0, 0, "error" );
	if ( arguments.length ) {
		return this.bind.apply( this, args );
	}
	// error event should not bubble to window, although it does pre-1.7
	this.triggerHandler.apply( this, args );
	return this;
};

jQuery.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || jQuery.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

jQuery.fn.live = function( types, data, fn ) {
	migrateWarn("jQuery.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	jQuery( this.context ).on( types, this.selector, data, fn );
	return this;
};

jQuery.fn.die = function( types, fn ) {
	migrateWarn("jQuery.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	jQuery( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
jQuery.each( ajaxEvents.split("|"),
	function( _, name ) {
		jQuery.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					jQuery.event.add( document, name + "." + jQuery.guid, function() {
						jQuery.event.trigger( name, null, elem, true );
					});
					jQuery._data( this, name, jQuery.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
				}
				return false;
			}
		};
	}
);


})( jQuery, window );

/* Copyright 1996-2012 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com */

var sc_code_ver = "H.25.1|12.12.07" //SiteCatalyst code version

/** @namespace window.initSScode */
/** @namespace window.s_account */

function runSCode() {

    if (typeof window.s_account === 'undefined') {
        console.warn('Tracking has been suppressed: s_account is not defined');
        return;
    }

    window.s = s_gi(window.s_account);

    /************************** CONFIG SECTION **************************/
    s.trackDownloadLinks = true;
    s.trackExternalLinks = true;
    s.trackInlineStats = true;
    s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx,swf";
    s.linkInternalFilters = "javascript:,consumerreports.org,consumerreportshealth.org,consumer.org,jobs-consumers.icims.com,shopsmartmag.org";
    s.linkLeaveQueryString = false;
    s.linkTrackVars = "None";
    s.linkTrackEvents = "None";
    s.charSet = "utf-8";

    s.formList = "login,cro_login,register_purchase,checkout_aps_report,aps_select_reports,aps_order";//form names tracked
    s.trackFormList = true;
    s.trackPageName = true;
    s.useCommerce = false;
    s.varUsed = "prop18";
    s.eventList = "";

    s.linkTrackVars = "prop21,prop22,prop23,prop24";

    s.usePlugins = true;

//EY Code Change
    s.enableVideoTracking = true;

    /* TimeStamp: YYYY:MM:DD:HH:MM:SS */
    var now = new Date(),
        now_m = now.getMonth() + 1,
        now_d = now.getDate(),
        now_h = now.getHours(),
        now_min = now.getMinutes(),
        now_s = now.getSeconds();
    if (new String(now_m).length == 1) now_m = "0" + now_m;
    if (new String(now_d).length == 1) now_d = "0" + now_d;
    if (new String(now_h).length == 1) now_h = "0" + now_h;
    if (new String(now_s).length == 1) now_s = "0" + now_s;
    if (new String(now_min).length == 1) now_min = "0" + now_min;
    s.prop60 = s.eVar60 = now.getFullYear() + ":" + now_m + ":" + now_d + ":" + now_h + ":" + now_min + ":" + now_s;

    function s_doPlugins(s) {

        /* Form Analysis 2.1  */
        s.setupFormAnalysis();

        /* Setup LinkTracking (lid, pos) */
        s.hbx_lt = "auto" //manual, auto
        s.setupLinkTrack("prop21,prop22,prop23,prop24", "SC_LINKS");

        /* Domain */
        s.server = window.location.hostname;

        /* Page URL */
        s.prop29 = document.location.href.split("?")[0];

        /* External Campaign Tracking */
        if (!s.campaign) s.campaign = s.getQueryParam('EXTKEY')
        s.campaign = s.getValOnce(s.campaign, 's_extkey', 0)
        if (s.campaign && s.getQueryParam('ref')) s.referrer = s.getQueryParam('ref');
        if (!s.eVar19) s.eVar19 = s.getQueryParam('mkwid')
        if (!s.eVar20) s.eVar20 = s.getQueryParam('pcrid')

        /* Campaign Stacking */
        s.eVar14 = s.crossVisitParticipation(s.campaign, 's_ev14', '30', '5', '>', '', 0);

        /* Internal Campaigns */
        if (!s.eVar1) s.eVar1 = s.getQueryParam('INTKEY');

        /* Time Parting: Eastern */
        if (!s.prop25 && !s.eVar11) s.prop25 = s.eVar11 = s.getTimeParting('h', '-5'); //hour
        if (!s.prop26 && !s.eVar12) s.prop26 = s.eVar12 = s.getTimeParting('d', '-5'); //day

        /* TimeStamp: YYYY:MM:DD */
        var now = new Date();
        var now_m = now.getMonth();
        now_m += 1;
        if (now_m.length == 1) now_m = "0" + now_m;
        var now_d = now.getDate();
        if (now_d.length == 1) now_d = "0" + now_d;
        s.prop19 = s.eVar24 = now.getFullYear() + ":" + now_m + ":" + now_d;

        /* User ID & Segment */
        if (s.prop15 && !s.eVar8) s.eVar8 = s.prop15;
        if (s.prop16 && !s.eVar9) s.eVar9 = s.prop16;
        //if(!s.prop16&&!s.eVar9) s.prop16=s.eVar9="anon";

        /* Search results*/
        if (s.prop67) {
            s.eVar67 = s.prop67 = s.prop67.toLowerCase();
        }

        function getURLParameter(name) {
            var results = location.search.match(RegExp('[?|&]' + name + '=(.+?)(&|$)'))
            if (results)
                return decodeURIComponent(results[1])
        };
        var searchToken = getURLParameter('searchToken');
        if (searchToken) {
            s.eVar67 = s.prop67 = searchToken.toLowerCase() + '-redirect';
        }

        /* Enhanced download tracking */
        s.url = s.downloadLinkHandler();
        if (s.url) {
            s.eVar3 = s.prop27 = s.url.substring(s.url.lastIndexOf("/") + 1, s.url.length); //filename
            if (s.pageName) s.prop28 = s.pageName;
            s.events = s.apl(s.events, "event16", ",", 2);
            s.linkTrackVars = "eVar3,eVar8,prop27,prop28,events";  //includes UserID
            s.linkTrackEvents = "event16";
        }

        /* Capture Purchase ID into eVar */
        if (s.purchaseID) s.eVar17 = s.purchaseID;

        /* Product View (custom) Event */
        if (s.events && s.events.indexOf('prodView') != -1) {
            s.events = s.apl(s.events, "event15", ",", 2);
            s.eVar23 = "+1"; //counter
        }

        /* New or Repeat Visitor Within 3 Months */
        s.prop13 = s.eVar13 = s.getNewRepeat(90);

        /* Copy props and eVars */
        if (s.prop9 && !s.eVar16) s.eVar16 = s.prop9;
        if (s.prop17 && !s.eVar10) s.eVar10 = s.prop17;
        if (s.prop35 && !s.eVar33) s.eVar33 = s.prop35;
        if (s.channel && !s.eVar15)s.eVar15 = s.channel;

        /* Page View Event */
        s.events = s.apl(s.events, "event1", ",", 2);

        /* Page Name eVar */
        if (s.pageName)s.eVar21 = s.pageName;

        /* Site Section Variables - Passing props into eVars */
        if (s.prop1)s.eVar40 = s.prop1;
        if (s.prop2)s.eVar41 = s.eVar67;
        if (s.prop3)s.eVar42 = s.prop3;
        if (s.prop4)s.eVar43 = s.prop4;
        if (s.prop5)s.eVar44 = s.prop5;

        /* Code Version */
        s.prop50 = sc_code_ver; //defined: line 4
        // The getPercentPageViewed plugin returns an integer if the pageID argument is unspecified
        // or is set to an empty string or evaluates to false, as shown in example 1 below. If the
        // PageID is specified, the plugin returns an array as shown in example 2.
        // Example 1: Get maximum percent viewed only, using s.pageName as an implicit identifier
        s.prop43 = s.getPreviousValue(s.pageName, 's_ppn'); //prop43: prev page name
        s.prop44 = s.getPercentPageViewed(); //prop44: max % viewed of prev page
        if (!s.prop43 || s.prop43 == 'no value')s.prop44 = ''; //clear max % viewed if no prev page view
    }

    s.doPlugins = s_doPlugins
    /************************** PLUGINS SECTION *************************/
    /*
     * Plugin: getQueryParam 2.1 - return query string parameter(s)
     */
    s.getQueryParam = new Function("p", "d", "u", ""
        + "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
        + "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
        + ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t)v+=v?d+t:t;p=p.subs"
        + "tring(i==p.length?i:i+1)}return v");
    s.p_gpv = new Function("k", "u", ""
        + "var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
        + "=s.pt(q,'&','p_gvf',k)}return v");
    s.p_gvf = new Function("t", "k", ""
        + "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
        + "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
        + "epa(v)}return ''");
    /*
     * Plugin: manageVars .02b - Can be called to clear vars, lower, etc
     */
    s.manageVars = new Function("c", "l", "f", ""
        + "var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa"
        + "geName,purchaseID,channel,server,pageType,campaign,state,zip,events"
        + ",products,transactionID';for(var n=1;n<76;n++){vl+=',prop'+n+',eVar"
        + "'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl"
        + "it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l"
        + "a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}"
        + "}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0"
        + ");return true;}else{return false;}");
    s.clearVars = new Function("t", "var s=this;s[t]='';");
    s.lowercaseVars = new Function("t", ""
        + "var s=this;if(s[t]){s[t]=s[t].toString();s[t]=s[t].toLowerCase();}");
    /*
     * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
     */
    s.getNewRepeat = new Function("d", "cn", ""
        + "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"
        + "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="
        + "=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"
        + "-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"
        + "ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");
    /*
     * Plugin: getTimeParting 2.0
     */
    s.getTimeParting = new Function("t", "z", "y", "l", ""
        + "var s=this,d,A,U,X,Z,W,B,C,D,Y;d=new Date();A=d.getFullYear();Y=U=S"
        + "tring(A);if(s.dstStart&&s.dstEnd){B=s.dstStart;C=s.dstEnd}else{;U=U"
        + ".substring(2,4);X='090801|101407|111306|121104|131003|140902|150801"
        + "|161306|171205|181104|191003';X=s.split(X,'|');for(W=0;W<=10;W++){Z"
        + "=X[W].substring(0,2);if(U==Z){B=X[W].substring(2,4);C=X[W].substrin"
        + "g(4,6)}}if(!B||!C){B='08';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;}D"
        + "=new Date('1/1/2000');if(D.getDay()!=6||D.getMonth()!=0){return'Dat"
        + "a Not Available'}else{z=z?z:'0';z=parseFloat(z);B=new Date(B);C=new"
        + " Date(C);W=new Date();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.g"
        + "etTimezoneOffset()*60000);W=new Date(W+(3600000*z));X=['Sunday','Mo"
        + "nday','Tuesday','Wednesday','Thursday','Friday','Saturday'];B=W.get"
        + "Hours();C=W.getMinutes();D=W.getDay();Z=X[D];U='AM';A='Weekday';X='"
        + "00';if(C>30){X='30'}if(B>=12){U='PM';B=B-12};if(B==0){B=12};if(D==6"
        + "||D==0){A='Weekend'}W=B+':'+X+U;if(y&&y!=Y){return'Data Not Availab"
        + "le'}else{if(t){if(t=='h'){return W}if(t=='d'){return Z}if(t=='w'){r"
        + "eturn A}}else{return Z+', '+W}}}");
    /*
     *	Plug-in: manageQueryParam v1.2 - Manages query string parameters
     *	by either encoding, swapping, or both encoding and swapping a value.
     */
    s.manageQueryParam = new Function("p", "w", "e", "u", ""
        + "var s=this,x,y,i,qs,qp,qv,f,b;u=u?u:(s.pageURL?s.pageURL:''+s.wd.lo"
        + "cation);u=u=='f'?''+s.gtfs().location:u+'';x=u.indexOf('?');qs=x>-1"
        + "?u.substring(x,u.length):'';u=x>-1?u.substring(0,x):u;x=qs.indexOf("
        + "'?'+p+'=');if(x>-1){y=qs.indexOf('&');f='';if(y>-1){qp=qs.substring"
        + "(x+1,y);b=qs.substring(y+1,qs.length);}else{qp=qs.substring(1,qs.le"
        + "ngth);b='';}}else{x=qs.indexOf('&'+p+'=');if(x>-1){f=qs.substring(1"
        + ",x);b=qs.substring(x+1,qs.length);y=b.indexOf('&');if(y>-1){qp=b.su"
        + "bstring(0,y);b=b.substring(y,b.length);}else{qp=b;b='';}}}if(e&&qp)"
        + "{y=qp.indexOf('=');qv=y>-1?qp.substring(y+1,qp.length):'';var eui=0"
        + ";while(qv.indexOf('%25')>-1){qv=unescape(qv);eui++;if(eui==10)break"
        + ";}qv=s.rep(qv,'+',' ');qv=escape(qv);qv=s.rep(qv,'%25','%');qv=s.re"
        + "p(qv,'%7C','|');qv=s.rep(qv,'%7c','|');qp=qp.substring(0,y+1)+qv;}i"
        + "f(w&&qp){if(f)qs='?'+qp+'&'+f+b;else if(b)qs='?'+qp+'&'+b;else qs='"
        + "?'+qp}else if(f)qs='?'+f+'&'+qp+b;else if(b)qs='?'+qp+'&'+b;else if"
        + "(qp)qs='?'+qp;return u+qs;");
    /*
     *  Plug-in: crossVisitParticipation v1.7 - stacks values from
     *  specified variable in cookie and returns value
     */
    s.crossVisitParticipation = new Function("v", "cn", "ex", "ct", "dl", "ev", "dv", ""
        + "var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
        + " ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
        + "ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
        + "f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
        + "v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()"
        + ";if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length;q++){z=ar"
        + "ry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\",'');arry"
        + "[q]=s.split(z,',')}}var e=new Date();e.setFullYear(e.getFullYear()+"
        + "5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[arry.len"
        + "gth-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new Date("
        + ").getTime()];var start=arry.length-ct<0?0:arry.length-ct;var td=new"
        + " Date();for(var x=start;x<arry.length;x++){var diff=Math.round((td."
        + "getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arry[x][0"
        + "]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{delim:',',"
        + "front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join(h,{deli"
        + "m:dl});if(ce)s.c_w(cn,'');return r;");
    /*
     * Plugin: getAndPersistValue 0.3 - get a value on every page
     */
    s.getAndPersistValue = new Function("v", "c", "e", ""
        + "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
        + "v)s.c_w(c,v,e?a:0);return s.c_r(c);");
    /*
     * Plugin Utility: Replace v1.0
     */
    s.repl = new Function("x", "o", "n", ""
        + "var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
        + "substring(i+o.length);i=x.indexOf(o,i+l)}return x");
    /*
     * Plugin: getPreviousValue_v1.0 - return previous value of designated
     *   variable (requires split utility)
     */
    s.getPreviousValue = new Function("v", "c", "el", ""
        + "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
        + "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
        + "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
        + ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
        + "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
    /*
     * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
     */
    s.split = new Function("l", "d", ""
        + "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
        + "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
    /*
     * Plugin: getValOnce 0.2 - get a value once per session or number of days
     */
    s.getValOnce = new Function("v", "c", "e", ""
        + "var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
        + ")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
    /*
     * Plugin: downloadLinkHandler 0.5 - identify and report download links
     */
    s.downloadLinkHandler = new Function("p", ""
        + "var s=this,h=s.p_gh(),n='linkDownloadFileTypes',i,t;if(!h||(s.linkT"
        + "ype&&(h||s.linkName)))return '';i=h.indexOf('?');t=s[n];s[n]=p?p:t;"
        + "if(s.lt(h)=='d')s.linkType='d';else h='';s[n]=t;return h;");
    /*
     * Plugin: linkHandler 0.5 - identify and report custom links
     */
    s.linkHandler = new Function("p", "t", ""
        + "var s=this,h=s.p_gh(),i,l;t=t?t:'o';if(!h||(s.linkType&&(h||s.linkN"
        + "ame)))return '';i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h."
        + "substring(0,i);l=s.pt(p,'|','p_gn',h.toLowerCase());if(l){s.linkNam"
        + "e=l=='[['?'':l;s.linkType=t;return h;}return '';");
    s.p_gn = new Function("t", "h", ""
        + "var i=t?t.indexOf('~'):-1,n,x;if(t&&h){n=i<0?'':t.substring(0,i);x="
        + "t.substring(i+1);if(h.indexOf(x.toLowerCase())>-1)return n?n:'[[';}"
        + "return 0;");
    /*
     * Utility Function: p_gh
     */
    s.p_gh = new Function(""
        + "var s=this;if(!s.eo&&!s.lnk)return '';var o=s.eo?s.eo:s.lnk,y=s.ot("
        + "o),n=s.oid(o),x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&&y!='BODY'){"
        + "o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';y=s."
        + "ot(o);n=s.oid(o);x=o.s_oidt}}return o.href?o.href:'';");
    /*
     * Plugin Utility: apl v1.1
     */
    s.apl = new Function("L", "v", "d", "u", ""
        + "var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a."
        + "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
        + "e()));}}if(!m)L=L?L+d+v:v;return L");
    /*
     * Plugin: Form Analysis 2.1 (Success, Error, Abandonment)
     */
    s.setupFormAnalysis = new Function(""
        + "var s=this;if(!s.fa){s.fa=new Object;var f=s.fa;f.ol=s.wd.onload;s."
        + "wd.onload=s.faol;f.uc=s.useCommerce;f.vu=s.varUsed;f.vl=f.uc?s.even"
        + "tList:'';f.tfl=s.trackFormList;f.fl=s.formList;f.va=new Array('',''"
        + ",'','')}");
    s.sendFormEvent = new Function("t", "pn", "fn", "en", ""
        + "var s=this,f=s.fa;t=t=='s'?t:'e';f.va[0]=pn;f.va[1]=fn;f.va[3]=t=='"
        + "s'?'Success':en;s.fasl(t);f.va[1]='';f.va[3]='';");
    s.faol = new Function("e", ""
        + "var s=s_c_il[" + s._in + "],f=s.fa,r=true,fo,fn,i,en,t,tf;if(!e)e=s.wd."
        + "event;f.os=new Array;if(f.ol)r=f.ol(e);if(s.d.forms&&s.d.forms.leng"
        + "th>0){for(i=s.d.forms.length-1;i>=0;i--){fo=s.d.forms[i];fn=fo.name"
        + ";tf=f.tfl&&s.pt(f.fl,',','ee',fn)||!f.tfl&&!s.pt(f.fl,',','ee',fn);"
        + "if(tf){f.os[fn]=fo.onsubmit;fo.onsubmit=s.faos;f.va[1]=fn;f.va[3]='"
        + "No Data Entered';for(en=0;en<fo.elements.length;en++){el=fo.element"
        + "s[en];t=el.type;if(t&&t.toUpperCase){t=t.toUpperCase();var md=el.on"
        + "mousedown,kd=el.onkeydown,omd=md?md.toString():'',okd=kd?kd.toStrin"
        + "g():'';if(omd.indexOf('.fam(')<0&&okd.indexOf('.fam(')<0){el.s_famd"
        + "=md;el.s_fakd=kd;el.onmousedown=s.fam;el.onkeydown=s.fam}}}}}f.ul=s"
        + ".wd.onunload;s.wd.onunload=s.fasl;}return r;");
    s.faos = new Function("e", ""
        + "var s=s_c_il[" + s._in + "],f=s.fa,su;if(!e)e=s.wd.event;if(f.vu){s[f.v"
        + "u]='';f.va[1]='';f.va[3]='';}su=f.os[this.name];return su?su(e):tru"
        + "e;");
    /******* s.fasl modified to not fire on "No Data Entered" *****/
    s.fasl = new Function("e", ""
        + "var s=s_c_il[" + s._in + "],f=s.fa,a=f.va,l=s.wd.location,ip=s.trackPag"
        + "eName,p=s.pageName;if(a[1]!=''&&a[3]!=''){a[0]=!p&&ip?l.host+l.path"
        + "name:a[0]?a[0]:p;if(!f.uc&&a[3]!='No Data Entered'){if(e=='e')a[2]="
        + "'Error';else if(e=='s')a[2]='Success';else a[2]='Abandon'}else a[2]"
        + "='';var tp=ip?a[0]+':':'',t3=e!='s'?':('+a[3]+')':'',ym=!f.uc&&a[3]"
        + "!='No Data Entered'?tp+a[1]+':'+a[2]+t3:tp+a[1]+t3,ltv=s.linkTrackV"
        + "ars,lte=s.linkTrackEvents,up=s.usePlugins;if(f.uc){s.linkTrackVars="
        + "ltv=='None'?f.vu+',events':ltv+',events,'+f.vu;s.linkTrackEvents=lt"
        + "e=='None'?f.vl:lte+','+f.vl;f.cnt=-1;if(e=='e')s.events=s.pt(f.vl,'"
        + ",','fage',2);else if(e=='s')s.events=s.pt(f.vl,',','fage',1);else s"
        + ".events=s.pt(f.vl,',','fage',0)}else{s.linkTrackVars=ltv=='None'?f."
        + "vu:ltv+','+f.vu}s[f.vu]=ym;s.usePlugins=false;var faLink=new Object"
        + "();faLink.href='#';if(ym.indexOf('No Data Entered')==-1){s.tl(faLink"
        + ",'o','Form Analysis');}s[f.vu]='';s.usePlugins=up}return f.ul&&e!='"
        + "e'&&e!='s'?f.ul(e):true;");
    s.fam = new Function("e", ""
        + "var s=s_c_il[" + s._in + "],f=s.fa;if(!e) e=s.wd.event;var o=s.trackLas"
        + "tChanged,et=e.type.toUpperCase(),t=this.type.toUpperCase(),fn=this."
        + "form.name,en=this.name,sc=false;if(document.layers){kp=e.which;b=e."
        + "which}else{kp=e.keyCode;b=e.button}et=et=='MOUSEDOWN'?1:et=='KEYDOW"
        + "N'?2:et;if(f.ce!=en||f.cf!=fn){if(et==1&&b!=2&&'BUTTONSUBMITRESETIM"
        + "AGERADIOCHECKBOXSELECT-ONEFILE'.indexOf(t)>-1){f.va[1]=fn;f.va[3]=e"
        + "n;sc=true}else if(et==1&&b==2&&'TEXTAREAPASSWORDFILE'.indexOf(t)>-1"
        + "){f.va[1]=fn;f.va[3]=en;sc=true}else if(et==2&&kp!=9&&kp!=13){f.va["
        + "1]=fn;f.va[3]=en;sc=true}if(sc){nface=en;nfacf=fn}}if(et==1&&this.s"
        + "_famd)return this.s_famd(e);if(et==2&&this.s_fakd)return this.s_fak"
        + "d(e);");
    s.ee = new Function("e", "n", ""
        + "return n&&n.toLowerCase?e.toLowerCase()==n.toLowerCase():false;");
    s.fage = new Function("e", "a", ""
        + "var s=this,f=s.fa,x=f.cnt;x=x?x+1:1;f.cnt=x;return x==a?e:'';");

    /*
     * Utility clearVars v0.1 - clear variable values (requires split 1.5)
     */
    s.clearVars = new Function("l", "f", ""
        + "var s=this,vl,la,vla;l=l?l:'';f=f?f:'';vl='pageName,purchaseID,chan"
        + "nel,server,pageType,campaign,state,zip,events,products';for(var n=1"
        + ";n<51;n++)vl+=',prop'+n+',eVar'+n+',hier'+n;if(l&&(f==1||f==2)){if("
        + "f==1){vl=l}if(f==2){la=s.split(l,',');vla=s.split(vl,',');vl='';for"
        + "(x in la){for(y in vla){if(la[x]==vla[y]){vla[y]=''}}}for(y in vla)"
        + "{vl+=vla[y]?','+vla[y]:'';}}s.pt(vl,',','p_clr',0);return true}else"
        + " if(l==''&&f==''){s.pt(vl,',','p_clr',0);return true}else{return fa"
        + "lse}");
    s.p_clr = new Function("t", "var s=this;s[t]=''");


    /*
     * Plugin: setupLinkTrack 2.0 - return links for HBX-based link
     *         tracking in SiteCatalyst (requires s.split and s.apl)
     */
    s.setupLinkTrack = new Function("vl", "c", ""
        + "var s=this;var l=s.d.links,cv,cva,vla,h,i,l,t,b,o,y,n,oc,d='';cv=s."
        + "c_r(c);if(vl&&cv!=''){cva=s.split(cv,'^^');vla=s.split(vl,',');for("
        + "x in vla)s._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}s.c_w(c,'',0);if(!s.e"
        + "o&&!s.lnk)return '';o=s.eo?s.eo:s.lnk;y=s.ot(o);n=s.oid(o);if(s.eo&"
        + "&o==s.eo){while(o&&!n&&y!='BODY'){o=o.parentElement?o.parentElement"
        + ":o.parentNode;if(!o)return '';y=s.ot(o);n=s.oid(o);}for(i=0;i<4;i++"
        + ")var ltp=setTimeout(function(){},10);if(o.tagName)if(o.tagName.toLowerCase()!='a')if(o.tagName.toLowerC"
        + "ase()!='area')o=o.parentElement;}b=s._LN(o);o.lid=b[0];o.lpos=b[1];"
        + "if(s.hbx_lt&&s.hbx_lt!='manual'){if((o.tagName&&s._TL(o.tagName)=='"
        + "area')){if(!s._IL(o.lid)){if(o.parentNode){if(o.parentNode.name)o.l"
        + "id=o.parentNode.name;else o.lid=o.parentNode.id}}if(!s._IL(o.lpos))"
        + "o.lpos=o.coords}else{if(s._IL(o.lid)<1)o.lid=s._LS(o.lid=o.text?o.t"
        + "ext:o.innerText?o.innerText:'');if(!s._IL(o.lid)||s._II(s._TL(o.lid"
        + "),'<img')>-1){h=''+o.innerHTML;bu=s._TL(h);i=s._II(bu,'<img');if(bu"
        + "&&i>-1){eval(\"__f=/ src\s*=\s*[\'\\\"]?([^\'\\\" ]+)[\'\\\"]?/i\")"
        + ";__f.exec(h);if(RegExp.$1)h=RegExp.$1}o.lid=h}}}h=o.href?o.href:'';"
        + "i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l"
        + "=s.linkName?s.linkName:s._hbxln(h);t=s.linkType?s.linkType.toLowerC"
        + "ase():s.lt(h);oc=o.onclick?''+o.onclick:'';cv=s.pageName+'^^'+o.lid"
        + "+'^^'+s.pageName+' | '+(o.lid=o.lid?o.lid:'no &lid')+'^^'+o.lpos;if"
        + "(t&&(h||l)){cva=s.split(cv,'^^');vla=s.split(vl,',');for(x in vla)s"
        + "._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}else if(!t&&oc.indexOf('.tl(')<"
        + "0){s.c_w(c,cv,0);}else return ''");
    s._IL = new Function("a", "var s=this;return a!='undefined'?a.length:0");
    s._II = new Function("a", "b", "c", "var s=this;return a.indexOf(b,c?c:0)"
    );
    s._IS = new Function("a", "b", "c", ""
        + "var s=this;return b>s._IL(a)?'':a.substring(b,c!=null?c:s._IL(a))");
    s._LN = new Function("a", "b", "c", "d", ""
        + "var s=this;b=a.href;b+=a.name?a.name:'';c=s._LVP(b,'lid');d=s._LVP("
        + "b,'lpos');r"
        + "eturn[c,d]");
    s._LVP = new Function("a", "b", "c", "d", "e", ""
        + "var s=this;c=s._II(a,'&'+b+'=');c=c<0?s._II(a,'?'+b+'='):c;if(c>-1)"
        + "{d=s._II(a,'&',c+s._IL(b)+2);e=s._IS(a,c+s._IL(b)+2,d>-1?d:s._IL(a)"
        + ");return e}return ''");
    s._LS = new Function("a", ""
        + "var s=this,b,c=100,d,e,f,g;b=(s._IL(a)>c)?escape(s._IS(a,0,c)):esca"
        + "pe(a);b=s._LSP(b,'%0A','%20');b=s._LSP(b,'%0D','%20');b=s._LSP(b,'%"
        + "09','%20');c=s._IP(b,'%20');d=s._NA();e=0;for(f=0;f<s._IL(c);f++){g"
        + "=s._RP(c[f],'%20','');if(s._IL(g)>0){d[e++]=g}}b=d.join('%20');retu"
        + "rn unescape(b)");
    s._LSP = new Function("a", "b", "c", "d", "var s=this;d=s._IP(a,b);return d"
        + ".join(c)");
    s._IP = new Function("a", "b", "var s=this;return a.split(b)");
    s._RP = new Function("a", "b", "c", "d", ""
        + "var s=this;d=s._II(a,b);if(d>-1){a=s._RP(s._IS(a,0,d)+','+s._IS(a,d"
        + "+s._IL(b),s._IL(a)),b,c)}return a");
    s._TL = new Function("a", "var s=this;return a.toLowerCase()");
    s._NA = new Function("a", "var s=this;return new Array(a?a:0)");
    s._hbxm = new Function("m", "var s=this;return (''+m).indexOf('{')<0");
    s._hbxln = new Function("h", "var s=this,n=s.linkNames;if(n)return s.pt("
        + "n,',','lnf',h);return ''");
    /*
     * Plugin: getPercentPageViewed v1.71
     */
    s.getPercentPageViewed = new Function("n", ""
        + "var s=this,W=window,EL=W.addEventListener,AE=W.attachEvent,E=['load"
        + "','unload','scroll','resize','zoom','keyup','mouseup','touchend','o"
        + "rientationchange','pan'];W.s_Obj=s;s_PPVid=(n=='-'?s.pageName:n)||s"
        + ".pageName||location.href;if(!W.s_PPVevent){s.s_PPVg=function(n,r){v"
        + "ar k='s_ppv',p=k+'l',c=s.c_r(n||r?k:p),a=c.indexOf(',')>-1?c.split("
        + "',',10):[''],l=a.length,i;a[0]=unescape(a[0]);r=r||(n&&n!=a[0])||0;"
        + "a.length=10;if(typeof a[0]!='string')a[0]='';for(i=1;i<10;i++)a[i]="
        + "!r&&i<l?parseInt(a[i])||0:0;if(l<10||typeof a[9]!='string')a[9]='';"
        + "if(r){s.c_w(p,c);s.c_w(k,'?')}return a};W.s_PPVevent=function(e){va"
        + "r W=window,D=document,B=D.body,E=D.documentElement,S=window.screen|"
        + "|0,Ho='offsetHeight',Hs='scrollHeight',Ts='scrollTop',Wc='clientWid"
        + "th',Hc='clientHeight',C=100,M=Math,J='object',N='number',s=W.s_Obj|"
        + "|W.s||0;e=e&&typeof e==J?e.type||'':'';if(!e.indexOf('on'))e=e.subs"
        + "tring(2);s_PPVi=W.s_PPVi||0;if(W.s_PPVt&&!e){clearTimeout(s_PPVt);s"
        + "_PPVt=0;if(s_PPVi<2)s_PPVi++}if(typeof s==J){var h=M.max(B[Hs]||E[H"
        + "s],B[Ho]||E[Ho],B[Hc]||E[Hc]),X=W.innerWidth||E[Wc]||B[Wc]||0,Y=W.i"
        + "nnerHeight||E[Hc]||B[Hc]||0,x=S?S.width:0,y=S?S.height:0,r=M.round("
        + "C*(W.devicePixelRatio||1))/C,b=(D.pageYOffset||E[Ts]||B[Ts]||0)+Y,p"
        + "=h>0&&b>0?M.round(C*b/h):0,O=W.orientation,o=!isNaN(O)?M.abs(o)%180"
        + ":Y>X?0:90,L=e=='load'||s_PPVi<1,a=s.s_PPVg(s_PPVid,L),V=function(i,"
        + "v,f,n){i=parseInt(typeof a==J&&a.length>i?a[i]:'0')||0;v=typeof v!="
        + "N?i:v;v=f||v>i?v:i;return n?v:v>C?C:v<0?0:v};if(new RegExp('(iPod|i"
        + "Pad|iPhone)').exec(navigator.userAgent||'')&&o){o=x;x=y;y=o}o=o?'P'"
        + ":'L';a[9]=L?'':a[9].substring(0,1);s.c_w('s_ppv',escape(W.s_PPVid)+"
        + "','+V(1,p,L)+','+(L||!V(2)?p:V(2))+','+V(3,b,L,1)+','+X+','+Y+','+x"
        + "+','+y+','+r+','+a[9]+(a[9]==o?'':o))}if(!W.s_PPVt&&e!='unload')W.s"
        + "_PPVt=setTimeout(W.s_PPVevent,333)};for(var f=W.s_PPVevent,i=0;i<E."
        + "length;i++)if(EL)EL(E[i],f,false);else if(AE)AE('on'+E[i],f);f()};v"
        + "ar a=s.s_PPVg();return!n||n=='-'?a[1]:a");
    /*
     /*
     * s.join: 1.0 - Joins an array into a string
     */
    s.join = new Function("v", "p", ""
        + "var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
        + ":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
        + ";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
        + "se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
    /*
     * Function - read combined cookies v 0.3
     */
    if (!s.__ccucr) {
        s.c_rr = s.c_r;
        s.__ccucr = true;
        s.c_r = new Function("k", ""
            + "var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret"
            + "urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i="
            + "c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'"
            + ",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:"
            + "m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get"
            + "Time()){d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}ret"
            + "urn v;");
    }
    /*
     * Function - write combined cookies v 0.3
     */
    if (!s.__ccucw) {
        s.c_wr = s.c_w;
        s.__ccucw = true;
        s.c_w = new Function("k", "v", "e", ""
            + "this.new2 = true;"
            + "var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,"
            + "c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s"
            + ".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr"
            + "ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv"
            + ".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i"
            + "ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())"
            + "{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'"
            + "='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t"
            + ".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i"
            + "ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set"
            + "Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");
    }

    /* Media Module
     s.loadModule("Media")
     s.Media.autoTrack=false
     s.Media.trackVars="None"
     s.Media.trackEvents="None"
     */

//EY Code Change
    /*********Media Module Calls**************/

    if (s.enableVideoTracking) {

        s.loadModule("Media")
        s.Media.autoTrack = false;
        s.Media.trackWhilePlaying = true;
        s.Media.trackVars = "events,eVar51,eVar52,eVar53,eVar54,eVar55,prop51,prop52,prop53,prop54";
        s.Media.trackEvents = "event51,event52,event53,event54,event55,event56,event57";
        s.Media.trackMilestones = "25,50,75";
        s.Media.segmentByMilestones = true;
        s.Media.trackUsingContextData = true;
        s.Media.contextDataMapping = {
            "a.media.name": "eVar51,prop51",
            "a.media.segment": "eVar52",
            "a.media.timePlayed": "event52",
            "a.media.view": "event51",
            "a.media.segmentView": "event53",
            "a.media.complete": "event54",
            "a.media.milestones": {
                25: "event55",
                50: "event56",
                75: "event57"
            }
        };
    }
    ;

    /********* Adds Additional Variables to Omniture Media Calls **************/
    s.Media.monitor = function (s, media) {
        function sendRequest() {
            s.Media.track(media.name);
        }

        if (media.event == "OPEN") {
            window.omnVidPlaying = true;
            s.prop52 = location.href;
            s.prop53 = s.eVar53 = s.pageName;
            s.prop54 = s.eVar54 = s.eVar16;
            sendRequest();
        }

        if (media.event == "MILESTONE") {
            window.omnVidPlaying = true;
            s.prop52 = location.href;
            s.eVar53 = s.pageName;
            s.eVar54 = s.eVar16;
            sendRequest();
        }

        if (media.event == "CLOSE" && window.omnVidPlaying) {
            //if(media.event == "CLOSE" && window.omnVidPlaying) == true
            window.omnVidPlaying = false;
            //console.log("media close");
            s.prop52 = location.href;
            s.eVar53 = s.pageName;
            s.eVar54 = s.eVar16;
            sendRequest();
        }
    };


// Optimizely Adobe Analytics SiteCatalyst Integration
    window.optimizely = window.optimizely || [];
    window.optimizely.push("activateSiteCatalyst");

    /* WARNING: Changing any of the below variables will cause drastic
     changes to how your visitor data is collected.  Changes should only be
     made when instructed to do so by your account manager.*/
    s.visitorNamespace = "consumersunion"
    s.trackingServer = "metrics.consumerreports.org"
    s.trackingServerSecure = "smetrics.consumerreports.org"
    s.dc = 122

    /****************************** MODULES *****************************/
//EY Code Change - Deleted old Media Module and added new media module
    /* Module: Media */
    s.m_Media_c = "var m=s.m_i('Media');if(m.completeByCloseOffset==undefined)m.completeByCloseOffset=1;if(m.completeCloseOffsetThreshold==undefined)m.completeCloseOffsetThreshold=1;m.cn=function(n){var m="
        + "this;return m.s.rep(m.s.rep(m.s.rep(n,\"\\n\",''),\"\\r\",''),'--**--','')};m.open=function(n,l,p,b){var m=this,i=new Object,tm=new Date,a='',x;n=m.cn(n);if(!l)l=-1;if(n&&p){if(!m.l)m.l=new Object;"
        + "if(m.l[n])m.close(n);if(b&&b.id)a=b.id;if(a)for (x in m.l)if(m.l[x]&&m.l[x].a==a)m.close(m.l[x].n);i.n=n;i.l=l;i.o=0;i.x=0;i.p=m.cn(m.playerName?m.playerName:p);i.a=a;i.t=0;i.ts=0;i.s=Math.floor(tm"
        + ".getTime()/1000);i.lx=0;i.lt=i.s;i.lo=0;i.e='';i.to=-1;i.tc=0;i.fel=new Object;i.vt=0;i.sn=0;i.sx=\"\";i.sl=0;i.sg=0;i.sc=0;i.us=0;i.co=0;i.cot=0;i.lm=0;i.lom=0;m.l[n]=i}};m._delete=function(n){var"
        + " m=this,i;n=m.cn(n);i=m.l[n];m.l[n]=0;if(i&&i.m)clearTimeout(i.m.i)};m.close=function(n){this.e(n,0,-1)};m.play=function(n,o,sn,sx,sl){var m=this,i;i=m.e(n,1,o,sn,sx,sl);if(i&&!i.m){i.m=new Object;"
        + "i.m.m=new Function('var m=s_c_il['+m._in+'],i;if(m.l){i=m.l[\"'+m.s.rep(i.n,'\"','\\\\\"')+'\"];if(i){if(i.lx==1)m.e(i.n,3,-1);i.m.i=setTimeout(i.m.m,1000)}}');i.m.m()}};m.complete=function(n,o){th"
        + "is.e(n,5,o)};m.stop=function(n,o){this.e(n,2,o)};m.track=function(n){this.e(n,4,-1)};m.bcd=function(vo,i){var m=this,ns='a.media.',v=vo.linkTrackVars,e=vo.linkTrackEvents,pe='m_i',pev3,c=vo.context"
        + "Data,x;c['a.contentType']='video';c[ns+'name']=i.n;c[ns+'playerName']=i.p;if(i.l>0){c[ns+'length']=i.l;}c[ns+'timePlayed']=Math.floor(i.ts);if(!i.vt){c[ns+'view']=true;pe='m_s';i.vt=1}if(i.sx){c[ns"
        + "+'segmentNum']=i.sn;c[ns+'segment']=i.sx;if(i.sl>0)c[ns+'segmentLength']=i.sl;if(i.sc&&i.ts>0)c[ns+'segmentView']=true}if(!i.cot&&i.co){c[ns+\"complete\"]=true;i.cot=1}if(i.lm>0)c[ns+'milestone']=i"
        + ".lm;if(i.lom>0)c[ns+'offsetMilestone']=i.lom;if(v)for(x in c)v+=',contextData.'+x;pev3='video';vo.pe=pe;vo.pev3=pev3;var d=m.contextDataMapping,y,a,l,n;if(d){vo.events2='';if(v)v+=',events';for(x i"
        + "n d){if(x.substring(0,ns.length)==ns)y=x.substring(ns.length);else y=\"\";a=d[x];if(typeof(a)=='string'){l=m.s.sp(a,',');for(n=0;n<l.length;n++){a=l[n];if(x==\"a.contentType\"){if(v)v+=','+a;vo[a]="
        + "c[x]}else if(y){if(y=='view'||y=='segmentView'||y=='complete'||y=='timePlayed'){if(e)e+=','+a;if(c[x]){if(y=='timePlayed'){if(c[x])vo.events2+=(vo.events2?',':'')+a+'='+c[x];}else if(c[x])vo.events"
        + "2+=(vo.events2?',':'')+a}}else if(y=='segment'&&c[x+'Num']){if(v)v+=','+a;vo[a]=c[x+'Num']+':'+c[x]}else{if(v)v+=','+a;vo[a]=c[x]}}}}else if(y=='milestones'||y=='offsetMilestones'){x=x.substring(0,"
        + "x.length-1);if(c[x]&&d[x+'s'][c[x]]){if(e)e+=','+d[x+'s'][c[x]];vo.events2+=(vo.events2?',':'')+d[x+'s'][c[x]]}}}vo.contextData=0}vo.linkTrackVars=v;vo.linkTrackEvents=e};m.bpe=function(vo,i,x,o){v"
        + "ar m=this,pe='m_o',pev3,d='--**--';pe='m_o';if(!i.vt){pe='m_s';i.vt=1}else if(x==4)pe='m_i';pev3=m.s.ape(i.n)+d+Math.floor(i.l>0?i.l:1)+d+m.s.ape(i.p)+d+Math.floor(i.t)+d+i.s+d+(i.to>=0?'L'+Math.fl"
        + "oor(i.to):'')+i.e+(x!=0&&x!=2?'L'+Math.floor(o):'');vo.pe=pe;vo.pev3=pev3};m.e=function(n,x,o,sn,sx,sl,pd){var m=this,i,tm=new Date,ts=Math.floor(tm.getTime()/1000),c,l,v=m.trackVars,e=m.trackEvent"
        + "s,ti=m.trackSeconds,tp=m.trackMilestones,to=m.trackOffsetMilestones,sm=m.segmentByMilestones,so=m.segmentByOffsetMilestones,z=new Array,j,t=1,w=new Object,x,ek,tc,vo=new Object;n=m.cn(n);i=n&&m.l&&"
        + "m.l[n]?m.l[n]:0;if(i){if(o<0){if(i.lx==1&&i.lt>0)o=(ts-i.lt)+i.lo;else o=i.lo}if(i.l>0)o=o<i.l?o:i.l;if(o<0)o=0;i.o=o;if(i.l>0){i.x=(i.o/i.l)*100;i.x=i.x>100?100:i.x}if(i.lo<0)i.lo=o;tc=i.tc;w.name"
        + "=n;w.length=i.l;w.openTime=new Date;w.openTime.setTime(i.s*1000);w.offset=i.o;w.percent=i.x;w.playerName=i.p;if(i.to<0)w.mediaEvent=w.event='OPEN';else w.mediaEvent=w.event=(x==1?'PLAY':(x==2?'STOP"
        + "':(x==3?'MONITOR':(x==4?'TRACK':(x==5?'COMPLETE':('CLOSE'))))));if(!pd){if(i.pd)pd=i.pd}else i.pd=pd;w.player=pd;if(x>2||(x!=i.lx&&(x!=2||i.lx==1))) {if(!sx){sn=i.sn;sx=i.sx;sl=i.sl}if(x){if(x==1)i"
        + ".lo=o;if((x<=3||x==5)&&i.to>=0){t=0;v=e=\"None\";if(i.to!=o){l=i.to;if(l>o){l=i.lo;if(l>o)l=o}z=tp?m.s.sp(tp,','):0;if(i.l>0&&z&&o>=l)for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c&&(l/i"
        + ".l)*100<c&&i.x>=c){t=1;j=z.length;w.mediaEvent=w.event='MILESTONE';i.lm=w.milestone=c}}z=to?m.s.sp(to,','):0;if(z&&o>=l)for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if(c&&l<c&&o>=c){t=1;j=z"
        + ".length;w.mediaEvent=w.event='OFFSET_MILESTONE';i.lom=w.offsetMilestone=c}}}}if(i.sg||!sx){if(sm&&tp&&i.l>0){z=m.s.sp(tp,',');if(z){z[z.length]='100';l=0;for(j=0;j<z.length;j++){c=z[j]?parseFloat('"
        + "'+z[j]):0;if(c){if(i.x<c){sn=j+1;sx='M:'+l+'-'+c;j=z.length}l=c}}}}else if(so&&to){z=m.s.sp(to,',');if(z){z[z.length]=''+(i.l>0?i.l:'E');l=0;for(j=0;j<z.length;j++){c=z[j]?parseFloat(''+z[j]):0;if("
        + "c||z[j]=='E'){if(o<c||z[j]=='E'){sn=j+1;sx='O:'+l+'-'+c;j=z.length}l=c}}}}if(sx)i.sg=1}if((sx||i.sx)&&sx!=i.sx){i.us=1;if(!i.sx){i.sn=sn;i.sx=sx}if(i.to>=0)t=1}if(x>=2&&i.lo<o){i.t+=o-i.lo;i.ts+=o-"
        + "i.lo}if(x<=2||(x==3&&!i.lx)){i.e+=(x==1||x==3?'S':'E')+Math.floor(o);i.lx=(x==3?1:x)}if(!t&&i.to>=0&&x<=3){ti=ti?ti:0;if(ti&&i.ts>=ti){t=1;w.mediaEvent=w.event='SECONDS'}}i.lt=ts;i.lo=o}if(!x||i.x>"
        + "=100){x=0;m.e(n,2,-1,0,0,-1,pd);v=e=\"None\";w.mediaEvent=w.event=\"CLOSE\"}if(x==5||(m.completeByCloseOffset&&(!x||i.x>=100)&&i.l>0&&o>=i.l-m.completeCloseOffsetThreshold)){w.complete=i.co=1;t=1}e"
        + "k=w.mediaEvent;if(ek=='MILESTONE')ek+='_'+w.milestone;else if(ek=='OFFSET_MILESTONE')ek+='_'+w.offsetMilestone;if(!i.fel[ek]) {w.eventFirstTime=true;i.fel[ek]=1}else w.eventFirstTime=false;w.timePl"
        + "ayed=i.t;w.segmentNum=i.sn;w.segment=i.sx;w.segmentLength=i.sl;if(m.monitor&&x!=4)m.monitor(m.s,w);if(x==0)m._delete(n);if(t&&i.tc==tc){vo=new Object;vo.contextData=new Object;vo.linkTrackVars=v;vo"
        + ".linkTrackEvents=e;if(!vo.linkTrackVars)vo.linkTrackVars='';if(!vo.linkTrackEvents)vo.linkTrackEvents='';if(m.trackUsingContextData)m.bcd(vo,i);else m.bpe(vo,i,x,o);m.s.t(vo);if(i.us){i.sn=sn;i.sx="
        + "sx;i.sc=1;i.us=0}else if(i.ts>0)i.sc=0;i.e=\"\";i.lm=i.lom=0;i.ts-=Math.floor(i.ts);i.to=o;i.tc++}}}return i};m.ae=function(n,l,p,x,o,sn,sx,sl,pd,b){var m=this,r=0;if(n&&(!m.autoTrackMediaLengthReq"
        + "uired||(length&&length>0)) &&p){if(!m.l||!m.l[n]){if(x==1||x==3){m.open(n,l,p,b);r=1}}else r=1;if(r)m.e(n,x,o,sn,sx,sl,pd)}};m.a=function(o,t){var m=this,i=o.id?o.id:o.name,n=o.name,p=0,v,c,c1,c2,x"
        + "c=m.s.h,x,e,f1,f2='s_media_'+m._in+'_oc',f3='s_media_'+m._in+'_t',f4='s_media_'+m._in+'_s',f5='s_media_'+m._in+'_l',f6='s_media_'+m._in+'_m',f7='s_media_'+m._in+'_c',tcf,w;if(!i){if(!m.c)m.c=0;i='s"
        + "_media_'+m._in+'_'+m.c;m.c++}if(!o.id)o.id=i;if(!o.name)o.name=n=i;if(!m.ol)m.ol=new Object;if(m.ol[i])return;m.ol[i]=o;if(!xc)xc=m.s.b;tcf=new Function('o','var e,p=0;try{if(o.versionInfo&&o.curre"
        + "ntMedia&&o.controls)p=1}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o','var e,p=0,t;try{t=o.GetQuickTimeVersion();if(t)p=2}catch(e){p=0}return p');p=tcf(o);if(!p){tcf=new Function('o'"
        + ",'var e,p=0,t;try{t=o.GetVersionInfo();if(t)p=3}catch(e){p=0}return p');p=tcf(o)}}v=\"var m=s_c_il[\"+m._in+\"],o=m.ol['\"+i+\"']\";if(p==1){p='Windows Media Player '+o.versionInfo;c1=v+',n,p,l,x=-"
        + "1,cm,c,mn;if(o){cm=o.currentMedia;c=o.controls;if(cm&&c){mn=cm.name?cm.name:c.URL;l=cm.duration;p=c.currentPosition;n=o.playState;if(n){if(n==8)x=0;if(n==3)x=1;if(n==1||n==2||n==4||n==5||n==6)x=2;}"
        + "';c2='if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,0,\"\",0,0,o)}}';c=c1+c2;if(m.s.isie&&xc){x=m.s.d.createElement('script');x.language='jscript';x.type='text/javascript';x.htmlFor=i;x.event='PlayStateC"
        + "hange(NewState)';x.defer=true;x.text=c;xc.appendChild(x);o[f6]=new Function(c1+'if(n==3){x=3;'+c2+'}setTimeout(o.'+f6+',5000)');o[f6]()}}if(p==2){p='QuickTime Player '+(o.GetIsQuickTimeRegistered()"
        + "?'Pro ':'')+o.GetQuickTimeVersion();f1=f2;c=v+',n,x,t,l,p,p2,mn;if(o){mn=o.GetMovieName()?o.GetMovieName():o.GetURL();n=o.GetRate();t=o.GetTimeScale();l=o.GetDuration()/t;p=o.GetTime()/t;p2=o.'+f5+"
        + "';if(n!=o.'+f4+'||p<p2||p-p2>5){x=2;if(n!=0)x=1;else if(p>=l)x=0;if(p<p2||p-p2>5)m.ae(mn,l,\"'+p+'\",2,p2,0,\"\",0,0,o);m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,0,\"\",0,0,o)}if(n>0&&o.'+f7+'>=10){m.ae(mn,l"
        + ",\"'+p+'\",3,p,0,\"\",0,0,o);o.'+f7+'=0}o.'+f7+'++;o.'+f4+'=n;o.'+f5+'=p;setTimeout(\"'+v+';o.'+f2+'(0,0)\",500)}';o[f1]=new Function('a','b',c);o[f4]=-1;o[f7]=0;o[f1](0,0)}if(p==3){p='RealPlayer '"
        + "+o.GetVersionInfo();f1=n+'_OnPlayStateChange';c1=v+',n,x=-1,l,p,mn;if(o){mn=o.GetTitle()?o.GetTitle():o.GetSource();n=o.GetPlayState();l=o.GetLength()/1000;p=o.GetPosition()/1000;if(n!=o.'+f4+'){if"
        + "(n==3)x=1;if(n==0||n==2||n==4||n==5)x=2;if(n==0&&(p>=l||p==0))x=0;if(x>=0)m.ae(mn,l,\"'+p+'\",x,x!=2?p:-1,0,\"\",0,0,o)}if(n==3&&(o.'+f7+'>=10||!o.'+f3+')){m.ae(mn,l,\"'+p+'\",3,p,0,\"\",0,0,o);o.'"
        + "+f7+'=0}o.'+f7+'++;o.'+f4+'=n;';c2='if(o.'+f2+')o.'+f2+'(o,n)}';if(m.s.wd[f1])o[f2]=m.s.wd[f1];m.s.wd[f1]=new Function('a','b',c1+c2);o[f1]=new Function('a','b',c1+'setTimeout(\"'+v+';o.'+f1+'(0,0)"
        + "\",o.'+f3+'?500:5000);'+c2);o[f4]=-1;if(m.s.isie)o[f3]=1;o[f7]=0;o[f1](0,0)}};m.as=new Function('e','var m=s_c_il['+m._in+'],l,n;if(m.autoTrack&&m.s.d.getElementsByTagName){l=m.s.d.getElementsByTag"
        + "Name(m.s.isie?\"OBJECT\":\"EMBED\");if(l)for(n=0;n<l.length;n++)m.a(l[n]);}');if(s.wd.attachEvent)s.wd.attachEvent('onload',m.as);else if(s.wd.addEventListener)s.wd.addEventListener('load',m.as,fal"
        + "se);if(m.onLoad)m.onLoad(s,m)";
    s.m_i("Media");


    if (typeof window.initSScode !== 'undefined') {
        window.initSScode.resolve();
    }

}

    /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
    var s_code = '', s_objectID;

window.s_gi = function (un, pg, ss) {
    var c = "s.version='H.25.1';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\"
            + "\\\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}retur"
            + "n y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;ret"
            + "urn 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent("
            + "x);for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.su"
            + "bstring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+"
            + "','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00"
            + "'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this;if(x){x=s.rep(''+x,'+',' ');return s.em==3?decodeURIComponent(x):unescape(x)}return x};s.pt=function(x,d,f,a){var s=this"
            + ",t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.i"
            + "ndexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf"
            + "',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVi"
            + "sibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visibilitychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s"
            + "._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){while(s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s"
            + ".mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)"
            + "!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,"
            + "a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n"
            + ":2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d"
            + ".cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifeti"
            + "me,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?"
            + "v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!"
            + "s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;ret"
            + "urn b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}"
            + "else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e'"
            + ",'var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.lo"
            + "cation;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtf"
            + "set',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=func"
            + "tion(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un"
            + "),im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'."
            + "'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.version+(s.tcn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.im"
            + "ages&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_"
            + "il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,"
            + "'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_"
            + "c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTr"
            + "ackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr()}',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=="
            + "'_top'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=functi"
            + "on(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;i"
            + "f(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x;i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0"
            + ";if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h.substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie"
            + ",start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length>1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring"
            + "(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.length-c.length)-y.length;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s"
            + "=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk in v)if((!f||sk.substring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Obj"
            + "ect||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nfl[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.s"
            + "ubstring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!nfl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='bo"
            + "olean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.contextData.')<0){sp=sk.substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='chann"
            + "el')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}"
            + "}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var s=this,qs='',l,fv='',fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s."
            + "vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvent"
            + "s}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring("
            + "4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!='linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if"
            + "(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationSer"
            + "ver'){q='vmf';if(s.ssl&&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase"
            + "()=='AUTO')v='ISO8859-1';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProv"
            + "ider')q='vvp';else if(k=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='"
            + "c';else if(k=='javascriptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionTyp"
            + "e')q='ct';else if(k=='homepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k]"
            + ",fv,k,0);v=''}else if(k=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='"
            + "retrieveLightProfiles')q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop'"
            + ")q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h"
            + "){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLow"
            + "erCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s"
            + ".wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&("
            + "!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;if(b)return this[b](e);return true');s.bcr=func"
            + "tion(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.bct.href}s.bct=s.bce=s.bcf=0};s.bc=new Function("
            + "'e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else if(!s.useForcedLinkTracking){s.b.removeEventListener(\""
            + "click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e.target;s.t();s.eo=0;if(s.nrs>0&&s.useForcedLinkTracking"
            + "&&e.target){t=e.target.target;if(e.target.dispatchEvent&&(!t||t==\\'_self\\'||t==\\'_top\\'||(s.wd.name&&t==s.wd.name))){e.stopPropagation();e.stopImmediatePropagation();e.preventDefault();n=s.d.cr"
            + "eateEvent(\"MouseEvents\");n.initMouseEvent(\"click\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget"
            + ");n.s_fe=1;s.bct=e.target;s.bce=n;}}');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k)"
            + ")){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substri"
            + "ng(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.scopeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';i"
            + "f(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.prot"
            + "ocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x="
            + "2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_o"
            + "idt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.in"
            + "dexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,',','rq'"
            + ",0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[un]=q;re"
            + "turn 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Object.pr"
            + "ototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='"
            + "+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o.onclic"
            + "k?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie||!s.ism"
            + "ac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener){if(s.n&&s.n.userAgent.indexOf('WebKit')>=0&&s.d.createEvent){s.bbc=1;s.useForcedLinkTrackin"
            + "g=1;s.b.addEventListener('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s"
            + "_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m)"
            + "{if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}retu"
            + "rn 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m"
            + ";l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){var s=this;if(s.un&&s.mpc('sa',arguments))return;s"
            + ".un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl"
            + "=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e'"
            + ",'_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m["
            + "l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))r"
            + "eturn;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).ind"
            + "exOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s."
            + "m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).i"
            + "ndexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.l"
            + "oadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}"
            + "else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._i"
            + "n+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250"
            + ";if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/"
            + "javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,"
            + "u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){v"
            + "ar s=this,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=fu"
            + "nction(vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;"
            + "i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s."
            + "dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.track=s.t="
            + "function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate("
            + ")+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Objec"
            + "t;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(St"
            + "ring&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf="
            + "new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEn"
            + "abled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){b"
            + "w=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":"
            + "\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)whil"
            + "e(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.brow"
            + "serHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.vob(vb);s.voa(vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.wd.location,r=tfs.document.referrer;"
            + "if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oid"
            + "t,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';i"
            + "f((oc.indexOf('s_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.li"
            + "nkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.o"
            + "t(o);i=o.sourceIndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-object-id')){s.wd.s_objectID=o.getAttribute('data-s-objec"
            + "t-id');}else if(s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\""
            + ").indexOf(oc.charAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt(oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")o"
            + "cx=!ocx;else ocx=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s"
            + ")}}}}}if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else t"
            + "rk=0}if(trk||qs){s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retri"
            + "eveLightProfiles=s.deleteLightProfiles=''}s.sq(qs)}}else s.dl(vo);if(vo)s.voa(vb,1);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo="
            + "s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType=t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss,i,vo){va"
            + "r s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l[i];if(t&&"
            + "t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.ml)for(x i"
            + "n t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];if(s[x.m])"
            + "{y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.location.pr"
            + "otocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.ind"
            + "exOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns="
            + "(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat("
            + "i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase()"
            + ";s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,admsVisitorID,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigration"
            + "ServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightPro"
            + "files,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSe"
            + "conds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl"
            + "_t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDep"
            + "th,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecu"
            + "re,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,tra"
            + "ckExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_referrer,un';s.v"
            + "a_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1).t()};s.wd"
            + ".s_dc=function(un){s_gi(un,1).t()}}",
        w = window, l = w.s_c_il, n = navigator, u = n.userAgent, v = n.appVersion, e = v.indexOf('MSIE '), m = u.indexOf('Netscape6/'), a, i, j, x, s;
    if (un) {
        un = un.toLowerCase();
        if (l)for (j = 0; j < 2; j++)for (i = 0; i < l.length; i++) {
            s = l[i];
            x = s._c;
            if ((!x || x == 's_c' || (j > 0 && x == 's_l')) && (s.oun == un || (s.fs && s.sa && s.fs(s.oun, un)))) {
                if (s.sa)s.sa(un);
                if (x == 's_c')return s
            } else s = 0
        }
    }
    w.s_an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    w.s_sp = new Function("x", "d", "var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
        + "ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
    w.s_jn = new Function("a", "d", "var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
    w.s_rep = new Function("x", "o", "n", "return s_jn(s_sp(x,o),n)");
    w.s_d = new Function("x", "var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
        + "=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
        + "x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
    w.s_fe = new Function("c", "return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
    w.s_fa = new Function("f", "var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
        + "a");
    w.s_ft = new Function("c", "c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
        + "f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
        + "'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
    c = s_d(c);
    if (e > 0) {
        a = parseInt(i = v.substring(e + 5));
        if (a > 3)a = parseFloat(i)
    } else if (m > 0)a = parseFloat(u.substring(m + 10)); else a = parseFloat(v);
    if (a < 5 || v.indexOf('Opera') >= 0 || u.indexOf('Opera') >= 0)c = s_ft(c);
    if (!s) {
        s = new Object;
        if (!w.s_c_in) {
            w.s_c_il = new Array;
            w.s_c_in = 0
        }
        s._il = w.s_c_il;
        s._in = w.s_c_in;
        s._il[s._in] = s;
        w.s_c_in++;
    }
    s._c = 's_c';
    (new Function("s", "un", "pg", "ss", c))(s, un, pg, ss);
    return s
};

function s_giqf() {
    var w = window, q = w.s_giq, i, t, s;
    if (q)for (i = 0; i < q.length; i++) {
        t = q[i];
        s = s_gi(t.oun);
        s.sa(t.un);
        s.setTagContainer(t.tagContainerName)
    }
    w.s_giq = 0
}

s_giqf();


$(runSCode);

//begin OAS Analytics
var d=document;
var OAS_rdl = '';
var OAS_CA = 'N';
if((d.referrer)&&(d.referrer!="[unknown origin]"))
{
    	if(d.referrer.indexOf("?") == -1)
	{
    		OAS_rdl += '&tax23_RefDocLoc='+d.referrer.toString();
    	}
	else
	{
    		var rdl=d.referrer;
                var rdl1=rdl.indexOf("?");
    		var rdl2=rdl.substring(0,rdl1);
    		OAS_rdl += '&tax23_RefDocLoc='+rdl2;
    	}
}

function cookie_check(ifd,ife)
{
    	var s=ife.indexOf(ifd);
    	if(s==-1) return "";
        s+=ifd.length;
    	var e=ife.indexOf(";",s);
     	if(e==-1)
           e=ife.length;
    	return ife.substring(s,e);
}
function write_cookie()
{
    	var d=new Date();
    	var m=d.getTime();
    	document.cookie="OAS_SC1="+m.toString()+";path=/;";
    	var v=cookie_check("OAS_SC1=",document.cookie);
    	if(v!=m.toString())
	   return false;
    	d.setTime(m+3600000);
    	return true;
}

if(write_cookie())OAS_CA="Y";

//end OAS Analytics

if (window.CRUserInfo == undefined) {
    window.CRUserInfo = {};


    CRUserInfo.itsJson = null;

    /**
     *   This functionality need to have possibility bind
     *   events even if event was fired before binding.
     *   If event already fired it run callback immediately instead of binding.
     *   It works like '$.ready' event in jQuery.
     */

    if (typeof jQuery.publish !== 'function') {
        console.warn('$.publish init from user-info');
        var publishedHistory = {};

        jQuery.publish = function (event) {
            jQuery(document).trigger(event);
            publishedHistory[event] = true;
        };

        jQuery.subscribe = function (event, callback) {
            if (publishedHistory[event]) {
                callback()
            } else {
                jQuery(document).on(event, callback);
            }
        };

    }


    /**
     * Makes a promise to work with User profile data once ready
     * @returns {jQuery.Deferred}
     */
    CRUserInfo.ready = function () {
        if (!this.readyDefered) {
            this.readyDefered = jQuery.Deferred();
        }

        return this.readyDefered;
    };


    /**
     * This function will return "null" if no alerts exist (or the user is
     * not logged in), or will return an array of String objects if there
     * are alerts to display.  Each String object will contain HTML text
     * and should be output exactly as-is.
     */
    CRUserInfo.getAlerts = function () {
        return CRUserInfo.getData("alerts");
    };

    /**
     * This function will return "null" if we cannot obtain the user's
     * display name from the userInfo cookie (e.g. if they are not logged
     * in, or in some other problem).  Otherwise, this will return the
     * user's display name (assuming the JSON call has returned already).
     */
    CRUserInfo.getName = function () {
        return CRUserInfo.getData("name");
    };

    /**
     * This function will return "null" if we cannot obtain the user's
     * username from the userInfo cookie (e.g. if they are not logged
     * in, or in some other problem).  Otherwise, this will return the
     * user's username (assuming the JSON call has returned already)
     * which is going to be all uppercase.
     */
    CRUserInfo.getUser = function () {
        return CRUserInfo.getData("user");
    };


    /**
     * Checks is service is loaded with data from the backend
     * @returns {boolean}
     */
    CRUserInfo.hasData = function () {
        return CRUserInfo.httpCode === 200
            && CRUserInfo.itsJson != null
            && Object.keys(CRUserInfo.itsJson).length > 0
            && CRUserInfo.itsJson.products.cro !== undefined;
    };


    /**
     * This function will return true or false, depending on whether or not
     * the user has any active subscriptions at all.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasSubscriptions = function () {
        return (CRUserInfo.hasAPSNew() ||
        CRUserInfo.hasAPSUsed() ||
        CRUserInfo.hasCBDP() ||
        CRUserInfo.hasCRMag() ||
        CRUserInfo.hasCRO() ||
        CRUserInfo.hasHealth() ||
        CRUserInfo.hasMoneyAdviser() ||
        CRUserInfo.hasOnHealth() ||
        CRUserInfo.hasShopSmart());
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasAPSNew = function () {
        return CRUserInfo.getData("products", "apsNew");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasAPSUsed = function () {
        return CRUserInfo.getData("products", "apsUsed");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasAPS = function () {
        return CRUserInfo.hasAPSUsed() || CRUserInfo.hasAPSNew();
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasCBDP = function () {
        return CRUserInfo.getData("products", "cbdp");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasCRMag = function () {
        return CRUserInfo.getData("products", "crMag");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasCRO = function () {
        return CRUserInfo.getData("products", "cro");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasCROAnnual = function () {
        return CRUserInfo.getData("products", "croAnnual");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasCROMonthly = function () {
        return CRUserInfo.getData("products", "croMonthly");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasHealth = function () {
        //CRHTTWO-127
        //return CRUserInfo.getData("products", "health");
        return false;
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasMoneyAdviser = function () {
        return CRUserInfo.getData("products", "moneyAdviser");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasOnHealth = function () {
        return CRUserInfo.getData("products", "onHealth");
    };

    /**
     * This function will return true or false, depending on whether or not
     * the user has access to this particular product.  Non-logged in users
     * will get "false".  If there is a problem retrieving the data from
     * the server, "false" will be returned.
     */
    CRUserInfo.hasShopSmart = function () {
        return CRUserInfo.getData("products", "shopSmart");
    };

    /**
     * This function will return true or false, depending on whether or
     * not the user has "auto login" enabled (stored via a separate cookie
     * from user license info, so it is detectable even for logged-out
     * users).  If there is a problem retrieving the data from the server
     * (or if it hasn't gotten the data yet), "false" will be returned.
     */
    CRUserInfo.isAutoLogin = function () {
        var result = CRUserInfo.getData("autoLogin");
        if (result == null) {
            return false;
        }
        else {
            return result;
        }
    };

    CRUserInfo.isEmployee = function () {
        return CRUserInfo.getData("products", "employee");
    };

    /**
     * This function should not be called directly by scripts on the page
     * but should only be called by the "getAlerts" and "has*" functions
     * in this JavaScript file.
     *
     * @param inCheck
     * @param inKey
     */
    CRUserInfo.getData = function (inCheck, inKey) {
        if (CRUserInfo.itsJson != null) {
            if (CRUserInfo.itsJson[inCheck]) {
                if (inKey) {
                    return CRUserInfo.itsJson[inCheck][inKey];
                }
                else {
                    return CRUserInfo.itsJson[inCheck];
                }
            }
        }
        if (inKey) {
            return false;
        }
        else {
            return null;
        }
    };

    /**
     * This function should not be called directly by scripts on the page
     * but should only be called by the JSON callback triggered on document
     * ready in this JavaScript file.
     *
     * @param inName
     * @param inFunction
     */
    CRUserInfo.hideAndShowClasses = function (inName, inFunction) {
        if (inFunction()) {
            jQuery(".no" + inName).hide();
            jQuery(".if" + inName).show();
        }
        else {
            jQuery(".if" + inName).hide();
            jQuery(".no" + inName).show();
        }
    };

    /**
     * This function should not be called directly by scripts on the page.
     */
    CRUserInfo.isEBSCO = function () {
        var theName = CRUserInfo.getUser();
        if (theName != null) {
            if (theName.indexOf("EBSCO") == 0) {
                return true;
            }
        }
        return false;
    };

    /**
     * This function retrieves the user alerts and product info for this
     * user via JSON and then caches the data for all subsequent calls on
     * the page to the "getAlerts" or "has*" functions.
     */
    jQuery(document).ready(function () {

        /** - Handle Race condition for adding and calling additional methods - START **/

        if (typeof jQuery.publish !== 'function') {
            console.warn('$.publish init from user-info ready');
            var publishedHistory = {};

            jQuery.publish = function (event) {
                jQuery(document).trigger(event);
                publishedHistory[event] = true;
            };

            jQuery.subscribe = function (event, callback) {
                if (publishedHistory[event]) {
                    callback()
                } else {
                    jQuery(document).on(event, callback);
                }
            };

        }
        /** - Handle Race condition for adding and calling additional methods - END **/

        var theWCM = {};
        if ("CQ" in window) {
            theWCM = CQ.WCM;
        }
        this.isEditMode = function () {
            return ((theWCM && theWCM.getMode) && theWCM.getMode() != 'preview');
        };

        if (!this.isEditMode()) {

            /*        var userLicensesCookie = jQuery.cookie('userLicenses');
             if (!userLicensesCookie) {
             jQuery.publish('userInfo_ready');
             return;
             }
             */


            // Legacy compatibility
            CRUserInfo.ready().then(function () {
                jQuery.publish && jQuery.publish('userInfo_ready');
            });


            jQuery.ajax({
                url: '/bin/userinfo', dataType: 'json', cache: false, success: function (inJson, status, xhr) {

                    // Store actual HTTP status
                    CRUserInfo.httpCode = xhr.status;

                    CRUserInfo.itsJson = inJson;
                    var theDisplayName = CRUserInfo.getName();
                    if (theDisplayName != null) {
                        var theTruncatedDisplayName = theDisplayName;
                        if (theDisplayName.length > 14) {
                            theTruncatedDisplayName = theDisplayName.substring(0, 14);
                        }
                        jQuery(".truncDisplayName").empty();
                        jQuery(".truncDisplayName").append(theTruncatedDisplayName);
                        jQuery(".truncDisplayName").show();
                        jQuery(".displayName").empty();
                        jQuery(".displayName").append(theDisplayName);
                        jQuery(".displayName").show();
                        if (CRUserInfo.isEBSCO()) {
                            jQuery(".noEBSCO").hide();
                            jQuery(".ifEBSCO").show();
                        }
                        else {
                            jQuery(".ifEBSCO").hide();
                            jQuery(".noEBSCO").show();
                        }
                    }
                    if (CRUserInfo.isAutoLogin()) {
                        jQuery(".ifAutoLogin").attr("checked", "checked");
                    }
                    else {
                        jQuery(".ifAutoLogin").removeAttr("checked");
                    }
                    var theAlertsArray = CRUserInfo.getAlerts();
                    if (theAlertsArray != null) {
                        if (theAlertsArray.length > 0) {
                            jQuery("ol.alert").empty();
                            for (var i = 0; (i < theAlertsArray.length); i++) {
                                jQuery("ol.alert").append("<li>" + theAlertsArray[i] + "</li>");
                                if (i == 1)//we display only 2 alerts
                                {
                                    break;
                                }
                            }
                            jQuery(".noAlert").hide();
                            jQuery(".ifAlert").show();
                        }
                        else {
                            jQuery(".ifAlert").hide();
                            jQuery(".noAlert").show();
                        }
                    }
                    else {
                        jQuery(".ifAlert").hide();
                        jQuery(".noAlert").show();
                    }
                    CRUserInfo.hideAndShowClasses("Subscriptions", CRUserInfo.hasSubscriptions);
                    CRUserInfo.hideAndShowClasses("APS", CRUserInfo.hasAPS);
                    CRUserInfo.hideAndShowClasses("APSNew", CRUserInfo.hasAPSNew);
                    CRUserInfo.hideAndShowClasses("APSUsed", CRUserInfo.hasAPSUsed);
                    CRUserInfo.hideAndShowClasses("CBDP", CRUserInfo.hasCBDP);
                    CRUserInfo.hideAndShowClasses("CRMag", CRUserInfo.hasCRMag);
                    CRUserInfo.hideAndShowClasses("CRO", CRUserInfo.hasCRO);
                    CRUserInfo.hideAndShowClasses("CROAnnual", CRUserInfo.hasCROAnnual);
                    CRUserInfo.hideAndShowClasses("CROMonthly", CRUserInfo.hasCROMonthly);
                    CRUserInfo.hideAndShowClasses("Health", CRUserInfo.hasHealth);
                    CRUserInfo.hideAndShowClasses("MoneyAdviser", CRUserInfo.hasMoneyAdviser);
                    CRUserInfo.hideAndShowClasses("OnHealth", CRUserInfo.hasOnHealth);
                    CRUserInfo.hideAndShowClasses("ShopSmart", CRUserInfo.hasShopSmart);

                    validateSubscriptions(CRUserInfo);

                    if (jQuery("#billshrinkAnchor").length) {
                        var theSubscriberType = "03";
                        if (CRUserInfo.hasCROAnnual() || CRUserInfo.hasCBDP()) {
                            theSubscriberType = "02";
                        }
                        else if (CRUserInfo.hasCROMonthly()) {
                            theSubscriberType = "01";
                        }
                        var theOriginalHref = jQuery("#billshrinkAnchor").attr("href");
                        jQuery("#billshrinkAnchor").attr("href", theOriginalHref + "&utm_source=" + theSubscriberType);
                    }

                    CRUserInfo.ready().resolve();
                }
            });

        } else {
            CRUserInfo.ready().resolve();
        }
    });

    function validateSubscriptions(CRUserInfo) {

        CRUserInfo.hideAndShowClasses("CarsPricingSubscriber", function () {
            return CRUserInfo.hasCBDP() || CRUserInfo.hasCROAnnual() || CRUserInfo.hasAPS();
        });

        CRUserInfo.hideAndShowClasses("APS-noCBDP-noCRO", function () {
            return CRUserInfo.hasAPS() && !CRUserInfo.hasCBDP() && !CRUserInfo.hasCRO();
        });

        CRUserInfo.hideAndShowClasses("CROAnnual-noCBDP-noAPS", function () {
            return CRUserInfo.hasCROAnnual() && !CRUserInfo.hasCBDP() && !CRUserInfo.hasAPS();
        });

        CRUserInfo.hideAndShowClasses("CRO-APS-noCBDP", function () {
            return CRUserInfo.hasCRO() && CRUserInfo.hasAPS() && !CRUserInfo.hasCBDP();
        });

        CRUserInfo.hideAndShowClasses("CBDP-noAPS", function () {
            return CRUserInfo.hasCBDP() && !CRUserInfo.hasAPS();
        });

        CRUserInfo.hideAndShowClasses("CBDP-APS", function () {
            return CRUserInfo.hasCBDP() && CRUserInfo.hasAPS();
        });
    }

} else {
    console.warn('CRUserInfo duplicate at', 'etc/designs/cr/shared-resources/scripts/user-info.js');
}
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

window.renderAds = function (){
    x04kill();
    var theDivList = jQuery("div .adtag");
    for (var x = 0; x < theDivList.length; x++){
        renderAd(theDivList[x], "adtag");
    }
    renderElectronicsHeaderJsAd("x95",theDivList);
};

function renderElectronicsHeaderJsAd(adId,theDivList){
    if(theDivList!=undefined && theDivList.length>0){
        var adPath = theDivList[0].getAttribute("path");
        if(adPath!=undefined){
            if(adPath.indexOf(buildHostPath() + "/cro/electronics-computers/")==0
                || adPath.indexOf(buildHostPath() + "/cro/home-garden/")==0
                || adPath.indexOf(buildHostPath() + "/cro/appliances/")==0) {
                addJsAdToHeadSection(adId,adPath);
            }
        }
    } else if(document.location.pathname.indexOf("/cro/electronics-computers/")==0
                || document.location.pathname.indexOf("/cro/home-garden/")==0
                || document.location.pathname.indexOf("/cro/appliances/")==0) {
        addJsToHeadSectionByPath(adId)
    }  else if(document.location.pathname.indexOf("/cro/electronics1/")==0
                || document.location.pathname.indexOf("/cro/appliances1/")==0
                || document.location.pathname.indexOf("/cro/homegarden1/")==0) {
        addJsToHeadSectionByPath(adId);
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

