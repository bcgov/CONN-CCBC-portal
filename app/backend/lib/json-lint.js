/** stripped down and customized code from https://github.com/azeemba/eslint-plugin-json/blob/master/src/index.js */
const _ = require('lodash/fp');
const jsonService = require('vscode-json-languageservice');

const jsonServiceHandle = jsonService.getLanguageService({});

const getSignature = (problem) =>
    `${problem.range.start.line} ${problem.range.start.character} ${problem.message}`;

function getDiagnostics(jsonDocument) {
    return _.pipe(
        _.map((problem) => [getSignature(problem), problem]),
        _.reverse, // reverse ensure fromPairs keep first signature occurence of problem
        _.fromPairs
    )(jsonDocument.syntaxErrors);
}

const jsonProcessor={
    process: function (text, fileName) {
        const textDocument = jsonService.TextDocument.create(fileName, 'json', 1, text);
        const parsed = jsonServiceHandle.parseJSONDocument(textDocument);
        const result = getDiagnostics(parsed); 
        const errors = result ? Object.keys(result).map(x=>result[x]) : [];
        return errors;
    }
};

module.exports = {jsonProcessor};