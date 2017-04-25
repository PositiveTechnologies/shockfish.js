/* global shockfish: false, DOMSanitizer: false */
(function() {
    'use strict';

    // Check whether this browser supports shockfish and DOMsanitizer.
    if (!DOMSanitizer.isSupported || !shockfish.isSupported()) {
        return;
    }
    // Save references.
    var getInjectionContext = DOMSanitizer.getInjectionContext;
    var location = window.location;
    var _addToSet = shockfish.addToSet;
    var indexOf = Array.prototype.indexOf;

    /* Sources that should be sanitized by default. */
    var sanitizedSources = _addToSet({}, ['properties']);

    /* Sanitized sources by default. */
    var sanitizedProperties = ['location.hash', 'location.search', 'location.pathname'];

    /* Listeners enabled by default. */
    var listeners = _addToSet({}, []);

    /* Sanitized parameters defined explicitly. */
    var sanitizedParameters = null;

    /* Contexts enabled by default. */
    var contexts = ['URL', 'ATTR', 'JS', 'DOM'];
    
    /* Unsanitized parameters. Sanitize all parameters by default. */
    var unsanitizedParameters = null;

    /* Decide if parameters names should be sanitized. */
    var sanitizeParametersNames = true;

    /* Publish reports. */
    var isReported = true;

    /* Block attack. */
    var isBlocked = true;

    /* Parse options. */
    var _parseOptions = function(options) {
        if (typeof options !== 'object') {
            return;
        }
        
        if (options.contexts) {
            contexts = options.contexts;
        }
        
        if (options.listeners) {
            listeners = _addToSet({}, options.listeners);
        }
        
        if (options.sanitizedSources) {
            sanitizedSources = _addToSet({}, options.sanitizedSources);
        }
        
        if (options.sanitizedProperties) {
            sanitizedProperties = options.sanitizedProperties;
        }

        if (options.sanitizedParameters && options.sanitizedParameters.length > 0) {
            sanitizedParameters = _addToSet({}, options.sanitizedParameters);
        }

        if (options.unsanitizedParameters) {
            unsanitizedParameters = _addToSet({}, options.unsanitizedParameters);
        }
        
        // Default true.
        isBlocked = options.mode.block !== false;

        // Default true.
        isReported = options.mode.report !== false;
    };

   
    /**
     * _getURLParams
     *
     * @param Search string, beginning with '?'.
     *     For example: '?a=1&b=2'
     * @return Array of URL param objects.
     */
    var _getURLParams = function(search) {
        var params = [];
        var rawParams = search.substring(1).split('&');
        var param, index, name, value;

        for (var i = 0, len = rawParams.length; i < len; i++) {
            param = rawParams[i];
            index = param.indexOf('=');
            
            switch (true) {

                // Name and value are defined.
                // For example: ?a=1&b=2.
                case index > 0 :
                    name = param.substring(0, index);
                    value = param.substring(index + 1);
                    break;

                // Value is undefined.
                // For example: ?a&b.
                case index === -1 :
                    name = param;
                    value = '';
                    break;

                // Name  is undefined.
                // For example: ?=11111111&=2
                case index === 0 :
                    name = '';
                    value = param.substring(index + 1);
                    break;
                
                default:
                    break;
            }

            params.push({
                name: name,
                value: value,
                denied: false
            });
        }

        return params;
    };


    /**
     * _urlParamsToString
     *
     * @param Array of URL objects.
     * @return Location search string.
     */
    var _urlParamsToString = function(params) {
        var search = '';
        var node, name, value;
        for (var i = 0, len = params.length; i < len; i++) {
            node = params[i];
            if (node.denied) {
                continue;
            }
            search += '&';
            name = node.name;
            value = node.value;
            if (name && value) {
                search += name + '=' + value;
            } else if (name) {
                search += name;
            } else if (value) {
                search += '=' + value;
            }
        }

        if (search[0] === '&') {
            search = search.substring(1);
        }

        if (search !== '') {
            search = '?' + search;
        }

        return search;
    };

    
    var _sanitizeLocationProperties = function() {
        var wasSanitized = false;
        var loc = location;
        var contexts;
        var pathname = loc.pathname, search = loc.search, hash = loc.hash;
        var newLocation = '';
        var name = '', value = '';
        var params, param;
        var events = [];
        var injection = null;

        /* Pathname sanitization callback. */
        var _sanitizePathname = function(pathname) {
            injection = getInjectionContext(pathname, {CONTEXTS: contexts});
            if (injection) {
                events.push({
                    source: 'location.pathname',
                    value: injection.normalizedInput,
                });
                wasSanitized = true;
                return '';
            }
            return pathname;
        };

        if (indexOf.call(sanitizedProperties, 'location.pathname') !== -1) {
            pathname = pathname.replace(/[^\/]+/g, _sanitizePathname);
            pathname = pathname.replace(/\/{1,}/g, '/');
        }

        if (search !== '' && indexOf.call(sanitizedProperties, 'location.search') !== -1) {
            params = _getURLParams(search);
            for (var i = 0, len = params.length; i < len; i++) {
                param = params[i];
                name = param.name;
                value = param.value;

                if (name) {
                    // Skip unsanitized parameter.
                    if ((unsanitizedParameters && unsanitizedParameters[name]) ||
                            (sanitizedParameters && !sanitizedParameters[name])) {
                        continue;
                    }

                    // Sanitize name, if needed.
                    if (sanitizeParametersNames) {
                        injection = getInjectionContext(name, {CONTEXTS: contexts});
                    }
                }

                // Sanitize value.
                if (!injection && value) {
                    injection = getInjectionContext(value, {CONTEXTS: contexts});
                }

                if (injection) {
                    wasSanitized = true;
                    param.denied = true;
                    
                    events.push({
                        source: 'location.search',
                        name: name,
                        value: value,
                    });
                }
            }
            search = _urlParamsToString(params);
        }
            
        if (hash !== '' && indexOf.call(sanitizedProperties, 'location.hash') !== -1) {
            injection = getInjectionContext(hash.substring(1), {CONTEXTS: contexts});
            if (injection) {
                wasSanitized = true;
                events.push({
                    source: 'location.hash',
                    value: hash
                });
                hash = '';
            }
        }

        if (wasSanitized) {
            newLocation = loc.protocol + '//' + loc.host + pathname + search + hash;
            _onNotify('locationsanitized', {
                events: events,
                clean: newLocation
            });
        }

    };
    
    var _onNotify = function(event, data) {
        var message, source;
        if (typeof data !== 'object') {
            return;
        }
        
        switch (event) {
            case 'hashsanitized':
                message = 'DOM XSS Source: location.hash; Value: ' + data.value;
                break;
            case 'locationsanitized':
                var events = data.events, onevent;
                for (var i = events.length;  i--;) {
                    onevent = events[i];
                    source = onevent.source;
                    switch (source) {
                        case 'location.search':
                            message = 'DOM XSS Source:' + source + '; Key: ' + onevent.name + '; Value: ' + onevent.value;
                            break;
                        case 'location.pathname':
                            message = 'DOM XSS Source:' + source + '; Value: ' + onevent.value;
                            break;
                        case 'location.hash':
                            message = 'DOM XSS Source: location.hash; Value: ' + event.value;
                            break;
                        default:
                    }
                }
                break;
            default:
        }

        if (isBlocked) {
            if (typeof history.replaceState === 'function') {
                history.replaceState({foo: 'bar'}, '', data.clean);
            } else {
                location.href = data.clean;
            }
        }
        
        if (isReported) {
            // Do not report a message that has been already reorted.
            shockfish.publish({
                'event': 'dom_xss_attack',
                'data': message
            });
            
        }
    };


    /* Callback for hashchange event data sanitization. */
    var _sanitizeHashchangeCb = function(e) {
        // Get url via HashChangeEvent or location.hash. Thanks to Internet Explorer.
        // https://developer.mozilla.org/ru/docs/Web/Events/hashchange
        var url = e.newURL || location.hash;
        var edge = url.indexOf('#');
        var hash = url.substring(edge + 1);
        var locationWithoutHash = url.substring(0, edge);
        var injection = getInjectionContext(hash, {CONTEXTS: contexts});
        if (injection) {
            _onNotify('hashsanitized', {
                value: hash,
                clean: locationWithoutHash
            });
        }
    };


    /* Sanitize data on a hashchange event. */
    var _addHashchangeListener = function() {
        shockfish.on(window, 'hashchange', _sanitizeHashchangeCb);
    };

    /* Main part. */
    var options = shockfish.config['xssprotector'];

    if (options.debug) {
        console.log('Schockfish XSS Protector has been loaded.');
    }

    var XSSProtector = {};

    XSSProtector.run = function(options) {
        _parseOptions(options);

        if (sanitizedSources.properties) {
            _sanitizeLocationProperties();
            // sanitize location.hash only if 'onhachchange' event is set and 'location.hash' should be sanitized.
            if (listeners.onhashchange && indexOf.call(sanitizedProperties, 'location.hash') !== -1) {
                _addHashchangeListener();
            }
        }
        
    };

    /* Perform sanitization in loading state  */
    XSSProtector.run(options);

}());
