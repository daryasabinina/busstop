(function(jQuery){
	var myMenu = function (elem, opt) {
		settings = jQuery.extend({
					'subClass': '.sub-nav',
					'anchors': '.adminMenu a'
		}, opt);
	jQuery(settings.anchors).click(function(e){
		var currentAnchor = jQuery(this);
		var parentLink = currentAnchor.parent().parent();
	jQuery(settings.subClass).not(parentLink).hide();
		e.preventDefault();
		e.stopPropagation();
		if (currentAnchor.next().length >0) {
			currentAnchor.next().toggle();
			} else {
			/* alert("no siblings") */ /* JUST TESTING UNTIL LINKS ARE ESTABLISHED */
			}
	});

/* REMOVE BEFORE FINAL REVIEW */
	jQuery('a').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		});
	};
	jQuery.fn.adminMenu = function (opt) {
		return this.each(function() {
			var elem = jQuery(this);
			var myplugin = new myMenu(elem, opt);
			elem.data("adminMenu", myplugin);
		});
	};
})(jQuery);