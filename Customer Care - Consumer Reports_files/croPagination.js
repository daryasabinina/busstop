(function($){

    // adding ellipsis for numerical pagination
	$.extend($.PaginationRenderers.defaultRenderer.prototype, {

        getLinksSuper: $.PaginationRenderers.defaultRenderer.prototype.getLinks,

		getLinks:function(current_page, eventHandler) {
            var links = this.getLinksSuper(current_page, eventHandler);

            $(links).find('span:contains(...)').css("cursor", "pointer").each(function (index, elips) {
                if ($(elips).nextAll(".current").length > 0) {
                    $(elips).click(function () {
                        $(elips).prev("a").click();
                    });
                } else if ($(elips).prevAll(".current").length > 0) {
                    $(elips).click(function () {
                        $(elips).next("a").click();
                    });
                }
            });

			return links;
		}
	});

})(jQuery);
/**
 * CRO pagiantion plugin
 * @version 1.0
 * @author Vlad Kolotov
 */

/**
 * PaginationModes is a list of supported modes by pagination
 */
var PaginationModes = {
    NO_PAGINATION: "No Pagination",
    BY_WORDS: "By Words",
    BY_SECTION: "By Section",
    ANCHOR_NAVIGATION: "Anchor Navigation",
    ANCHOR_NAVIGATION_IN_TWO_COLUMNS: "Anchor navigation in two columns",
    BY_SECTION_WITH_SECTIONS_TITLES: "By section with section titles",
    TWO_COLUMN_SECTIONS: "twocolumnsections",
    TWO_COLUMN_SECTIONS_WITH_BOTTOM_LINKS: "twocolumnsectionsbottomlinks"
}

/**
 * Utility function, creates delegate of a function
 */
if (!Function.prototype.createDelegate) {
    Function.prototype.createDelegate = function(scope) {
        var fn = this;
        return function() {
            return fn.apply(scope, arguments);
        };
    };
}

/* ------------------------------ CRO Pagination UI Plugin extension interface --------------------------------- */

/**
 * An extension interface for the CRO pagination plugin.
 * An implementation of a pagination mode should implement this interface
 * and register itself with CRO pagination plugin, e.g.
 * $.fn.croPagination.croPaginationExtensions['mode name'] = $.extend({}, $.croPaginationExtension.prototype, {
 *      init: function (croPagination) { },
 *      showPage: function (pageNumber) { },
 *      ... other methods ...
 * });
 *
 */

$.croPaginationExtension = function() {}

$.extend($.croPaginationExtension.prototype, {

    /**
     * Initialization. This function is invoked by CRO pagination plugin at the beginning
     **/
    init: function (croPagination) { },

    /**
     * Creates anchor pagination. This function is just a marker to make extensions more structured.
     **/
    createAnchorNavigation: function () { },

    /**
     * Creates numerical pagination. This function is just a marker to make extensions more structured.
     **/
    createNumericalPagination: function () { },

    /**
     * Returns the number of pages
     */
    getPagesCount: function () { },

    /**
     * Shows page section by given its number (only content, e.g. without changing anchors and numerical pagination)
     */
    showPageSection: function (pageIndex, needAnimation, callback) { },

    /**
     * Returns page title by its page index
     */
    getPageTitle: function (pageIndex) { }


});

/* ------------------------------ CRO Pagination UI Plugin --------------------------------- */

$.widget("ui.croPagination", {

    modeImpl: null,

    // default values
    options: {
        mode: PaginationModes.BY_WORDS,
        needAnimation:true,
        pageNumber: 0,
        anchorNavigationPlaceholderSelector: ".anchor-pagination-placeholder",
        numericalPaginationPlaceholderSelector: ".numerical-pagination-placeholder",
        firstPageOnly: null,
        lastPageOnly: null
    },

    // constructor
    _create: function() {

        var pageNumber = this._getPageNumberFromRequest();
        if (pageNumber) {
            this.options.pageNumber = pageNumber;
        }

        this.modeImpl = $.fn.croPagination.croPaginationExtensions[this.options.mode];
        if (this.modeImpl) {
            this.modeImpl.init(this);
        }
    },

    /**
     * Selects an anchor as current, e.g. makes an anchor as selected anchor
     */
    selectAnchor: function (pageIndex) {
        var placeHolder = $(this.options.anchorNavigationPlaceholderSelector);
        placeHolder.find("a.anchor_nav_link").show();
        placeHolder.find("span.anchor_nav_text").hide();
        placeHolder.find("span.anchor_nav_text[sectionNumber='" + pageIndex + "']").show();
        placeHolder.find("a.anchor_nav_link[sectionNumber='" + pageIndex + "']").hide();
    },

    /**
     * Finds all necessary section titles and returns them as an array
     */
    getSectionTitles: function () {
        return $(this.element).find(".article-section-title").map(function(i, el) {
            return $(el).text();
        });
    },

    /**
     * Finds all necessary section anchors and returns them as an array of object {title: "", anchor: ""}
     */
    getSectionAnchors: function () {
        return $(this.element).find(".article-section-title").map(function(i, el) {
            var a = $(el).children("a");
            return {title: $(el).text(), anchor: a.attr("name"), anchorTitle: a.attr("anchorTitle")};
        });
    },

    /**
     * Creates anchor by given section title, section number, href and callback function
     * callback parameter is optional
     */
    createAnchor: function (sectionTitle, sectionNumber, anchorName, callback, hasSpan) {

        var result = $('<a>').html(sectionTitle).attr({
            sectionNumber: sectionNumber,
            "class": "anchor_nav_link",
            href: "javascript:void(0);"});

        if(hasSpan == false){
            result.append('&nbsp;<img src="/etc/designs/cro/apage/images/icon_anchor_arrow.png" alt="" class="anchor-arrow" />');
        }

        if (anchorName) {
            result.attr("anchorName", anchorName);
        }

        if (callback) {
            result.click(callback);
        }

        return result;
    },

    /**
     * Creates a divider to place it between anchors
     */
    createDivider: function () {
        return $("<span>").html("&nbsp;&nbsp;|&nbsp;&nbsp;");
    },

    /**
     * Crates a span tag which is used to display selected anchor/section
     */
    createAnchorSpan: function (sectionTitle, sectionNumber) {
        return $('<span>').text(sectionTitle).attr({"class": "anchor_nav_text",
            style: "display:none;", sectionNumber: sectionNumber});
    },

    /**
     * Creates an array of anchor + anchor span + divider, by given parameters
     */
    createAnchorIndicator: function (sectionTitle, sectionNumber, anchorName, callback, hasSpan, hasDivider) {

        if ($.trim(sectionTitle).length == 0) {
            sectionTitle = sectionNumber + 1;
        }

        var result = new Array();

        result.push(this.createAnchor(sectionTitle, sectionNumber, anchorName, callback, hasSpan).get(0));

        if (hasSpan) {
            result.push(this.createAnchorSpan(sectionTitle, sectionNumber).get(0));
        }

        if (hasDivider) {
            result.push(this.createDivider().get(0));
        }

        return result;
    },

    scrollToAnchors: function () {
        var pos = $(this.options.anchorNavigationPlaceholderSelector).offset();
        $("html, body").animate({ scrollTop: pos.top - 10 });
    },

    showPage: function (pageIndex, needScrolling, needAnimation) {

        if ($.browser.msie) {
            needAnimation = false;
        }

        this.selectAnchor(pageIndex);
        if (needScrolling) {
            this.scrollToAnchors();
        }
        // short timeout is needed to get rid of blinking when scrolling and changing page section
        setTimeout((function () {
            // hide/show elements specified in the options.lastPageOnly in accordance with whether it is the last page
            this._fadeOutDependants(pageIndex);
            this.modeImpl.showPageSection(pageIndex, needAnimation, (function () {
                this._fadeInDependants(pageIndex);
            }).createDelegate(this));
        }).createDelegate(this), 100);

    },

    _fadeInDependants: function (pageIndex) {
        if (this.options.lastPageOnly && pageIndex == this.modeImpl.getPagesCount() - 1) {
            $(this.options.lastPageOnly).fadeIn(200);
        }
        if (this.options.firstPageOnly && pageIndex == 0) {
            $(this.options.firstPageOnly).fadeIn(200);
        }
    },

    _fadeOutDependants: function (pageIndex) {
        if (this.options.lastPageOnly && pageIndex != this.modeImpl.getPagesCount() - 1) {
            $(this.options.lastPageOnly).fadeOut(200);
        }
        if (this.options.firstPageOnly && pageIndex != 0) {
            $(this.options.firstPageOnly).fadeOut(200);
        }
    },

    showPageSection: function (sectionNumber, needAnimation, callback) {
        if (needAnimation) {
            $(this.element).fadeOut(200, (function () {
                this._showPageSection(sectionNumber);
                $(this.element).fadeIn(200, (function () {
                    this._fixFFiframes();
                }).createDelegate(this));
                if (callback) {
                    callback();
                }

            }).createDelegate(this));
        } else {
            this._showPageSection(sectionNumber);
            if (callback) {
                callback();
            }
            this._fixFFiframes();
        }
    },

    _fixFFiframes: function () {
        if ($.browser.mozilla && typeof heightSize != 'undefined') {
            // heightSize method located in /apps/cro/components/content/iFrame/iFrame.vtl
            heightSize();
        }
    },

    _showPageSection: function (sectionNumber) {
        $(this.element).find(".articleSection").hide();
        $(this.element).find(".articleSection:nth(" + sectionNumber + ")").show();
    },

    _getPageNumberFromRequest: function () {
        var page = /[\\?&]pn=([^&#]*)/.exec(decodeURI(window.location.search));
        if (page != null) {
            return parseInt(page[1]);
        }
        return null;
    }

});

$.fn.croPagination.croPaginationExtensions = [];

/**
 * CRO pagiantion plugin extensions
 * @version 1.0
 * @author Vlad Kolotov
*/


// ----------------- Extension implementation for PaginationModes.ANCHOR_NAVIGATION

$.fn.croPagination.croPaginationExtensions[PaginationModes.ANCHOR_NAVIGATION] = $.extend({},
        $.croPaginationExtension.prototype, {

    init: function (croPagination) {
        this.croPagination = croPagination;
        this.createAnchorNavigation();
        $(this.croPagination.options.numericalPaginationPlaceholderSelector).hide();
    },

    createAnchorNavigation: function () {
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).addClass("anchor-nav");
        var sectionAnchors = this.croPagination.getSectionAnchors();
        sectionAnchors = $.grep(sectionAnchors, function (el, index) {return $.trim(el.title).length > 0});
        var callback = this._anchorNavigationCallback.createDelegate(this);
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).empty().show().append(
                $.map(sectionAnchors, (function(sectionAnchor, sectionNumber) {
                        return this.croPagination.createAnchorIndicator(
                                sectionAnchor.anchorTitle ? sectionAnchor.anchorTitle : sectionAnchor.title, sectionNumber, sectionAnchor.anchor, callback, false,
                                sectionNumber < sectionAnchors.length - 1);
                }).createDelegate(this))
        );
    },

    _anchorNavigationCallback: function (event) {
        var anchorName = $(event.currentTarget).attr("anchorName");
        var pos = $(this.croPagination.element).find("a[name='" + anchorName + "']").closest(".articleSection").offset();
        $("html, body").animate({ scrollTop: pos.top - 52});
    },

    getPagesCount: function () {
        return 1;   
    }

});

// ----------------- Extension implementation for PaginationModes.TWO_COLUMN_SECTIONS

$.fn.croPagination.croPaginationExtensions[PaginationModes.TWO_COLUMN_SECTIONS] = $.extend({},
        $.fn.croPagination.croPaginationExtensions[PaginationModes.ANCHOR_NAVIGATION], {

    pageNumber: 0,

    init: function (croPagination) {
        $.fn.croPagination.croPaginationExtensions[PaginationModes.ANCHOR_NAVIGATION].init.call(this, croPagination);
        this.croPagination.showPage(this.croPagination.options.pageNumber, false, false);
    },

    createAnchorNavigation: function () {
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).addClass("anchor-nav");

        var sectionAnchors = this.croPagination.getSectionAnchors();

        var firstColumn = $("<div class='anchor-nav-first-column'></div>");
        var secondColumn = $("<div class='anchor-nav-second-column'></div>");
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).empty().show().append(
                firstColumn).append(secondColumn);

        var callback = this._anchorNavigationCallback.createDelegate(this);

        for (var i = 0; i < sectionAnchors.length; i++) {
            var column;
            if (i % 2 == 0) {
                column = firstColumn;
            } else {
                column = secondColumn;
            }
            var title = sectionAnchors[i].anchorTitle ? sectionAnchors[i].anchorTitle : sectionAnchors[i].title;
            column.append($("<div>").append(this.croPagination.createAnchorIndicator(title, i, null, callback, true, false)));
        }
        this.pageNumber = sectionAnchors.length;
    },

    _anchorNavigationCallback: function (event) {
        var pageIndex = parseInt($(event.currentTarget).attr("sectionNumber"));
        this.croPagination.showPage(pageIndex, false, this.croPagination.options.needAnimation);
    },
    
    showPageSection: function (pageIndex, needAnimation, callback) {
        //jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
        this.croPagination.showPageSection(pageIndex, needAnimation, callback);
    },
    
    getPageTitle: function (pageIndex) {
        return this.croPagination.getSectionTitles()[pageIndex];
    },

    getPagesCount: function () {
        return this.pageNumber;
    }
});

// ----------------- Extension implementation for PaginationModes.TWO_COLUMN_SECTIONS_WITH_BOTTOM_LINKS
//
$.fn.croPagination.croPaginationExtensions[PaginationModes.TWO_COLUMN_SECTIONS_WITH_BOTTOM_LINKS] = $.extend({},
        $.fn.croPagination.croPaginationExtensions[PaginationModes.TWO_COLUMN_SECTIONS], {});

/**
 * CRO pagiantion plugin extensions
 * @version 1.0
*/

// ----------------- Extension implementation for PaginationModes.ANCHOR_NAVIGATION_IN_TWO_COLUMNS

$.fn.croPagination.croPaginationExtensions[PaginationModes.ANCHOR_NAVIGATION_IN_TWO_COLUMNS] = $.extend({},
        $.croPaginationExtension.prototype, {

    init: function (croPagination) {
        this.croPagination = croPagination;
        this.createAnchorNavigation();
        $(this.croPagination.options.numericalPaginationPlaceholderSelector).hide();
    },

    createAnchorNavigation: function () {
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).addClass("anchor-nav");
        var firstColumn = $("<div class='anchor-nav-first-column'></div>");
        var secondColumn = $("<div class='anchor-nav-second-column'></div>");
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).empty().show().append(firstColumn).append(secondColumn);
        var sectionAnchors = this.croPagination.getSectionAnchors();
        var callback = this._anchorNavigationCallback.createDelegate(this);
        for (var i = 0; i < sectionAnchors.length; i++) {
            var column;
            if (i % 2 == 0) {
                column = firstColumn;
            } else {
                column = secondColumn;
            }
            var title = sectionAnchors[i].anchorTitle ? sectionAnchors[i].anchorTitle : sectionAnchors[i].title;
            column.append($("<div>").append(this.croPagination.createAnchorIndicator(title, i, sectionAnchors[i].anchor, callback, false, false)));
        }
    },

    _anchorNavigationCallback: function (event) {
        var anchorName = $(event.currentTarget).attr("anchorName");
        var pos = $(this.croPagination.element).find("a[name='" + anchorName + "']").closest(".articleSection").offset();
        $("html, body").animate({ scrollTop: pos.top - 70});
    },

    getPagesCount: function () {
        return 1;
    }

});
/**
 * CRO pagiantion plugin extensions
 * @version 1.0
 * @author Vlad Kolotov
*/


// ----------------- Extension implementation for PaginationModes.BY_SECTION_WITH_SECTIONS_TITLES

$.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION_WITH_SECTIONS_TITLES] = $.extend({},
        $.croPaginationExtension.prototype, {

    croPagination: null,
    firstLoad: true,
    needScrolling: true,

    init: function (croPagination) {
        this.croPagination = croPagination;
        this.createAnchorNavigation();
        this.createNumericalPagination(this.croPagination.options.pageNumber);
    },

    createNumericalPagination: function (pageIndex) {
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).append($("<a>").attr("name", "pagingTop"));
        $(this.croPagination.options.numericalPaginationPlaceholderSelector).pagination(
                this.getPagesCount(), {
            callback: this._numericalPaginationCallback.createDelegate(this),
            prev_text: "&nbsp;",
            next_text: "&nbsp;",
            current_page: pageIndex,
            items_per_page: 1, // Show only one item per page
            num_edge_entries: 1,
            num_display_entries: 5,
            link_to: "javascript:void(0);"
        });
    },

    createAnchorNavigation: function () {
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).addClass("anchor-nav");
        var sectionAnchors = this.croPagination.getSectionAnchors();
        var that = this;
        var callback = this._anchorNavigationCallback.createDelegate(this);
        $(this.croPagination.options.anchorNavigationPlaceholderSelector).empty().show().append(
                sectionAnchors.map((function(sectionNumber, sectionAnchor) {
                        return this.croPagination.createAnchorIndicator(
                                sectionAnchor.anchorTitle ? sectionAnchor.anchorTitle : sectionAnchor.title, sectionNumber,
                                null, callback, true, sectionNumber < sectionAnchors.length - 1);
                }).createDelegate(this))
        );
    },

    _numericalPaginationCallback: function (pageIndex) {
        var needAnimation = !this.firstLoad && this.croPagination.options.needAnimation;

        this.croPagination.showPage(pageIndex, !this.firstLoad && this.needScrolling, needAnimation, this.firstLoad);
        this.firstLoad = false;
    },

    _anchorNavigationCallback: function (event) {
        var pageIndex = parseInt($(event.currentTarget).attr("sectionNumber"));
        this.needScrolling = false;
        this.createNumericalPagination(pageIndex);
        this.needScrolling = true;
    },

    getPagesCount: function () {
        return this.croPagination.getSectionTitles().length;   
    },

    showPageSection: function (pageIndex, needAnimation, callback) {
        this.croPagination.showPageSection(pageIndex, needAnimation, callback);   
    },

    getPageTitle: function (pageIndex) {
        return this.croPagination.getSectionTitles()[pageIndex];
    }

});

// ----------------- Extension implementation for PaginationModes.BY_SECTION
$.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION] = $.extend({},
        $.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION_WITH_SECTIONS_TITLES], {

    createAnchorNavigation: function () { }
});

// ----------------- Extension for PaginationModes.BY_WORDS
$.fn.croPagination.croPaginationExtensions[PaginationModes.BY_WORDS] = $.extend({}, $.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION], {

    options:{
        maxWordsPerPage: 1000,
        minWordsOnPage: 600
    },

    pagesCount: 0,

    init: function (croPagination) {
        this.croPagination = croPagination;        

        this._split();

        $.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION].init.call(this, croPagination);
    },

    _split: function () {
        var pageNumber = 0;
        var wordCounter = 0;
        // iterating over basic html elements which can contain text and counting words
        $(this.croPagination.element).find("p, table, ul, h1, h2, h3, h4, h5, h6").filter(":visible").each((function (index, element) {
            var text = $.trim($(element).text());
            var elementWordCount = 0;
            if (text.length > 0 ) {
                elementWordCount = text.split(/\s+/).length;
            }

            if (wordCounter + elementWordCount >= this.options.maxWordsPerPage) {
                // found the first paragraph of the next page

                // checking whether section title has enough text nearby
                var wordsCountForCurrentSection = $.trim(
                                $(element).closest(".articleSection").find("p, table, ul, h1, h2, h3, h4, h5, h6")
                                        .filter(".pagination-page-" + pageNumber).text()
                        ).split(/\s+/).length;
                if (wordsCountForCurrentSection > 2) {
                    wordCounter = elementWordCount;
                    pageNumber++;
                } else {
                    wordCounter += elementWordCount;
                }
            } else {
                wordCounter += elementWordCount;
            }
            // marking all siblings elements to the top and all parents to the top as current page 
            this._markToTheTop(element, pageNumber);
        }).createDelegate(this));

        // checking whether that after the last page there are no elements without text
        $(this.croPagination.element).children(":not(.pagination-element)")
                .addClass("pagination-page-" + pageNumber).addClass("pagination-element");

        // checking whether the last page has enough words to be as amn separate page, otherwise make the last page as previous
        if (pageNumber > 0 && wordCounter < this.options.minWordsOnPage) {
            $(this.croPagination.element).find('.pagination-page-' + pageNumber)
                    .removeClass('pagination-page-' + pageNumber).addClass("pagination-page-" + (pageNumber - 1));
            this.pagesCount = pageNumber;
        } else {
            this.pagesCount = pageNumber + 1;
        }

    },

    /**
     * Marks all previous siblings and all parents until previous page marker is found with the page number marker
     */
    _markToTheTop: function (element, pageNumber) {                    
        $(element).prevUntil(".pagination-element").andSelf()
                .addClass("pagination-page-" + pageNumber).addClass("pagination-element").length;
        $(element).parentsUntil(".articleSections").addClass("pagination-page-" + pageNumber).addClass("pagination-element")
                    .prevUntil(".pagination-element")
                    .addClass("pagination-page-" + pageNumber).addClass("pagination-element");
    },

    getPagesCount : function(){
        return this.pagesCount;
    },

    showPageSection: function (sectionNumber, needAnimation, callback) {
        if (needAnimation) {
            $(this.croPagination.element).fadeOut(200, (function () {
                $(this.croPagination.element).find(".pagination-element").hide();
                $(this.croPagination.element).find(".pagination-page-" + sectionNumber).show();
                $(this.croPagination.element).fadeIn(200);
                if (callback) {
                    callback();
                }
            }).createDelegate(this));
        } else {
            $(this.croPagination.element).find(".pagination-element").hide();
            $(this.croPagination.element).find(".pagination-page-" + sectionNumber).show();
            if (callback) {
                callback();
            }
        }
    }

});
// -----------------

$.extend($.ui.croPagination.prototype, {
   superClass: $.extend({}, $.ui.croPagination.prototype),
   showPage: function (pageIndex, needScrolling, needAnimation, isFirstLoad) {
       this.superClass.showPage.call(this, pageIndex, needScrolling, needAnimation);
       if (this.modeImpl == $.fn.croPagination.croPaginationExtensions[PaginationModes.BY_SECTION_WITH_SECTIONS_TITLES]
                || this.modeImpl == $.fn.croPagination.croPaginationExtensions[PaginationModes.TWO_COLUMN_SECTIONS]) {
           var sectionTitle = this.modeImpl.getPageTitle(pageIndex);
           if (sectionTitle && typeof updateBuyingGuideEventsToSC != 'undefined' && !isFirstLoad) {
               updateBuyingGuideEventsToSC(sectionTitle);
           }
       }
   }
});

