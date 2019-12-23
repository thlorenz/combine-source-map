'use strict';

const convert      =  require('convert-source-map');
const combine      =  require('..');

const fooComment = '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9vLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Q0FBQTtDQUFBLENBQUEsQ0FBQSxJQUFPLEdBQUs7Q0FBWiIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKHJlcXVpcmUgJy4vYmFyLmpzJylcbiJdfQ==';
const barComment = '//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Q0FBQTtDQUFBLENBQUEsQ0FBQSxJQUFPLEdBQUs7Q0FBWiIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKGFsZXJ0ICdhbGVydHMgc3VjaycpXG4iXX0=';

const fooFile = {
    source: '(function() {\n\n  console.log(require(\'./bar.js\'));\n\n}).call(this);\n' + '\n' + fooComment
  , sourceFile: 'foo.js'
};
const barFile = {
    source: '(function() {\n\n  console.log(alert(\'alerts suck\'));\n\n}).call(this);\n' + '\n' + barComment
  , sourceFile: 'bar.js'
};

const offset = { line: 2 };

const map = combine.create('bundle.js');
await map.addFile(fooFile, offset)
await map.addFile(barFile, { line: offset.line + 8 })
var base64 = map.base64();

const sm = convert.fromBase64(base64).toObject();
console.log(sm);
