var parse           =  require('parse-base64vlq-mappings');
var convert         =  require('convert-source-map');
var createGenerator =  require('inline-source-map');

exports.create = function create() {
    var generator;

    function addGeneratedMap(sourceFile, source, offset) {
        generator.addGeneratedMappings(sourceFile, source, offset);
        generator.addSourceContent(sourceFile, source);
    }

    function addExistingMap(sourceFile, source, existingMap, offset) {
        var mappings = parse(existingMap.mappings); 
        var originalSource = existingMap.sourcesContent[0];

        // TODO: use original file name here
        generator.addMappings(sourceFile, mappings, offset);
        generator.addSourceContent(sourceFile, originalSource);
    }

    function resolveMap(source) {
        var gen = convert.fromSource(source);
        return gen ? gen.toObject() : null;
    }

    function hasInlinedSource(existingMap) {
        return existingMap.sourcesContent && !!existingMap.sourcesContent[0];
    }

    function addMap(row, lineno) {
        generator = generator || createGenerator({ sourceRoot: row.sourceRoot });
        var offset = { line: lineno, column: 0 };

        var existingMap = resolveMap(row.source);

        return existingMap && hasInlinedSource(existingMap)
            ? addExistingMap(row.sourceFile, row.source, existingMap, offset)
            : addGeneratedMap(row.sourceFile, row.source, offset);
    }

    function comment() {
        return generator.inlineMappingUrl();
    }

    return { addMap: addMap, comment: comment };
};

exports.removeComments = function (src) {
    return src.replace(convert.commentRegex, '');
};

