(function (root) {
    root.cfaCategoriesTaxonomy = [
        {
            'productGroupId': '34458',
            'singularName': 'Money',
            'pluralName': 'Money',
            name: 'money'
        },
        {
            'productGroupId': '33546',
            'singularName': 'Food',
            'pluralName': 'Food',
            name: 'food'
        },
        {
            'productGroupId': '28985',
            'singularName': 'Baby & kid',
            'pluralName': 'Babies & kids',
            name: 'babiesKids'
        },
        {
            'productGroupId': '28937',
            'singularName': 'Home & garden',
            'pluralName': 'Home & garden',
            name: 'homeGarden'
        },
        {
            'productGroupId': '36786',
            'singularName': 'Health',
            name: 'health',
            'pluralName': 'Health',
            children: [

                {
                    productGroupId: '36790',
                    singularName: 'Home medical supply',
                    name: 'homeMedicalSupplies',
                    id: '36790',
                    type: 'hidden',
                    children: []
                },
                {
                    productGroupId: '36787',
                    singularName: 'Beauty & personal care',
                    name: 'beautyPersonalCare',
                    id: '36787',
                    type: 'hidden',
                    children: []
                },
                {
                    productGroupId: '36788',
                    singularName: 'Exercise & fitness',
                    name: 'exerciseFitness',
                    id: '36788',
                    type: 'hidden',
                    children: []
                },
                {
                    productGroupId: '36789',
                    singularName: 'Food',
                    name: 'food',
                    id: '36789',
                    type: 'hidden',
                    children: []
                },

                {
                    type: 'supercategory',
                    pluralName: 'Conditions &amp; Treatments',
                    title: 'Conditions &amp; Treatments',
                    link: 'cro/health/conditions-and-treatments/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Drugs',
                    title: 'Drugs',
                    link: 'cro/health/drugs/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Vitamins &amp; Supplements',
                    title: 'Vitamins &amp; Supplements',
                    link: 'cro/health/vitamins-and-supplements/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Doctors &amp; Hospitals',
                    title: 'Doctors &amp; Hospitals',
                    link: 'cro/health/doctors-and-hospitals/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Insurance',
                    title: 'Insurance',
                    link: 'cro/health/health-insurance/index.htm'
                }
            ]
        },
        {
            'productGroupId': '28934',
            'singularName': 'Car',
            'pluralName': 'Cars',
            name: 'cars',
            children: [
                //Real items from api
                {
                    productGroupId: '34628',
                    singularName: 'Motor vehicle',
                    name: 'motorVehicles',
                    type: 'hidden'
                },
                {
                    productGroupId: '28935',
                    singularName: 'Tire & car care',
                    name: 'tiresCarCare',
                    type: 'hidden'
                },
                //
                {
                    type: 'supercategory',
                    pluralName: 'New Cars',
                    title: 'New Cars',
                    name: 'newCars',
                    link: 'cro/cars/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Used Cars',
                    title: 'Used Cars',
                    name: 'usedCars',
                    link: 'cro/cars/used-cars/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Car Buying & Pricing',
                    title: 'Car Buying & Pricing',
                    name: 'carBuyingPricing',
                    link: 'cro/cars/prices/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Maintenance & Repair',
                    title: 'Maintenance & Repair',
                    name: 'maintanenceRepair',
                    link: 'cro/cars/maintenance-repair/index.htm'
                },
                {
                    type: 'supercategory',
                    pluralName: 'Car Safety',
                    title: 'Car Safety',
                    name: 'carSafety',
                    link: 'cro/cars/safety-recalls.htm'
                }
            ]
        },
        {
            'productGroupId': '28949',
            'singularName': 'Electronic & Computer',
            'pluralName': 'Electronics & computers',
            title: 'Electronics',
            name: 'electronicsComputers'

        },
        {
            'productGroupId': '28967',
            'singularName': 'Appliance',
            'pluralName': 'Appliances',
            name: 'appliances'

        }
    ];

}(window || global));
/* jshint undef: true, unused: true */
/* globals define */

/** @namespace node.children */
/** @namespace node.parent */

/** @namespace node.materialsCount */
/** @namespace node.productsCount */
/** @namespace node.ratedProductsCount  */
/** @namespace node.servicesCount  */
/** @namespace node.testedProductsOnlyCount */

/** @namespace cfaNewsItem.url */
/** @namespace cfaNewsItem.news */

/** @namespace define.amd */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'async'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('lodash'), require('async'));
    } else {
        root.GlobalNavigation = factory(root, root.jQuery, root.lodash, root.async, root.cfaCategoriesTaxonomy);
    }
}(this, function (global, $, _, async, cfaCategoriesTaxonomy) {


    GlobalNavigation.CARS_FRANCHISE = '28934';
    GlobalNavigation.HEALTH_FRANCHISE = '36786';


    GlobalNavigation.FRANCHISE_ORDER = [
        'cars', 'electronicsComputers', 'appliances', 'homeGarden', 'babiesKids', 'money', 'health', 'news'
    ];
    GlobalNavigation.CARS_ORDER = ['newCars', 'usedCars', 'carBuyingPricing', 'maintanenceRepair', 'carSafety'];
    GlobalNavigation.DEFAULT_LIST_ORDER = 'title';


    GlobalNavigation.BUYING_GUIDE_NAME_RE = /(?:.+)\/(.+)(?:\/buying-guide\.htm)$/;
    GlobalNavigation.BUYING_GUIDE_NODE = {pluralName: 'buying-guide'};

    /**
     * Generate a "root" node for search tree
     * @param tree
     * @returns {{name: string, singularName: string, productGroupId: string, link: string, pluralName: string, type: string, breadcrumb: Array, children: *}}
     */
    function makeRootNode(tree) {
        return {
            name: 'home',
            id: '0',
            productGroupId: '0',
            singularName: 'Home',
            link: 'cro',
            pluralName: 'cro',
            type: 'cro',
            breadcrumb: [],
            children: tree
        };
    }


    /**
     * Walk through parents to build breadcrumbs
     * @param tree
     */
    function buildBreadcrumb(tree) {
        var parent, leaf, breadcrumb;

        breadcrumb = [];

        leaf = tree;

        while (parent = leaf.parent) {
            breadcrumb.unshift(parent);
            leaf = leaf.parent;
        }

        // Last one is the node itself. We can filter it out later in pipe
        tree.breadcrumb = [].concat(breadcrumb, tree);
    }


    function setParent(node, parent) {
        node.parent = parent;

        _.each(node.children, function (child) {
            setParent(child, node);
        });
    }


    /**
     * Depth-first search tree
     * @param {function} filter - Filtering function used to search for a node
     * @param {object} tree - Node example: {name: 'a', children: [nodeA, nodeB, ...]}
     * @return {object} Returns the node with the given name
     */
    function findNestedNode(filter, tree) {
        var children, childrenLength, result/*, breadcrumb, parent, leaf*/;

        buildBreadcrumb(tree);

        if (filter(tree)) {
            children = tree.children;

            if (children !== undefined) {
                childrenLength = children.length;
                for (var j = 0; j < childrenLength; j++) {
                    setParent(children[j], tree);

                    if (!children[j].title) {
                        children[j].title = titleTransformer(children[j]);
                    }

                    buildBreadcrumb(children[j]);

                    _.forEach(children[j].children, function (child) {
                        buildBreadcrumb(child);
                    });
                }
            }

            return tree; //Node found
        } else {
            children = tree.children;

            if (children !== undefined) {
                childrenLength = children.length;
                for (var i = 0; i < childrenLength; i++) {

                    setParent(children[i], tree);

                    if (!children[i].title) {
                        children[i].title = titleTransformer(children[i]);
                    }
                    result = findNestedNode(filter, children[i]);

                    if (result !== undefined) { //If the node has been found
                        return result; //Return the node
                    }
                }
            }
        }
    }

    function getHost() {
        var host = location.host;
        if (/\.consumerreports\.org/.exec(host)) {
            host = 'consumerreports.org';
        }

        return 'http://' + host;
    }

    /**
     *
     * @param options
     * @constructor
     */
    function GlobalNavigation(options) {

        loadLibs();

        this.options = this.options = _.extend({

            apiKey: '__KEY__',
            apiURL: '__URL__',

            navContainer: $('<nav id="global-nav-breadcrumb"></nav>'),

            templates: {
                categoryBreadcrumb: 'CATEGORY_BREADCRUMB_NOT_DEFINED_TPL',
                franchiseList: 'FRANCHISE_LIST_NOT_DEFINED_TPL',
                franchiseListNoTitle: $('#global-header-container-nav-category-list').html(),
                mobileFranchiseList: 'MOBILE_FRANCHISE_LIST_NOT_DEFINED',
                mobileSuperCategoryList: 'MOBILE_SUPER_CATEGORY_LIST_NOT_DEFINED',
                mobileIssuesMatter: 'MOBILE_ISSUES_MATTER_NOT_DEFINED'
            }


        }, options);

        this.api = new DataApiUtil({
            apiKey: this.options.apiKey,
            apiURL: this.options.apiURL,
            dataVersion: this.options.dataVersion,
            cacheKey: 'GlobalNavCacheManagerVersion'
        });


        lodash.templateSettings.imports.host = getHost();

    }

    function deepExtend(obj) {
        var parentRE = /#{\s*?_\s*?}/,
            slice = Array.prototype.slice;

        _.each(slice.call(arguments, 1), function (source) {
            _.forOwn(source, function (val, prop) {

                if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
                    obj[prop] = source[prop];
                }
                else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
                    if (_.isString(obj[prop])) {
                        obj[prop] = source[prop].replace(parentRE, obj[prop]);
                    }
                }
                else if (_.isArray(obj[prop]) || _.isArray(source[prop])) {
                    if (!_.isArray(obj[prop]) || !_.isArray(source[prop])) {
                        throw new Error('Trying to combine an array with a non-array (' + prop + ')');
                    } else {
                        obj[prop] = _.reject(_.deepExtend(_.clone(obj[prop]), source[prop]), function (item) {
                            return _.isNull(item);
                        });
                    }
                }
                else if (_.isObject(obj[prop]) || _.isObject(source[prop])) {
                    if (!_.isObject(obj[prop]) || !_.isObject(source[prop])) {
                        throw new Error('Trying to combine an object with a non-object (' + prop + ')');
                    } else {
                        obj[prop] = _.deepExtend(_.clone(obj[prop]), source[prop]);
                    }
                } else {
                    obj[prop] = source[prop];
                }
            });
        });
        return obj;
    }


    function loadLibs() {
        if (!_.isFunction(_.deepExtend)) {
            _.mixin({'deepExtend': deepExtend});
        }
    }


    /**
     * Fetch categories data from the API
     * @param {Function} next
     */
    function loadData(next) {
        this.api.apiQuery('/v0.1/categories-2.json', {
                show: ['name', 'type', 'children', 'singularName', 'pluralName', 'productGroupId', 'buyingGuideUrl',
                    'ratedProductsCount', 'productsCount', 'servicesCount', 'materialsCount', 'testedProductsOnlyCount'

                ].join()
            },
            function (err, data) {

                data = sortListBy(data, GlobalNavigation.FRANCHISE_ORDER);
                cfaCategoriesTaxonomy = sortListBy(cfaCategoriesTaxonomy, GlobalNavigation.FRANCHISE_ORDER);

                var tree = _.deepExtend([], data, cfaCategoriesTaxonomy);

                tree.push({
                    singularName: 'News',
                    pluralName: 'News',
                    title: 'News',
                    name: 'news',
                    type: 'news',
                    link: 'cro/news/index.htm'
                });

                next(err, tree);
                // next(err, _.merge(cfaCategoriesTaxonomy, data));
            });
    }


    /**
     * Factory that creates workflow step using finder provided
     * @param finder
     * @returns {Function} finder
     */
    function findNode(finder) {

        /**
         * Wrap root category and finder tree for a matching node
         * @param {Object} tree
         * @param {Function} next
         */
        function fn(tree, next) {
            next(null, findNestedNode(finder, makeRootNode(tree)) || {});
        }

        return fn;
    }

    /**
     *
     * @param {Array} nodes
     * @param {Function} pickLinkNodes
     */
    function processLinks(nodes, pickLinkNodes) {
        if (Array.isArray(nodes)) {
            nodes.forEach(function (stepNode) {

                if (_.isArray(stepNode.breadcrumb)) {
                    if (!stepNode.link) {
                        stepNode.link = makeLink(pickLinkNodes(stepNode.breadcrumb.slice(0), stepNode.breadcrumb[stepNode.breadcrumb.length - 1]));
                    }
                    if (stepNode.children) {
                        stepNode.children.forEach(function (child) {
                            if (_.isArray(child.breadcrumb)) {
                                if (!child.link) {
                                    child.link = makeLink(pickLinkNodes(child.breadcrumb.slice(0), child.breadcrumb[child.breadcrumb.length - 1]));
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    /**
     * Wrapper to pass url parts filter to link builder
     * @param pickLinkNodes
     * @returns {fn}
     */
    function buildLinks(pickLinkNodes) {

        /**
         * Process each step of the breadcrumb with link builder
         * @param node
         * @param next
         */
        function fn(node, next) {
            var breadcrumbs;

            if (_.isObject(node) && typeof node.breadcrumb != "undefined") {

                breadcrumbs = node.breadcrumb.slice(0);

                processLinks(node.children, pickLinkNodes);
                processLinks(node.breadcrumb, pickLinkNodes);

                if (!node.link) {
                    node.link = makeLink(pickLinkNodes(breadcrumbs, breadcrumbs[breadcrumbs.length - 1]));
                }

            }
            next(null, node);
        }

        return fn;
    }

    /**
     * Filter out nodes from breadcrumb that we don't use for this type
     * @param filter
     * @returns {fn}
     */
    function filterBreadcrumbNodes(filter) {

        function fn(node, next) {

            if (_.isFunction(filter)) {
                _.forEach(node.breadcrumb, function (stepNode) {
                    stepNode.breadcrumb = _.filter(stepNode.breadcrumb, filter);
                });

                node.breadcrumb = _.filter(node.breadcrumb, filter);
            }
            next(null, node);
        }

        return fn;
    }


    /**
     * Process  nodes with modifier provided
     * before but we may render them
     * @param modifier
     * @returns {fn}
     */
    function walkNodes(modifier) {

        /**
         * Waterfall step with node and next provided
         * @param node
         * @param next
         */
        function fn(node, next) {

            if (_.isFunction(modifier)) {
                if (_.isArray(node.breadcrumb)) {
                    _.forEach(node.breadcrumb, function (step) {
                        if (_.isArray(step.children)) {
                            _.forEach(step.children, function (child) {
                                child.parent = step;

                                if (!child.title) {
                                    child.title = titleTransformer(child);
                                }

                                modifier(child);
                            });
                        }

                        modifier(step);
                    });
                }

            }

            next(null, node);
        }

        return fn;
    }


    /**
     * Generic "low-level" rendering method
     * @param {Function} options.leafNodeFinder
     * @param {Function} options.postProcessData
     * @param {String} options.nodesFilter
     * @param {String} options.postProcess
     * @param {String} options.linkNodesFilter
     * @param {String} options.template
     * @param {String} options.data
     * @param {String} options.selector
     */
    function renderBreadcrumbs(options) {
        async.waterfall([

            _.bind(loadData, this),
            findNode(options.leafNodeFinder),
            walkNodes(buildBreadcrumb),
            filterBreadcrumbNodes(options.nodesFilter),
            buildLinks(options.linkNodesFilter),
            walkNodes(options.postProcess)

        ], _.bind(function (errors, node) {


            if (!errors) {
                options.data = _.isFunction(options.postProcessData) ? options.postProcessData(node) : node;

                if (_.isEmpty(options.data)) {
                    options.template = function () {
                        return false;
                    };

                }
                this.render(options);
            }
        }, this));
    }

    /** @namespace options.storeOriginal */
    /** @namespace options.template */
    /** @namespace options.callback */
    /** @namespace options.data */

    /**
     * Render data using template provided
     * @param options
     */
    function render(options) {

        template(options)(function (html) {
            options.callback(html, options.data);
        });
    }

    function template(options) {

        if (!template.init) {

            template.api = new DataApiUtil({
                apiKey: '',
                cacheKey: 'GlobalNavTemplates'
            });

            template._cache = {};
            template.init = true;
        }

        if (template._cache[options.template]) {
            return function (cb) {
                cb(template._cache[options.template](options.data));
            };

        } else {

            return function (cb) {
                var url = ['/etc/designs/cr/clientlibs/component/globalHeader-new/tpl/', options.template, '.hbs'].join('');

                template.api.cachedQuery(url, {}, function (error, response) {

                    if (error) {

                        if (response.status === 404) {
                            console.log("Template is not found: %s\n\nURL: %s", options.template, response.url);
                        }

                    } else if (lodash.isString(response)) {
                        try {
                            template._cache[options.template] = lodash.template(response);
                        } catch (e) {
                            console.log(e);

                        } finally {
                            if (_.isFunction(template._cache[options.template])) {
                                cb(template._cache[options.template](options.data));
                            }
                        }

                    }
                });

            };
        }
    }


    function isBuyingGuide(node) {

        if (!node) {
            return false;
        }

        var pagesCount = node.materialsCount +
            node.productsCount +
            node.ratedProductsCount +
            node.servicesCount +
            node.testedProductsOnlyCount;

        return node.type === 'supercategory' && pagesCount === 0;
    }


    /**
     *
     * @param {Array} nodes
     * @param {Object} leafNode
     * @returns {Array}
     */
    function defaultLinkNodesFilter(nodes, leafNode) {
        var typesMap;

        typesMap = {};
        _.forEach(nodes, function (node) {
            typesMap[node.type] = node;
        });

        /** @namespace typesMap.cro */
        /** @namespace typesMap.franchise */
        /** @namespace typesMap.subfranchise */
        /** @namespace typesMap.category */
        /** @namespace typesMap.subcategory */

        // todo define business rules later


        if (isBuyingGuide(leafNode)) {
            return [typesMap.cro, typesMap.supercategory, GlobalNavigation.BUYING_GUIDE_NODE];
        }

        return {
            'cro': [typesMap.cro, {pluralName: 'index'}],
            'franchise': [typesMap.cro, typesMap.franchise],
            'subfranchise': [typesMap.cro, typesMap.franchise, typesMap.subfranchise],
            'category': [typesMap.cro, typesMap.category],
            'subcategory': [typesMap.cro, typesMap.franchise, typesMap.subfranchise, typesMap.subcategory],
            'supercategory': [typesMap.cro, typesMap.supercategory]

        }[_.isUndefined(leafNode) ? 'cro' : leafNode.type];
    }


    function renderBreadcrumbWithTitle(cfaId, superCategoryId, title, cb) {
        // If we dont have supercategory defined we will use CFA
        var key = superCategoryId || cfaId;

        if (_.isUndefined(key)) {
            console.log('[renderBreadcrumbWithTitle] both CFA Id and Supercategory are missing');
        }

        this.renderDefaultBreadcrumb(key, cb, {
            postProcessData: function (node) {

                node.breadcrumb = _.filter(node.breadcrumb, function (item) {
                    return item.name !== 'home';
                });

                node.pageTitle = title;
                return node;
            },
            template: this.options.templates.categoryBreadcrumb
        });
    }

    function renderBreadcrumbNoTitle(key, cb) {
        this.renderDefaultBreadcrumb(key, cb, {
            postProcessData: function (node) {
                node.breadcrumb = _.filter(node.breadcrumb, function (item) {
                    return item.name !== 'home';
                });

                node.breadcrumb = _.map(node.breadcrumb, function (step) {
                    return sortChildren(step);
                });


                return node;
            },
            template: this.options.templates.categoryBreadcrumb
        });
    }


    /**
     * Render breadcrumb-ed category with data key and target selector DOM node provided provided
     * @param {String} key
     * @param {function} cb
     * @param {object} options
     */
    function renderDefaultBreadcrumb(key, cb, options) {

        this.renderBreadcrumbs(_.merge({
            // We use it to find last node for our chain (breadcrumb)
            leafNodeFinder: function (node) {
                // Avoid undefined keys
                return key && node.productGroupId === key;
            },

            // Pick what parts we need to build an url: /cro/[category|franchise]/index.htm
            linkNodesFilter: defaultLinkNodesFilter,

            // We don't need all of them, so let's filter-out only necessary nodes
            nodesFilter: function (node) {
                return ['cro', 'franchise', 'subfranchise', 'supercategory'].indexOf(node.type) !== -1;
            },

            callback: cb,
            template: this.options.templates.categoryBreadcrumb
        }, options));
    }


    /**
     * Sort franchises according to the map provided
     * @param children
     * @param order
     * @param sortFieldMatcher
     * @returns {object}
     */
    function sortListBy(children, order, sortFieldMatcher) {
        var franchiseExcluded, sorter;

        franchiseExcluded = ['food'];


        sortFieldMatcher = sortFieldMatcher || 'name';

        sorter = _.isString(order) ? order : function (item) {
            return order.indexOf(item[sortFieldMatcher]);
        };


        return _.chain(children)
            .sortBy(sorter)
            .filter(function (item) {
                return franchiseExcluded.indexOf(item.name) === -1 && item.type !== 'hidden';
            })

            .value();
    }


    /**
     * Public method for rendering list of home->franchises
     * @param {function} cb
     */
    function renderFranchises(cb) {
        this.renderSubFranchises('0', cb, {
            leafNodeFinder: function (node) {
                return node.productGroupId === '0';
            },
            template: this.options.templates['franchiseListNoTitle'],
            postProcessData: function (node) {
                node.children = sortListBy(node.children, GlobalNavigation.FRANCHISE_ORDER);

                node = sortChildren(node);

                return node;
            }
        });
    }


    function renderMobileSubFranchises(id, columnSize, cb) {
        this.renderSubFranchises(id, cb, {
            template: this.options.templates.mobileSuperCategoryList,
            postProcessData: function (data) {

                if (_.isUndefined(global.cfaNewsURLs)) {
                    global.cfaNewsURLs = {};
                }

                data = sortChildren(data);

                return {
                    cfaNewsURLs: global.cfaNewsURLs,
                    title: data.title,
                    productGroupId: data.productGroupId,
                    columns: _.chunk(data.children, columnSize)
                }
            }
        });
    }


    function renderMobileFranchises(cb) {
        this.renderSubFranchises('0', cb, {
            leafNodeFinder: function (node) {
                return node.productGroupId === '0';
            },
            template: this.options.templates['mobileFranchiseList']
        });
    }


    function renderMobileIssuesMatter(cb) {
        var data, options;

        data = [
            {
                title: 'End Surprise Medical Bills',
                description: '',
                link: 'http://www.EndSurpriseMedicalBills.org',
                image: '/etc/designs/cr/images/common/surprise_medical_bills.png'
            }, {
                title: 'End Robocalls',
                description: '',
                link: 'http://www.EndRobocalls.org',
                image: '/etc/designs/cr/images/common/robo_call.png'
            }, {
                title: 'Guide to the Volkswagen Emissions Recall',
                description: '',
                link: 'http://www.consumerreports.org/cars/vw-diesel-emissions-recall',
                image: '/etc/designs/cr/images/common/volkswagen-dieselgate-emissions-recall.png'
            }, {
                title: 'What You Need to Know About GMO Labeling',
                description: '',
                link: 'http://www.consumerreports.org/cro/food/gmo-labeling',
                image: '/etc/designs/cr/images/common/gmo-labeling.png'
            }, {
                title: 'The Rise of Superbugs',
                description: '',
                link: 'http://www.consumerreports.org/cro/health/the-rise-of-superbugs/index.htm',
                image: '/etc/designs/cr/images/common/rise-of-superbugs.png'
            }
        ];

        options = {
            data: {issues: data},
            template: this.options.templates['mobileIssuesMatter'],
            callback: cb
        };


        this.render(options);
    }


    /**
     * Produce cars breadcrumb
     * @param {string} state
     * @param {string} year
     * @param {string} title
     * @param {function} cb
     */
    function renderCarsBreadcrumb(state, year, title, cb) {

        var franchiseStep, stateStep;

        franchiseStep = {
            title: 'Cars',
            productGroupId: GlobalNavigation.CARS_FRANCHISE,
            link: 'cro/cars/index.htm',
            type: 'franchise'
        };

        state = state.trim();

        if (state === 'New') {
            stateStep = {
                title: 'New',
                link: 'cro/cars/new-cars/index.htm'
            };
        } else if (state === 'Used') {
            stateStep = {
                title: 'Used',
                link: 'cro/cars/used-cars/index.htm'
            };
        } else if (state === 'Future') {
            stateStep = {
                title: 'Future',
                year: year,
                link: 'cro/cars/new-cars/index.htm'
            };
        }

        this.render({

            data: {
                pageTitle: title,
                breadcrumb: [franchiseStep, stateStep]
            },
            template: this.options.templates.categoryBreadcrumb,
            callback: cb
        });
    }

    function renderHealthBreadcrumb(type, cb) {
        var titles;

        titles = {
            'health-drugs': 'Prescription Drugs & Medications',
            'health-doctors-hospitals': 'Doctors & Hospitals',
            'health-conditions-treatments': 'Conditions & Treatments'
        };

        this.render({

            data: {
                pageTitle: titles[type],
                breadcrumb: [{
                    title: 'Health',
                    productGroupId: GlobalNavigation.HEALTH_FRANCHISE,
                    link: 'cro/health/index.htm',
                    type: 'franchise'
                }]
            },
            template: this.options.templates.categoryBreadcrumb,
            callback: cb
        });
    }


    function renderCarsTypeBreadcrumb(title, cb) {
        var franchiseStep;

        franchiseStep = {
            title: 'Cars',
            productGroupId: GlobalNavigation.CARS_FRANCHISE,
            link: 'cro/cars/index.htm',
            type: "franchise"
        };

        this.render({

            data: {
                pageTitle: title,
                breadcrumb: [franchiseStep]
            },
            template: this.options.templates.categoryBreadcrumb,
            callback: cb
        });
    }


    function renderMobileSuperCategories(id, columnSize, cb) {

        this.renderSubFranchises(id, cb, {
            template: this.options.templates.mobileSuperCategoryList,
            postProcessData: function (data) {
                var items = [], maxColumnItems;

                _.forEach(data.children, function (subFranchise) {
                    _.forEach(subFranchise.children, function (superCat) {
                        items.push(superCat);
                    });
                });


                if (items.length > columnSize) {
                    maxColumnItems = Math.ceil(items.length / 2);
                } else {
                    maxColumnItems = columnSize;
                }

                if (_.isUndefined(global.cfaNewsURLs)) {
                    global.cfaNewsURLs = {};
                }

                items = sortListBy(items, 'pluralName');

                return {
                    cfaNewsURLs: global.cfaNewsURLs,
                    title: data.title,
                    productGroupId: data.productGroupId,
                    columns: _.chunk(items, maxColumnItems)
                }
            }
        });
    }


    function sortChildren(node) {
        var rootNode = makeRootNode({});

        if (node.productGroupId === GlobalNavigation.CARS_FRANCHISE) {
            node.children = sortListBy(node.children, GlobalNavigation.CARS_ORDER);


        } else if (node.name == rootNode.name) {
            node.children = sortListBy(node.children, GlobalNavigation.FRANCHISE_ORDER);

        } else {
            node.children = sortListBy(node.children, GlobalNavigation.DEFAULT_LIST_ORDER);
        }

        return node;
    }


    function titleTransformer(node) {
        return node.pluralName;
    }


    /**
     *
     * @param key
     * @param cb
     * @param options
     */
    function renderSubFranchises(key, cb, options) {

        this.renderBreadcrumbs(_.merge({
            // We use it to find last node for our chain (breadcrumb)
            leafNodeFinder: function (node) {
                return key && node.productGroupId === key && node.type === 'franchise';
            },

            // Pick what parts we need to build an url: /cro/[category|franchise]/index.htm
            linkNodesFilter: defaultLinkNodesFilter,
            postProcess: function (node) {
                if (!node.title) {
                    node.title = titleTransformer(node);
                }

                return sortChildren(node);
            },

            postProcessData: function (data) {
                var cfaNewsItem;

                cfaNewsItem = global.cfaNewsURLs[data.productGroupId];

                if (cfaNewsItem) {
                    data.newsNode = {
                        title: [data.title, 'News'].join(' '),
                        link: cfaNewsItem.news/*.replace(/^\//, '')*/
                    };
                }

                if (lodash.contains([GlobalNavigation.CARS_FRANCHISE, GlobalNavigation.HEALTH_FRANCHISE], data.productGroupId)) {
                    // Unset CFA ID so we use real links and not open CFA Dropdown
                    data.productGroupId = null;

                } else {

                    _.each(data.children, function (subFranchise) {
                        if (!subFranchise.title) {
                            subFranchise.title = titleTransformer(subFranchise);
                        }
                        // For "real" data driven categories we have submenu, so avoid links here.

                        if (subFranchise.type !== 'news') {
                            subFranchise.link = null;
                        }

                        _.each(subFranchise.children, function (subCategory) {
                            if (!subCategory.title) {
                                subCategory.title = titleTransformer(subCategory);
                            }
                        });
                    });
                }

                data = sortChildren(data);

                return data;
            },

            callback: cb,
            template: this.options.templates.franchiseList
        }, options));
    }


    /**
     * Produce linkParts from Node or array of Nodes
     * @param {Array|Object} nodes
     * @returns {string}
     */
    function makeLink(nodes) {
        var linkParts;

        if (!_.isArray(nodes)) {
            nodes = [nodes];
        }


        linkParts = _.reduce(nodes, function (parts, node) {
            var matches, part;
            if (_.isUndefined(node)) {
                return parts;
            }


            if (node.buyingGuideUrl) {
                matches = GlobalNavigation.BUYING_GUIDE_NAME_RE.exec(node.buyingGuideUrl);
                if (matches.length > 0) {
                    part = matches[1];
                }
            } else {
                part = transformURL(node.pluralName);
            }

            parts.push(part);
            return parts;

        }, []);

        return linkParts.join('/') + '.htm';
    }


    function transformURL(str) {
        return str.toLowerCase().replace(/\W+/g, '-');
    }


    /**
     * Method to keep original content to be able to restore if after
     * @param html
     */
    function setOriginalContent(html) {
        this.originalContent = html;
    }


    function getOriginalContent() {
        return this.originalContent;
    }


    function hasCategory(metaFields) {

        var superCat = parseInt(metaFields.superCategoryId);
        var cfaId = parseInt(metaFields.cfaId);

        return superCat > 0 || cfaId > 0;
    }


    GlobalNavigation.prototype.renderBreadcrumbs = renderBreadcrumbs;
    GlobalNavigation.prototype.render = render;

    GlobalNavigation.prototype.renderBreadcrumbNoTitle = renderBreadcrumbNoTitle;
    GlobalNavigation.prototype.renderBreadcrumbWithTitle = renderBreadcrumbWithTitle;
    GlobalNavigation.prototype.renderDefaultBreadcrumb = renderDefaultBreadcrumb;
    GlobalNavigation.prototype.renderCarsBreadcrumb = renderCarsBreadcrumb;
    GlobalNavigation.prototype.renderHealthBreadcrumb = renderHealthBreadcrumb;

    GlobalNavigation.prototype.renderFranchises = renderFranchises;
    GlobalNavigation.prototype.renderMobileFranchises = renderMobileFranchises;
    GlobalNavigation.prototype.renderMobileIssuesMatter = renderMobileIssuesMatter;
    GlobalNavigation.prototype.renderMobileSuperCategories = renderMobileSuperCategories;

    GlobalNavigation.prototype.renderSubFranchises = renderSubFranchises;
    GlobalNavigation.prototype.renderMobileSubFranchises = renderMobileSubFranchises;

    GlobalNavigation.prototype.renderCarsTypeBreadcrumb = renderCarsTypeBreadcrumb;


    GlobalNavigation.prototype.makeLink = makeLink;
    GlobalNavigation.prototype.transformURL = transformURL;
    GlobalNavigation.prototype.hasCategory = hasCategory;

    GlobalNavigation.prototype.setOriginalContent = setOriginalContent;
    GlobalNavigation.prototype.getOriginalContent = getOriginalContent;

    return GlobalNavigation;

}));
/* Start issues that matter js */

window.IssuesMatters = (function ($) {

    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }

    function IssuesMatters(navigationContainer) {
        _classCallCheck(this, IssuesMatters);

        this.button = $('#issues-matter').parents('.global-header-top-nav-item');
        this.container = $('.issuesMatter');
        this.navigationContainer = navigationContainer;
    }

    IssuesMatters.prototype.activeTab = function activeTab(state) {
        state === false ? this.button.removeClass('active') : this.button.addClass('active');
    };

    IssuesMatters.prototype.show = function show(delay) {

        this.container.slideDown(delay);
        this.navigationContainer.hide();

        $('img.issueNav-img, .global-header-issues-that-matters-close img').lazyload({effect: 'fadeIn'});

        this.activeTab();
    };

    IssuesMatters.prototype.hide = function hide(delay) {
        var $this = this;

        this.button.removeClass('active');
        this.container.slideUp(delay);

        $this.navigationContainer.show();
    };

    return IssuesMatters;
})(jQuery);

/* End issues that matter js */

window.ProductReviews = (function (_, $) {

    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }

    function ProductReviews(navigationContainer) {
        _classCallCheck(this, ProductReviews);

        this.navigationContainer = navigationContainer;
        this.container = $('.global-header-nav-cat-menu');
        this.button = $('#product-review').parents('.global-header-top-nav-item');

        this.CFAWrapperSelector = ".global-header-nav-cat-menu";

    }

    ProductReviews.prototype.activeTab = function activeTab(state) {
        state === false ? this.button.removeClass('active') : this.button.addClass('active');
    };

    ProductReviews.prototype.show = function show(id) {

        if (this.id) {
            this.hide(this.id, 0);
        }

        this.id = id;
        this.currentCFAItem = this.container.find('.global-header-cfa-item.cfaId-' + id);
        this.currentCFAItem.addClass('current-cfa');

        this.currentCFAWrapper = $(this.CFAWrapperSelector);
        this.currentCFAContainer = $('.global-header-cfa-item.cfaId-' + id);


        // Markup should be modified to allow slide up/down only container but not an internal tab.
        // if container is hidden then slide it down
        // then switch tabs

        this.currentCFAContainer.show();


        this.activeTab();


        if (!this.isVisible()) {
            //
            this.currentCFAWrapper.css('width', '100%').animate({maxHeight: '999px'}, 700, $.proxy(function () {
                this.currentCFAWrapper.addClass('slide-down');
            }, this));
        }
    };


    ProductReviews.prototype.isVisible = function () {
        return $(this.CFAWrapperSelector).hasClass("slide-down");
    };


    ProductReviews.prototype.close = function close(isActive, cb) {
        var delay = 700;
        this.activeTab(isActive);

        if (this.currentCFAWrapper) {
            //Instant
            if (!isActive) {
                delay = 0;
            }

            this.currentCFAWrapper.animate({maxHeight: '0'}, delay, $.proxy(function () {
                cb && cb();
                this.currentCFAWrapper.css('width', 'auto').removeClass('slide-down');

            }, this));

        }
    };


    ProductReviews.prototype.hide = function hide() {

        if (this.id) {
            this.currentCFAContainer.hide();
            this.currentCFAItem.removeClass('current-cfa');
        }

    };

    ProductReviews.prototype.has = function has(cfaId) {
        return $('.global-header-cfa-item.cfaId-' + cfaId).size();
    };


    return ProductReviews;
})(lodash, jQuery);
/* Start Global header scripts */

/** @namespace {String} metaFields.cfaId */
/** @namespace {String} metaFields.carmodelState */
/** @namespace {String} metaFields.carmodelYear */
/** @namespace {String} metaFields.carTypeId */
/** @namespace {String} metaFields.modelID */
/** @namespace {String} metaFields.pageTitle */
/** @namespace {String} metaFields.pageType */
/** @namespace {String} metaFields.superCategoryId */

(function ($, _, GlobalNavigation, ProductReviews, IssuesMatters) {

    /**
     *   This functionality need to have possibility bind
     *   events even if event was fired before binding.
     *   If event already fired it run callback immediately instead of binding.
     *   It works like '$.ready' event in jQuery.
     */

    if (typeof jQuery.publish !== 'function') {
        console.warn('$.publish init from globalHeader');

        var publishedHistory = {};

        $.publish = function (event) {
            $(document).trigger(event);
            publishedHistory[event] = true;
        };

        $.subscribe = function (event, callback) {
            if (publishedHistory[event]) {
                callback();
            } else {
                $(document).on(event, callback);
            }
        };

    }


    $(function () {

        var globalNav, productReviews, issuesMatters, metaFields;

        var ghNavContainer = $('#global-nav-breadcrumb');

        metaFields = {};

        $('[name^=globalheader]').each(function (idx, field) {
            if (_.isString(field.value) && !_.isEmpty(field.value.trim())) {
                metaFields[_.camelCase(field.name.replace('globalheader-', ''))] = field.value;
            }
        });


        var globalNavConfiguration = {
            apiURL: 'http://api.consumerreports.org',
            apiKey: 'um4aqdv9cm48xvvgsjtvhdta',

            navContainer: ghNavContainer,

            templates: {
                categoryBreadcrumb: 'global-header-container-nav-breadcrumb',
                franchiseList: 'global-header-container-nav-category-titled-list',
                franchiseListNoTitle: 'global-header-container-nav-category-list',
                mobileFranchiseList: 'global-header-container-nav-mobile-franchiseList',
                mobileSuperCategoryList: 'global-header-container-nav-mobile-superCategoryList',
                mobileIssuesMatter: 'global-header-container-nav-mobile-issues-matter'
            }
        };


        productReviews = new ProductReviews(ghNavContainer);
        issuesMatters = new IssuesMatters(ghNavContainer);
        globalNav = new GlobalNavigation(globalNavConfiguration);

        function isAboutUsPage() {
            return (window.location.href.indexOf('/cro/about-us/') !== -1);
        }


        function isIssuesMatter() {
            return lodash.isString(metaFields.pageTitle) && metaFields.pageTitle.indexOf('Issues That Matter') !== -1;
        }

        function highLightTab() {

            resetRedUnderLine();

            if (isIssuesMatter()) {
                issuesMatters.activeTab();

            } else if (isAboutUsPage()) {
                $('#about-us').parent('.global-header-top-nav-item').addClass('active');

            } else {
                productReviews.activeTab();
            }
        }

        function resetRedUnderLine() {
            $('.global-header-top-nav-item').removeClass('active');
        }

        highLightTab();


        function resetCarrot() {
            $('.global-header-sub-franchise-menu li').removeClass('active');
        }

        /**
         * Set 'carrot' symbol to related CFA
         * @param cfaId
         */
        function addCarrot(cfaId) {
            resetCarrot();
            $('.global-header-sub-franchise-menu li[data-cfaid =' + cfaId + ']').addClass('active');
        }


        /**
         *      Type of page/content                Value
         *
         *       Car model pages                    cars-model
         *       Car type page                      cars-type
         *       Product supercategory pages        products-supercategory
         *       Product model pages                products-model
         *       CFA Landing page                   cfa-landing
         *       Health Conditions & treatments     health-conditions-treatments
         *       Health Drugs                       health-drugs
         *       Health Doctors & Hospitals         health-doctors-hospitals
         */


        function renderFranchises(cb) {
            globalNav.renderFranchises(function (html) {
                ghNavContainer.html(html);

                if (!isAboutUsPage() && !isIssuesMatter()) {
                    ghNavContainer.show();
                    highLightTab();
                }

                cb && cb();
            });
        }

        switch (metaFields.pageType) {

            case 'cfa-landing':
                if (globalNav.hasCategory(metaFields) && !isAboutUsPage()) {

                    globalNav.renderSubFranchises(metaFields.cfaId, function (html) {

                        if (!html) {
                            renderFranchises();
                        } else {

                            globalNav.setOriginalContent(html);
                            ghNavContainer.html(html).show(); // Show ready navigation

                            highLightTab();
                        }
                    });

                } else {
                    renderFranchises();
                }

                break;

            case 'articles':
            case 'products-model':
            case 'products-supercategory':

                if (globalNav.hasCategory(metaFields) && !isAboutUsPage()) {

                    globalNav.renderBreadcrumbWithTitle(metaFields.cfaId, metaFields.superCategoryId, metaFields.pageTitle, function (html, data) {

                        if (!metaFields.cfaId && data.breadcrumb[0]) {
                            metaFields.cfaId = data.breadcrumb[0].productGroupId;
                        }

                        addCarrot(metaFields.cfaId);

                        globalNav.setOriginalContent(html);

                        ghNavContainer.html(html).show(); // Show ready navigation
                    });

                } else {
                    renderFranchises();
                }

                break;

            case 'cars-type':

                globalNav.renderCarsTypeBreadcrumb(metaFields.pageTitle, function (html) {
                    metaFields.cfaId = GlobalNavigation.CARS_FRANCHISE;

                    globalNav.setOriginalContent(html);
                    ghNavContainer.html(html).show(); // Show ready navigation
                });

                break;


            case 'cars-model':

                globalNav.renderCarsBreadcrumb(metaFields.carmodelState, metaFields.carmodelYear, metaFields.pageTitle, function (html, data) {
                    metaFields.cfaId = GlobalNavigation.CARS_FRANCHISE;

                    globalNav.setOriginalContent(html);
                    ghNavContainer.html(html).show(); // Show ready navigation
                });

                break;

            case 'health-drugs':
            case 'health-doctors-hospitals':
            case 'health-conditions-treatments':

                globalNav.renderHealthBreadcrumb(metaFields.pageType, function (html) {
                    metaFields.cfaId = GlobalNavigation.HEALTH_FRANCHISE;

                    globalNav.setOriginalContent(html);
                    ghNavContainer.html(html).show(); // Show ready navigation

                });
                break;

            case 'homepage':
            default :
                globalNav.setOriginalContent(ghNavContainer.html());
                ghNavContainer.show();
                highLightTab();

                break;
        }

        $('#product-review').on('click', function () {

            resetRedUnderLine();
            resetCarrot();

            if (!productReviews.isVisible()) {
                issuesMatters.hide(0);

                if (metaFields.cfaId) {

                    renderFranchises(function () {
                        productReviews.show(metaFields.cfaId, 500);
                        addCarrot(metaFields.cfaId);
                    });

                } else {
                    ghNavContainer.show();
                }

                resetRedUnderLine();
                productReviews.activeTab();

            } else {
                closeProductReviews(true);
                highLightTab();
            }

        });


        $('#issues-matter').on('click', function () {
            var $issuesMatterWrap = $('.issues-matter-wrap');

            resetRedUnderLine();

            if ($issuesMatterWrap.is(':hidden')) {

                ghNavContainer.html(globalNav.getOriginalContent());

                productReviews.close(false);
                issuesMatters.show('slow');

                resetRedUnderLine();
                issuesMatters.activeTab();


            } else {

                issuesMatters.hide();
                highLightTab();

                if (isAboutUsPage() || isIssuesMatter()) {
                    ghNavContainer.hide();
                }

                /*else {
                 productReviews.activeTab();
                 }*/

            }

        });


        $(document).on('click', '.global-header-sub-franchise-menu>li', function (e) {
            var popup = $(this).find('.nav-category-popup');
            var href = $(e.target).attr('href');

            // Do not touch real links
            if (e.target.tagName.toLowerCase() === 'a' && href.indexOf('javascript:')) {
                return true;
            }


            if (popup.size()) {
                $('.nav-category-popup').not(popup).hide();
                popup.toggle();

                return false;
            }
        });

        $(document).click(function (e) {
            var containers = $('.global-header-breadcrumb-item, .global-header-search-wrap, .ui-autocomplete, .global-header-account-settings');
            var elementsToHide = $('.nav-category-popup, #global-header-search-box, .global-header-search-icon.submit, .global-header-account-settings');

            if ((!containers.is(e.target) && containers.has(e.target).length === 0) && elementsToHide.filter(':visible').size()) {

                elementsToHide.hide();

                $('.global-header-search-icon.open').show();
                $('.global-header-tab-wrapper').removeAttr('style');
            }
        });


        function closeProductReviews(forceAnimation) {
            var isActive = false;

            if (metaFields.pageType === 'homepage') {
                isActive = true;
            }


            productReviews.close(isActive || !!forceAnimation, function () {
                ghNavContainer.html(globalNav.getOriginalContent());
                resetCarrot();
            });


            if (isAboutUsPage()) {
                ghNavContainer.hide();
            }

            $('.global-header-superCat').find('span').removeAttr('style');

            highLightTab();


            return false;
        }


        $(document).on('click', '.global-header-sub-franchise-menu li[data-cfaid]', function () {
            var cfaId = $(this).attr('data-cfaid');
            var subFranchiseItemName = $(this).find('a').text(),
                subFranchiseThemeColor = $('.cfaId-' + cfaId + ' .global-header-view-all a').css('color'),
                currentCFAserach;


            if ($(this).hasClass('active')) {

                closeProductReviews(true);

            } else {

                // If we have reviews tabs - we show it
                if (productReviews.has(cfaId)) {

                    renderFranchises(function () {
                        addCarrot(cfaId);
                        productReviews.show(cfaId, 500);
                    });


                    currentCFAserach = $('.current-cfa .global-header-superCat > ul > li');

                    currentCFAserach.each(function () {

                        if ($(this).find('span').text() == subFranchiseItemName) {
                            $(this).find('span').css({
                                'border-bottom': '5px solid',
                                'border-bottom-color': subFranchiseThemeColor,
                                'padding-bottom': '3px',
                                'margin-bottom': '12px'
                            });
                        }
                    });

                    return false;
                }
            }

            // Prevent real links of we have tab

            if (productReviews.has(cfaId)) {
                return false;
            }

        });

        $(document).on('click', '.global-header-cfa-item-close', function () {
            closeProductReviews(true);
        });

        $(document).on('click', '.global-header-issues-that-matters-close', function () {

            issuesMatters.hide();

            if (isAboutUsPage() || isIssuesMatter()) {
                ghNavContainer.hide();
            }

            highLightTab();

            return false;
        });

        /*        $(document).on('click', '.global-header-mobile-issues-matter', function () {
         globalNav.renderMobileIssuesMatter(function (html, data) {});

         return false;
         });*/


        /*Take below out when ready*/
        $('.global-header-burger').click(function () {

            // mobileNavigation.showFranchises();

            globalNav.renderMobileFranchises(function (html) {
                $('.global-header-mobile-sub-franchise').html(html);
            });

            $('.global-header-mobile-overlay').css('display', 'block');
            $('.global-header-mobile-container').show('slide', {direction: 'left'}, 500);
        });

        $('.global-header-mobile-close').click(function () {

            //  mobileNavigation.close();


            $('.global-header-mobile-overlay').css('display', 'none');
            $('.global-header-mobile-container').hide('slide', {direction: 'left'}, 500);
            $('.global-header-mobile-superCat').css('display', 'none');
            $('.global-header-mobile-sub-franchise ul li').removeClass('mobile-active');
            $('.global-header-mobile-search-wrap').hide();


            highLightTab();

        });


        function tabletSubListRender(html) {
            var $superCat = $('.global-header-mobile-superCat');
            $superCat.html(html);

            if ($superCat.find('ul').length == 1) {
                $superCat.find('ul').removeClass('col-xs-6');
                $superCat.find('ul').addClass('col-xs-12');
            }
        }

        $(document).on('click', '.global-header-mobile-sub-franchise ul li', function () {

            var productID = $(this).attr('data-mobile-productid');

            if (lodash.contains([GlobalNavigation.CARS_FRANCHISE, GlobalNavigation.HEALTH_FRANCHISE], productID)) {
                globalNav.renderMobileSubFranchises(productID, 22, tabletSubListRender);

            } else {
                globalNav.renderMobileSuperCategories(productID, 22, tabletSubListRender);
            }


            $('.global-header-mobile-sub-franchise ul li').removeClass('mobile-active');
            $(this).addClass('mobile-active');
            $('.global-header-mobile-superCat').css('display', 'block');
            $('.global-header-mobile-cfaId-' + productID + '').css('display', 'block');
        });


        globalNav.renderMobileIssuesMatter(function (html) {
            $('.global-header-mobile-issues-matter').html(html);
        });


        $(document).on('click', '.global-header-mobile-open-product-reviews', function () {

            $(this).parents('.global-header-mobile-content-container').addClass('active');
            $('.global-header-mobile-open-issues').parents('.global-header-mobile-content-container').removeClass('active');

            return false;
        });

        $(document).on('click', '.global-header-mobile-open-issues', function () {

            $(this).parents('.global-header-mobile-content-container').addClass('active');

            $('img.issueNav-img').lazyload({effect: 'fadeIn'});

            $('.global-header-mobile-open-product-reviews').parents('.global-header-mobile-content-container').removeClass('active');
            $('.global-header-mobile-superCat').hide();
            $('.global-header-mobile-sub-franchise').find('li').removeClass('mobile-active');

            return false;
        });


        $('.global-header-search-icon.open').click(function () {
            $('.global-header-tab-wrapper').attr('style', 'display: none !important');
            $(this).hide();
            $(this).next().show();
            $(this).parent().find('input[type=\'text\']').show().focus();
        });

        $('.mobile-search-open').click(function () {
            var $searchWrap = $('.global-header-mobile-search-wrap');

            $searchWrap.show();
            $searchWrap.find('input').focus();
            $(this).hide();
            $(this).next().show();
        });

        $(document).on('click', '.mobile-search-submit', function () {
            document.forms['global-header-mobile-search-form'].submit();
        });

        $(document).on('click', '.global-header-search-icon.submit', function () {
            headerElementsTracking(this);
            document.forms['global-header-search-form'].submit();
        });

        $('.global-header-account-wrap').click(function () {
            $('.global-header-account-settings').toggle();
            return false;
        });

        $('.global-header-account-settings').mouseleave(function () {
            $(this).hide();

            return false;
        });

        $('.global-header-account-btn.subscribe-btn-red').click(function () {
            $('.global-header-subscribe-dropdown').show();
            return false;
        });

        $('.global-header-subscribe-dropdown').mouseleave(function () {
            $(this).hide();
            return false;
        });


        /*Header Search*/
        $.widget('custom.searchAutocomplete', $.ui.autocomplete, {
            _renderItem: function (ul, item) {
                return $('<li>')
                    .attr('data-href', item.target)
                    .append(item.keyword)
                    .appendTo(ul);
            }
        });

        $('#global-header-search-box, #global-header-mobile-search-box').searchAutocomplete({
            source: function (request, response) {
                $.ajax({
                    dataType: 'json',
                    type: 'Get',
                    url: '/etc/designs/cro/application-resources/modules/header/data/typeahead-data.js',
                    success: function (data) {
                        var theaArray = [], theData, theTerm;
                        for (var i = 0; (i < data.length); i++) {
                            theData = data[i].keyword;
                            theTerm = request.term;

                            if (theData.toLowerCase().indexOf(theTerm.toLowerCase()) === 0) {
                                theaArray.push(data[i]);
                            }

                        }

                        response(theaArray);
                    }
                });
            },
            minLength: 3,
            messages: {
                noResults: ''
            },
            select: function (event, ui) {
                var termStr = ui.item.value;

                if (ui.item.target) {
                    document.location.href = ui.item.target;
                } else {
                    document.location.href = '/cro/search.htm?query=' + termStr.split(' ').join('+');
                }
            }

        });


        $(document).on('click', '.socialContainer .more-icons', function () {
            $(this)
                .hide()
                .parent('.socialContainer').find('.hiddenIcons').css('display', 'inline-block');
        });


        $(document).on('click', '.all-issues-link', function () {
            var url = $(this).attr('href');

            if (url) {
                window.location = url;
                return false;
            }
        });


        /*temp fix*/
        $('.mobile-issue-item').click(function () {
            document.location.href = this.href;
        });

        try {
            if (-1 == $('input[name=\'userName\']').val().indexOf('@')) {
                $('input[name=\'userName\']').attr('value', '');
            }
            $('input[name=\'setAutoLogin\']').attr('checked', 'true');
        } catch (e) {
            console.log(e);
        }


    });

    function renderHeaderAccount() {
        var alertChecker = $('ol.alert');

        if (alertChecker.find('li').length > 0) {
            $('.global-header-account-abrev').css({'background-color': 'transparent', 'margin': '-3px 25px 0 0'});
            $('.global-header-account-abrev > span').css('display', 'none');
            $('.global-header-account-abrev').append('<img style=\'margin-top: -8px;\' src=\'/etc/designs/cr/images/common/alert-icon.svg\' />');
            alertChecker.css('display', 'block');
        }

        if (CRUserInfo.hasData() && CRUserInfo.getName()) {
            var firstLetter = CRUserInfo.getName().substring(0, 1);
            $('span', '.global-header-account-abrev').text(firstLetter);
            $('span', '.global-header-account-info').text('Hi - ' + CRUserInfo.getName());

            $('.global-header-subscribe-wrap').css('display', 'none');
            $('.global-header-account-wrap').css('display', 'block');

            if (!CRUserInfo.hasCRO() || !CRUserInfo.hasCRMag()) {

                if (!CRUserInfo.hasCRO()) {
                    $('.global-header-buyCRO', '.global-header-account-settings').show();
                }

                if (!CRUserInfo.hasCRMag()) {
                    $('.global-header-buyCRMag', '.global-header-account-settings').show();
                }

                $('.global-header-renew-subscriptions', '.global-header-account-settings').show();

            }
        } else {
            $('.global-header-subscribe-wrap').css('display', 'block');
        }
    }

    /*Start Account Info*/

    if (CRUserInfo && typeof CRUserInfo.ready === 'function') {
        CRUserInfo.ready().then(renderHeaderAccount);

    } else {
        $(document).on('userInfo_ready', renderHeaderAccount);
    }


    $(document).on('click', '[data-trackPageLink]', function () {
        var tracking = new Function('return ' + $(this).attr('data-trackPageLink'))();

        if (typeof trackPageLink === 'function') {
            trackPageLink.apply(window, tracking);
        }
    });

    /** @namespace window.TRUSTeWidget */
    $(document).on('click', '.TRUSTeWidget_Tab_link', function () {

        if (!window.TRUSTeWidget) {
            $.getScript('//preferences.truste.com/webservices/js?domain=consumersunion.org&type=epref', function () {
                window.TRUSTeWidget.Tab.link();
            });

        } else {
            window.TRUSTeWidget.Tab.link();
        }
        return false;
    });


})(jQuery, lodash, GlobalNavigation, ProductReviews, IssuesMatters);
/* End Global header scripts */
(function ($) {
    $(function () {
        // Submit form if it's ready on Enter
        jQuery(".sign-in-btn-wrap a").removeClass("filled").removeAttr("href");

        $("input", "#sign-in-form").on("keypress", function (e) {
            if (e.keyCode === 13 && $(".sign-in-btn-wrap a").hasClass('filled')) {
                signInSubmit();
            }
        });

        $(".close-sign-in-btn,.sign-in-overlay").on('click touchstart', function () {
            $(".sign-in").hide();
            $("#uz_ft").show();
            return false;
        });

        $(".sign-in-button").on('click touchstart', function () {
            $(".sign-in").show();
            $("#uz_ft").hide();
            return false;
        });
    });
})(jQuery);

window.signInSubmit = function () {
    jQuery("#sign-in-form").submit();
};

window.inputSignIn = function () {
    var loginInput = jQuery(".sign-in-input input")[0],
        passwordInput = jQuery(".sign-in-input input")[1];
    var signInAnchor = jQuery(".sign-in-btn-wrap a");
    if ('' == loginInput.value || '' == passwordInput.value) {
        signInAnchor.removeClass("filled").removeAttr("href");
    } else {
        signInAnchor.addClass("filled").attr("href", "javascript: signInSubmit();");
    }
};

/**
 *  Declare the CUTypeAhead object
 */
if (window.CUTypeAhead == null) {
	window.CUTypeAhead = {
		"activeObj": null,
		"searchTerm": ""
	};
}

/**
 *  Holds the data to be used when displaying typeahead
 */
CUTypeAhead.data = [];

/**
 *  Holds an incrementable ID
 */
CUTypeAhead.counter = 0;

/**
 *  See: http://www.dustindiaz.com/rock-solid-addevent/
 */
CUTypeAhead.addEvent = function(inObject, inType, inFunction)
{
	if (inObject.addEventListener)
	{
		inObject.addEventListener( inType, inFunction, false );
		EventCache.add(inObject, inType, inFunction);
	}
	else if (inObject.attachEvent)
	{
		inObject["e" + inType + inFunction] = inFunction;
		inObject[inType + inFunction] = function() { inObject["e" + inType + inFunction]( window.event ); }
		inObject.attachEvent("on" + inType, inObject[inType + inFunction]);
		EventCache.add(inObject, inType, inFunction);
	}
	else
	{
		inObject["on" + inType] = inObject["e" + inType + inFunction];
	}
};

/**
 *  See: http://www.dustindiaz.com/rock-solid-addevent/
 */
var EventCache = function()
{
	var theListEvents = [];
	return {
		theListEvents : theListEvents,
		add : function(node, sEventName, fHandler){
			theListEvents.push(arguments);
		},
		flush : function()
		{
			var i, theItem;
			for(i = theListEvents.length - 1; i >= 0; i = i - 1)
			{
				theItem = theListEvents[i];
				if(theItem[0].removeEventListener){
					theItem[0].removeEventListener(theItem[1], theItem[2], theItem[3]);
				};
				if(theItem[1].substring(0, 2) != "on"){
					theItem[1] = "on" + theItem[1];
				};
				if(theItem[0].detachEvent){
					theItem[0].detachEvent(theItem[1], theItem[2]);
				};
				theItem[0][theItem[1]] = null;
			};
		}
	};
}();

/**
 *  See: http://www.dustindiaz.com/rock-solid-addevent/
 */
CUTypeAhead.addEvent(window,'unload',EventCache.flush);

/**
 *  Delete all children nodes
 */
CUTypeAhead.clearNode = function(inNode)
{
	while(inNode.hasChildNodes()) inNode.removeChild(inNode.firstChild);
};

CUTypeAhead.requestImage = function(inId, inTag, inType) {
	var theScriptTag = document.createElement("script");
	theScriptTag.setAttribute("type", "text/javascript");
	theScriptTag.setAttribute("charset", "utf-8");
	theScriptTag.setAttribute("id", "script" + inId);
	var tagString = "&path=";
	if(inTag instanceof Array){
		for(var i=0;i<inTag.length;i++)
			tagString += "&tag="+encodeURIComponent(inTag[i]);
	}else{
		tagString = "&tag="+encodeURIComponent(inTag);
	}

	var theHost = "";
	var theDomain =  document.domain;
	var theProtocol = location.protocol;
	if(theDomain!= null && (theDomain.indexOf(".truman.consumer.org")!= -1)){
		theHost = "http://" + "cundpqa18.consumer.org";
	}else if(theDomain!= null && (theDomain.indexOf("ec.consumerreports.org")!= -1)){
		theHost = theProtocol + "//" + "www.consumerreports.org";
	}
	theScriptTag.setAttribute("src", theHost + "/bin/canonicalimage.json?id=" + encodeURIComponent(inId) + "&callback=" + encodeURIComponent("CUTypeAhead.gotImage") + tagString +"&type="+inType);
	var theHead = document.getElementsByTagName("head").item(0);
	theHead.appendChild(theScriptTag);
};

CUTypeAhead.gotImage = function(inId, inPath) {
	var theScript = document.getElementById("script" + inId);
	if (theScript)
	{
		theScript.parentNode.removeChild(theScript);
	}
	var theImage = document.getElementById(inId);
	if (theImage)
	{
		var theHost = "";
		var theDomain =  document.domain;
		var theProtocol = location.protocol;
		if(theDomain!= null && (theDomain.indexOf(".truman.consumer.org")!= -1)){
			theHost = "http://" + "cundpqa18.consumer.org";
		}else if(theDomain!= null && (theDomain.indexOf("ec.consumerreports.org")!= -1)){
			theHost = theProtocol + "//" + "www.consumerreports.org";
		}
		theImage.setAttribute("src", theHost +inPath);
	}
};

CUTypeAhead.getID = function() {
	CUTypeAhead.counter += 1;
	return CUTypeAhead.counter;
};

CUTypeAhead.mouseTrigger = function(e) {
	var theTargets = [];
	var theAlwaysDisplays = [];
	var evt = (e) ? e : window.event;
	var theMatchesOutput = document.getElementById("matches");
	var theSearchElement = document.getElementById("search");
	if (evt.type == "mouseover") {
		CUTypeAhead.clearNode(theMatchesOutput);
		theMatchesOutput.style.display = "none";
		if (theSearchElement.value) {
			var theSearchText = theSearchElement.value.toLowerCase();
			theSearchText = theSearchText.replace(/^\s*/, "").replace(/\s*$/, "");
			if (theSearchText.length >= 3) {
				CUTypeAhead.clearNode(theMatchesOutput);
				CUTypeAhead.searchTerm = theSearchElement.value;
				CUTypeAhead.activeObj = null;
				for (var i = 0; (i < CUTypeAhead.data.length); i++) {
					var theKeyword = CUTypeAhead.data[i].keyword;

					if(!theKeyword)
						continue;
					theKeyword = theKeyword.toLowerCase();

					var theImage = CUTypeAhead.data[i].image;
					var theTarget = CUTypeAhead.data[i].target + "?searchToken=" + theKeyword;
					var theDomain =  document.domain;
					if(theTarget.indexOf("http")==-1){
						if(theDomain!= null && (theDomain.indexOf(".consumer.org")== -1)) {
							theTarget = "http://consumerreports.org" + theTarget;
						}
					}
					var theAlwaysDisplay = CUTypeAhead.data[i].always;
					var theTargetIsDisplayedAlready = false;
					for (var j = 0; (j < theTargets.length); j++) {
						if (theTargets[j] == theTarget) {
							if (!theAlwaysDisplays[j]) {
								theTargetIsDisplayedAlready = true;
								break;
							}
						}
					}
					if (!theTargetIsDisplayedAlready) {
						if (theKeyword.indexOf(theSearchText) == 0) {
							var theID = CUTypeAhead.getID();
							if (CUTypeAhead.data[i].tag)
							{
								var theMatchHTML = "<div class='results-inner-box'><a href='" + theTarget + "' class='product-links' data-track='search_predictive-hero' data-track-title='Search' data-search-keyword='" + theKeyword + "'>" + CUTypeAhead.data[i].keyword + "</a></div>";
								theMatchesOutput.innerHTML += theMatchHTML;
							}
							else
							{
								var theMatchHTML = "<div class='results-inner-box'><a href='" + theTarget + "' class='product-links' data-track='search_predictive-hero' data-track-title='Search' data-search-keyword='" + theKeyword + "'>" +
									"<img id='" + theID + "' src='" + theImage + "' width='95' height='69' title='" + CUTypeAhead.data[i].keyword + "' alt='" + CUTypeAhead.data[i].keyword + "'/>" +
									                                              "<a href='" + theTarget + "' class='product-links' >" + CUTypeAhead.data[i].keyword + "</a></div>";
								theMatchesOutput.innerHTML += theMatchHTML;
							}
							theTargets.push(theTarget);
							theAlwaysDisplays.push(theAlwaysDisplay);
							if (CUTypeAhead.data[i].tag)
							{
								CUTypeAhead.requestImage(theID, CUTypeAhead.data[i].tag, CUTypeAhead.data[i].type);
							}
						}
						if (theTargets.length == 3) {
							break;
						}
					}
				}
			}
		}
	}
	if (theTargets.length > 0) {
		var theViewAllHTML = "<div class='view-search-results-box'><div class='view-search-results'><a href='javascript:void(0);' onclick='CUTypeAhead.submit(this);' data-track='search_typeahead-link' data-track-title='Search'>View all search results for &quot;" + theSearchElement.value + "&quot;</a></div></div>"
		theMatchesOutput.innerHTML += theViewAllHTML;
		theMatchesOutput.style.display = "block";
	}
};

/**
 *  Compare the search box contents to the typeahead data.
 */
CUTypeAhead.keyTrigger = function(e) {
	var theTargets = [];
	var theAlwaysDisplays = [];
	var evt = (e) ? e : window.event;
	var theMatchesOutput = document.getElementById("matches");
	var theSearchElement = document.getElementById("search");
	if (evt.type == "keyup") {
	        if (evt.keyCode == 13) {
                    if ($(CUTypeAhead.activeObj).children(".product-links").size() > 0)
			            $(CUTypeAhead.activeObj).children(".product-links")[0].click();
		}
		if (evt.keyCode != 38 && evt.keyCode != 40) {
			CUTypeAhead.clearNode(theMatchesOutput);
			CUTypeAhead.activeObj = null;
			theMatchesOutput.style.display = "none";
			if (theSearchElement.value) {
				var theSearchText = theSearchElement.value.toLowerCase();
				theSearchText = theSearchText.replace(/^\s*/, "").replace(/\s*$/, "");
				if (theSearchText.length >= 3) {
					CUTypeAhead.searchTerm = theSearchElement.value;
					CUTypeAhead.clearNode(theMatchesOutput);
					for (var i = 0; (i < CUTypeAhead.data.length); i++) {

						var theKeyword = CUTypeAhead.data[i].keyword;

						if(!theKeyword)
							continue;
						theKeyword = theKeyword.toLowerCase();

						var theImage = CUTypeAhead.data[i].image;
						var theTarget = CUTypeAhead.data[i].target + "?searchToken=" + theKeyword;
						var theDomain =  document.domain;
						if(theTarget.indexOf("http")==-1){
							if(theDomain!= null && (theDomain.indexOf(".consumer.org")== -1)) {
								theTarget = "http://consumerreports.org" + theTarget;
							}
						}
						var theAlwaysDisplay = CUTypeAhead.data[i].always;
						var theTargetIsDisplayedAlready = false;
						for (var j = 0; (j < theTargets.length); j++) {
							if (theTargets[j] == theTarget) {
								if (!theAlwaysDisplays[j]) {
									theTargetIsDisplayedAlready = true;
									break;
								}
							}
						}
						if (!theTargetIsDisplayedAlready) {
							if (theKeyword.indexOf(theSearchText) == 0) {
								var theID = CUTypeAhead.getID();
								if (CUTypeAhead.data[i].tag)
								{
									var theMatchHTML = "<div class='results-inner-box'><a  data-track='search_predictive-hero' data-track-title='Search' data-search-keyword='" + CUTypeAhead.data[i].keyword + "' href='" + theTarget
										+ "' class='product-links'>" + CUTypeAhead.data[i].keyword + "</a></div>";
									theMatchesOutput.innerHTML += theMatchHTML;
								}
								else
								{
									var theMatchHTML = "<div class='results-inner-box'><a  data-track='search_predictive-hero' data-track-title='Search' data-search-keyword='" + CUTypeAhead.data[i].keyword + "' href='" + theTarget
										+ "' class='product-links'>" + CUTypeAhead.data[i].keyword + "</a></div>";

									theMatchesOutput.innerHTML += theMatchHTML;
								}
								theTargets.push(theTarget);
								theAlwaysDisplays.push(theAlwaysDisplay);
								if (CUTypeAhead.data[i].tag)
								{
									CUTypeAhead.requestImage(theID, CUTypeAhead.data[i].tag, CUTypeAhead.data[i].type);
								}
							}
							if (theTargets.length == 3) {
								break;
							}
						}
					}
				}
			}
		}
		if (evt.keyCode == 40) {
			var divObjs = document.getElementById("matches").getElementsByTagName("div");
			var resultsObj = [];
			for (i = 0; i < divObjs.length; i++) {
				if (divObjs[i].className == "results-inner-box" || divObjs[i].className == "results-inner-box-active" || divObjs[i].className == "view-search-results-box" || divObjs[i].className == "view-search-results-box-active") {
					resultsObj.push(divObjs[i]);
					if (divObjs[i].className == "results-inner-box-active" || divObjs[i].className == "view-search-results-box-active" ) {
						CUTypeAhead.activeObj = divObjs[i];
					}
				}
			}
			if (CUTypeAhead.activeObj == null && resultsObj.length > 0) {
				CUTypeAhead.activeObj = resultsObj[0];
				if (resultsObj[0].className == "results-inner-box") {
					resultsObj[0].className = "results-inner-box-active";
				}
				if (CUTypeAhead.activeObj.getElementsByTagName("img")[0] === undefined ) {
					document.getElementById("search").value = CUTypeAhead.searchTerm;
				}
				else {
					document.getElementById("search").value = CUTypeAhead.activeObj.getElementsByTagName("img")[0].title;
				}
			}
			else if(CUTypeAhead.activeObj == null && resultsObj.length === 0){
				return;
			}
			else {
				for(j = 0; j < resultsObj.length; j++){
					if(resultsObj[j] == CUTypeAhead.activeObj){
						if (resultsObj[j].className == "results-inner-box-active") {
							resultsObj[j].className = "results-inner-box";
						}
						if (resultsObj[j].className == "view-search-results-box-active") {
							resultsObj[j].className = "view-search-results-box";
						}
						var k = j + 1;
						if (resultsObj[k] !== undefined) {
							if (resultsObj[k].className == "results-inner-box") {
								resultsObj[k].className = "results-inner-box-active";
							}
							if (resultsObj[k].className == "view-search-results-box") {
								resultsObj[k].className = "view-search-results-box-active";
							}
							CUTypeAhead.activeObj = resultsObj[k];
							break;
						}
						else {
							if (resultsObj[0].className == "results-inner-box") {
								resultsObj[0].className = "results-inner-box-active";
							}
							if (resultsObj[0].className == "view-search-results-box") {
								resultsObj[0].className = "view-search-results-box-active";
							}
							CUTypeAhead.activeObj = resultsObj[0];
							break;
						}
					}
				}
				if (CUTypeAhead.activeObj.getElementsByTagName("img")[0] === undefined) {
					document.getElementById("search").value = CUTypeAhead.searchTerm;
				}
				else {
					document.getElementById("search").value = CUTypeAhead.activeObj.getElementsByTagName("img")[0].title;
				}
			}
		}
		if (evt.keyCode == 38) {
			var divObjs = document.getElementById("matches").getElementsByTagName("div");
			var resultsObj = [];
			for (i = 0; i < divObjs.length; i++) {
				if (divObjs[i].className == "results-inner-box" || divObjs[i].className == "results-inner-box-active" || divObjs[i].className == "view-search-results-box" || divObjs[i].className == "view-search-results-box-active" ) {
					resultsObj.push(divObjs[i]);
					if (divObjs[i].className == "results-inner-box-active" || divObjs[i].className == "view-search-results-box-active") {
						CUTypeAhead.activeObj = divObjs[i];
					}
				}
			}
			if (CUTypeAhead.activeObj == null && resultsObj.length > 0) {
				CUTypeAhead.activeObj = resultsObj[0];
				if (resultsObj[0].className == "results-inner-box") {
					resultsObj[0].className = "results-inner-box-active";
				}
				if (resultsObj[0].className == "view-search-results-box") {
					resultsObj[0].className = "view-search-results-box-active";
				}
			}
			else if(CUTypeAhead.activeObj == null && resultsObj.length === 0){
				return;
			}
			else {
				for(j = 0; j < resultsObj.length; j++){
					if(resultsObj[j] == CUTypeAhead.activeObj){
						if (resultsObj[j].className == "results-inner-box-active") {
							resultsObj[j].className = "results-inner-box";
						}
						if (resultsObj[j].className == "view-search-results-box-active") {
							resultsObj[j].className = "view-search-results-box";
						}
						var k = j - 1;
						if (resultsObj[k] !== undefined) {
							if (resultsObj[k].className =="results-inner-box") {
								resultsObj[k].className = "results-inner-box-active";
							}
							if (resultsObj[k].className =="view-search-results-box") {
								resultsObj[k].className = "view-search-results-box-active";
							}
							CUTypeAhead.activeObj = resultsObj[k];
							break;
						}
						else {
							if (resultsObj[(resultsObj.length-1)].className == "results-inner-box"){
								resultsObj[(resultsObj.length-1)].className = "results-inner-box-active";
							}
							if (resultsObj[(resultsObj.length-1)].className == "view-search-results-box"){
								resultsObj[(resultsObj.length-1)].className = "view-search-results-box-active";
							}
							CUTypeAhead.activeObj = resultsObj[(resultsObj.length - 1)];
							break;
						}
					}
				}
				if (CUTypeAhead.activeObj.getElementsByTagName("img")[0] === undefined) {
					document.getElementById("search").value = CUTypeAhead.searchTerm;
				}
				else {
					document.getElementById("search").value = CUTypeAhead.activeObj.getElementsByTagName("img")[0].title;
				}
			}
		}
	}
	if (theTargets.length > 0) {
		var theViewAllHTML = "<div class='view-search-results-box'><div class='view-search-results'><a href='javascript:CUTypeAhead.submit();'>View all search results for &quot;" + theSearchElement.value + "&quot;</a></div></div>"
		theMatchesOutput.innerHTML += theViewAllHTML;
		theMatchesOutput.style.display = "block";
	}
};

CUTypeAhead.submit = function(e)
{
	if(e)
		headerElementsTracking(e);
	document.forms["search-form"].submit();
};

CUTypeAhead.hideMatches = function(inEvent,theMatchesOutput,theTypeAheadDiv)
{
	var theMatchesOutput = document.getElementById("matches");
	var theTypeAheadDiv = document.getElementById("typeahead");

	CUTypeAhead.hideDropdown(inEvent,theMatchesOutput,theTypeAheadDiv);

};

CUTypeAhead.hideDropdown = function(inEvent,theMatchesOutput,theTypeAheadDiv)
{

	var theToElement = null;
	if (inEvent.relatedTarget)
	{
		theToElement = inEvent.relatedTarget;
	}
	else if (inEvent.toElement)
	{
		theToElement = inEvent.toElement;
	}
	var theOriginalToElement = theToElement;
	if (theToElement)
	{
		var theFoundParent = false;
		while (theToElement.parentNode)
		{
			theToElement = theToElement.parentNode;
			if (theToElement == theMatchesOutput || theToElement == theTypeAheadDiv)
			{
				theFoundParent = true;
				break;
			}
		}
		if (theFoundParent === false)
		{
			theMatchesOutput.style.display = "none";
		}
	}
};

CUTypeAhead.keydownTrigger = function(e)
{
	var evt = (e) ? e : window.event;
	var divObjs = document.getElementById("matches").getElementsByTagName("div");
	var resultsObj = [];
	var activeObj;
	for (i = 0; i < divObjs.length; i++) {
		if (divObjs[i].className == "results-inner-box" || divObjs[i].className == "results-inner-box-active") {
			resultsObj.push(divObjs[i]);
			if (divObjs[i].className == "results-inner-box-active") {
				activeObj = divObjs[i];
			}
		}
	}
	if (activeObj === null || resultsObj.length > 0) {
		resultsObj[0].className = "results-inner-box-active";
	}
};

CUTypeAhead.getParameterByName = function(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 *  Attach the event handler to the search box and load the typeahead data.
 */
CUTypeAhead.init = function()
{
	var theSearchElements = document.getElementsByClassName("search");
	var theMatchesDiv = document.getElementById("matches");
	var theTypeAhead = document.getElementById("typeahead");

	CUTypeAhead.initialize(theSearchElements,theMatchesDiv,theTypeAhead);
};

CUTypeAhead.trackKeyDown = function(e){
	var evt = (e) ? e : window.event;
	if (evt.keyCode == 13) {
		headerElementsTracking(evt);
	}
};

CUTypeAhead.initialize = function(theSearchElements,theMatchesDiv,theTypeAhead)
{
	if(theSearchElements.length<1){
		return;
	}
	var theSearchElement = theSearchElements[0];
	if (!theSearchElement || typeof theSearchElement.getAttribute('typeahead') !== 'string' || !theSearchElement.getAttribute('typeahead')) {
		return;
	}
	var bottomSearchElement; //tracking the bottom search on the search page
	if(theSearchElements.length>1){
		bottomSearchElement=theSearchElements[1];
		CUTypeAhead.addEvent(bottomSearchElement,'keydown',function(e){CUTypeAhead.trackKeyDown(e)});
	}
	CUTypeAhead.data = CUTypeAhead.getTypeAheadData(theSearchElement.getAttribute("typeahead"));

	CUTypeAhead.addEvent(theSearchElement,'keyup',CUTypeAhead.keyTrigger); /* if keydown, it won't use the current key in the comparison */
	CUTypeAhead.addEvent(theSearchElement,'mouseover',CUTypeAhead.mouseTrigger); /* if we have already hidden the div by a mouseout, a mouseover will recover it */

	CUTypeAhead.addEvent(theSearchElement,'keydown',function(e){CUTypeAhead.trackKeyDown(e)});
	CUTypeAhead.addEvent(theMatchesDiv,'mouseout',function(e){CUTypeAhead.hideDropdown(e,theMatchesDiv,theTypeAhead)});
	CUTypeAhead.addEvent(theTypeAhead,'mouseout',function(e){CUTypeAhead.hideDropdown(e,theMatchesDiv,theTypeAhead)});
};

/**
 * Retrieve and parse JSON data
 */
CUTypeAhead.getTypeAheadData = function(inURL)
{
    jQuery.ajax({
        dataType: "json",
        url: inURL,
        success: function (data) {
            CUTypeAhead.data = data;
	}
    });

    CUTypeAhead.data = [];
};


jQuery(CUTypeAhead.init);
