'use strict';
var through = require('through2'),
    gutil = require('gulp-util'),
    esprima = require('esprima'),
    escodegen = require('escodegen'),
    estraverse = require('estraverse'),
    fs = require('fs');

var PluginError = gutil.PluginError;
var Syntax = estraverse.Syntax;
var code, tree, result;

var PLUGIN_NAME = 'gulp-add-shockfish-config';

function addShockfishConfig(options) {
    var src = options.src;
    var filter = options.filter;
    var cfg;

    if (!src) {
        throw new PluginError(PLUGIN_NAME, 'Missing source config file!');
    } else {
        cfg = fs.readFileSync(src, 'utf-8');
    }

    if (!filter) {
        throw new PluginError(PLUGIN_NAME, 'Filter not defined!');
    }

    function isWafjsDeclaration(node) {
        return node.type === Syntax.VariableDeclaration && node.declarations[0].type === Syntax.VariableDeclarator && node.declarations[0].id.name === 'shockfish';
    }

    function addConfig(tree, cfg) {
        estraverse.replace(tree, {
            // eslint-disable-next-line no-unused-vars
            leave: function(node, parent) {
                if (isWafjsDeclaration(node)) {
                    var added = esprima.parse('shockfish.config = ' + cfg).body[0];
                    parent.body.splice(2, 0, added);
                }
            }
        });
    }

  // Creating a stream through which each file will pass
    return through.obj(function(file, enc, cb) {
        if (file.relative !== filter) {
            return cb(null, file);
        }
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isBuffer()) {
            code = file.contents.toString();
            tree = esprima.parse(code);
            addConfig(tree, cfg);
            result = escodegen.generate(tree);
            file.contents = new Buffer(result);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming is not supported!'));
        }
        cb(null, file);

    });
}
// Exporting the plugin main function
module.exports = addShockfishConfig;
