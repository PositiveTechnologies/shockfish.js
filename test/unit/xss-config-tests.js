/* global casper: false */

'use strict';

var path = 'http://localhost:9000/tmp/samples/xssprotector/xss-config-tests.html';
            
casper.test.begin('XSS protector config tests', 7, function suite(test) {
    casper.start();

    casper.thenOpen(path + '?' + 'a=alert(1)', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), '', 'Configured parameter was sanitized.');
    });

    casper.thenOpen(path + '?' + 'alert(1)=1', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), 'alert(1)=1', 'Parameter name was not sanitized.');
    });

    casper.thenOpen(path + '?' + 'a=javascript:alert(1)', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), '', 'Configured parameter was not sanitized. Wrong context.');
    });

    casper.thenOpen(path + '?' + 'b=alert(1)', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), '', 'Configured parameter in defined context was sanitized.');
    });
    
    casper.thenOpen(path + '?' + 'c=<svg/onload=alert(1)>', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), 'c=%3Csvg/onload=alert(1)%3E', 'Unsanitized parameter was not sanitized.');
    });

    casper.thenOpen(path + '?' + 'd=<svg/onload=alert(1)>', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), 'd=%3Csvg/onload=alert(1)%3E', 'Unsanitized parameter was not sanitized.');
    });

    casper.thenOpen(path + '?' + 'e=<svg/onload=alert(1)>', function() {
        test.assertEquals(this.evaluate(function() {
            return location.search.substring(1);
        }), 'e=%3Csvg/onload=alert(1)%3E', 'Unconfigured parameter was not sanitized.');
    });

    casper.run(function() {
        test.done();
    });
});
