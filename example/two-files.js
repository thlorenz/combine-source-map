'use strict';

const convert      =  require('convert-source-map');
const combine      =  require('..');

const foo = {
  version        :  3,
  file           :  'foo.js',
  sourceRoot     :  '',
  sources        :  [ 'foo.coffee' ],
  names          :  [],
  mappings       :  ';AAAA;CAAA;CAAA,CAAA,CAAA,IAAO,GAAK;CAAZ',
  sourcesContent :  [ 'console.log(require \'./bar.js\')\n' ] };

const bar = {
  version        :  3,
  file           :  'bar.js',
  sourceRoot     :  '',
  sources        :  [ 'bar.coffee' ],
  names          :  [],
  mappings       :  ';AAAA;CAAA;CAAA,CAAA,CAAA,IAAO,GAAK;CAAZ',
  sourcesContent :  [ 'console.log(alert \'alerts suck\')\n' ] };


const fooComment = convert.fromObject(foo).toComment();
const barComment = convert.fromObject(bar).toComment();

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
await map.addFile(fooFile, offset);
await map.addFile(barFile, { line: offset.line + 8 });
const base64 = map.base64();

const sm = convert.fromBase64(base64).toObject();
console.log('Combined source maps:\n', sm);
console.log('\nMappings:\n', sm.mappings);
