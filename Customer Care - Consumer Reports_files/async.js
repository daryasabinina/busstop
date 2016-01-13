/* globals define */
(function () {

    var async = {};
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    function waterfall(tasks, cb) {
        var current = 0;

        function done(err, args) {
            function end() {
                args = args ? [].concat(err, args) : [err];
                if (cb) cb.apply(undefined, args)
            }

            end();
        }

        function each(err) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (++current >= tasks.length || err) {
                done(err, args)
            } else {
                tasks[current].apply(undefined, [].concat(args, each))
            }
        }

        if (tasks.length) {
            tasks[0](each)
        } else {
            done(null)
        }

    }

    async.waterfall = waterfall;


    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define === 'function' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());
