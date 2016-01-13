//site catalyst custom link tracking
function scCustomTrack() {
    if (typeof s_gi == 'undefined') return;
    var pageNameFlag = '{{p}}';
    var normalizeFlag = '{{n}}';
    var s = s_gi(s_account);
    jQuery('.sc-custom-track').click(function(e) {
        var linkTrackVars = [];
        var overrides = jQuery(this).data();
        var events = overrides.e;
        delete overrides.e;
        var source = overrides.s;
        delete overrides.s;
        for (key in overrides) {
            //normalize section
            if ((new RegExp(normalizeFlag)).test(overrides[key])) {
                overrides[key] = overrides[key].replace(normalizeFlag, '')
                overrides[key] = overrides[key].replace(/([^|])(\s+)(?=[^|])/g, '$1_').toLowerCase();
            }
            //pageName add section
            if ((new RegExp(pageNameFlag)).test(overrides[key])) {
                overrides[key] = overrides[key].replace(pageNameFlag, s.pageName + ' | ')
            }
            //V in eVar must be uppercase
            if (/evar/.test(key)) {
                var newKey = key.replace('evar', 'eVar');
                overrides[newKey] = overrides[key];
                delete overrides[key];
                linkTrackVars.push(newKey)
            } else {
                linkTrackVars.push(key)
            }
        }
        if (linkTrackVars.length) {
            overrides.linkTrackVars = linkTrackVars.join(',');
        }
        if (events) {
            overrides.events = overrides.linkTrackEvents = events;
        }
        s.tl(this, 'o', source, overrides);
    })
}
jQuery(document).bind('userInfo_ready', scCustomTrack);

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitaliseAfterSpaceLetters(string){
    return string.replace(/(?: )(\w)/g, function(key) { return key.toUpperCase()})
}