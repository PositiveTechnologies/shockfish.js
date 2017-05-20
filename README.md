# Shockfish.js

`Shockfish.js` is a client-side web application firewall (WAF).
It is a JavaScript module of experimental [Shockfish](https://github.com/PositiveTechnologies/shockfish) web application firewall.

Its main goals are to demonstrate known application security methods and algorithms implemented on a client-side,
help web developers and security engineers better understand the processes of web applications firewalling,
and illustrate some fundomental problems of this technology.

`Shockfish.js` is created for demonstration purposes only and must not be used in production.

## Installation

```
git clone https://github.com/PositiveTechnologies/shockfish.js.git
cd shockfish.js
npm install
gulp
```

When all tests are passed minified and obfuscated version of `shockfish.js` will be placed in a `build` directory.

## Description

### Protectors

At this time `Shockfish.js` protects against DOM-based XSS attacks only.
It parses `location.hash` and `location.search`, and checks them using different [algorithms](http://www.slideshare.net/DenisKolegov/wafjs-how-to-protect-web-applications-using-javascript).

It consists of the following components:

* [Acorn parser](https://github.com/ternjs/acorn)
* [DOMPurify](https://github.com/cure53/DOMPurify)
* [DOMSanitizer](https://github.com/PositiveTechnologies/DOMSanitizer)

## References
1. [Waf.js: How to Protect Web Applications using JavaScript](http://www.slideshare.net/DenisKolegov/wafjs-how-to-protect-web-applications-using-javascript).
