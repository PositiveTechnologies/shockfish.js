/* global casper: false, acorn: false, DOMPurify: false, window: false, location: false */

'use strict';

var path = 'http:/localhost:9000/tmp/samples/sanity/sanity-tests.html';

casper.test.begin('Sanity tests', 9, function suite(test) {

    casper.start();

    casper.thenOpen(path, function() {
        test.assertEquals(this.evaluate(function() {
            return typeof window.DOMPurify;
        }), 'function', 'DOMPurify is accessible');

        test.assertEquals(this.evaluate(function() {
            return DOMPurify.sanitize('<img onerror=1>');
        }), '<img>', 'DOMPurify is ready');

        test.assertEquals(this.evaluate(function() {
            return typeof window.acorn;
        }), 'object', 'Acorn is accessible');

        test.assertEquals(this.evaluate(function() {
            return typeof window.DOMSanitizer;
        }), 'function', 'DOMSanitizer is accessible');

        test.assertEquals(this.evaluate(function() {
            return  acorn.parse('alert(1)').body[0].expression.type;
        }), 'CallExpression', 'Acorn is ready');

    });

    casper.thenOpen(path + '#' + '<svg/onload=alert(1)>', function() {
        test.assertEquals(this.evaluate(function() {
            return location.hash.substring(1);
        }), '', 'XSS in DOM context was detected');
    });

    casper.thenOpen(path + '#' + 'alert(1)', function() {
        test.assertEquals(this.evaluate(function() {
            return location.hash.substring(1);
        }), '', 'XSS in JS context was detected');
    });

    casper.thenOpen(path + '#' + '"onload=alert(1)"', function() {
        test.assertEquals(this.evaluate(function() {
            return location.hash.substring(1);
        }), '', 'XSS in ATTR context was detected');
    });

    casper.thenOpen(path + '#' + 'vbscript:1', function() {
        test.assertEquals(this.evaluate(function() {
            return location.hash.substring(1);
        }), '', 'XSS in URL context was detected');
    });

    casper.run(function() {
        test.done();
    });

});
