const SMConsumer = require('source-map').SourceMapConsumer;

/**
 * @name mappingsFromMap
 * @function
 * @param map {Object} the JSON.parse()'ed map
 * @return {Array} array of mappings
 */
module.exports = async (map) => {
  const consumer = await new SMConsumer(map);
  const mappings = [];

  consumer.eachMapping((mapping) => {
    // only set source if we have original position to handle edgecase (see inline-source-map tests)
    mappings.push({
      original: mapping.originalColumn != null ? {
        column: mapping.originalColumn
      , line: mapping.originalLine
      } : undefined
    , generated: {
        column: mapping.generatedColumn
      , line: mapping.generatedLine
      }
    , source: mapping.originalColumn != null ? mapping.source : undefined
    , name: mapping.name
    });
  });

  consumer.destroy();

  return mappings;
}
