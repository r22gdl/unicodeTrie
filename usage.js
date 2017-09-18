/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0, max-len: 0, no-console: 0*/
const Bytepack = require('./bytepack.js');
const { Trie } = require('./trie.js');
const { Base64SuccinctTrie } = require('./succinctTrie.js');

const myTrie = Trie();

myTrie.addStringToTrie('I');
myTrie.addStringToTrie('<3');
myTrie.addStringToTrie('⏣⅀ARNY⏣');


console.log(myTrie.isStringInTrie('I')); // true
console.log(myTrie.isStringInTrie('<3')); // true
console.log(myTrie.isStringInTrie('⏣⅀ARNY⏣')); // true
console.log(myTrie.isStringInTrie('⅀ARNY')); //false
console.log('\n');

const bitArray = myTrie.trieToBitArray();
const base64String = Bytepack.bitArrayToBase64String(bitArray);
const unicodeSymbolString = myTrie.trieToSymbolString();
const expandedUnicodeSymbolArray = Bytepack.unicodeSymbolsToExpandedByteArray(unicodeSymbolString);
const positionsOfZeros = myTrie.getPositionsOfZerosInTrie();
const nodeNumbersThatDenoteWords = myTrie.getNodesThatDenoteWords();

// Note: positionsOfZeros is a data structure that, together with the select() method mentioned
// in Steve Havnov's post, helps implement the Base64SuccinctTrie.isStringInSuccinctTrie() method

const mySuccintTrie = Base64SuccinctTrie(base64String, expandedUnicodeSymbolArray, positionsOfZeros, nodeNumbersThatDenoteWords);

console.log(mySuccintTrie.isStringAWordInSuccintTrie('<')); // false
console.log(mySuccintTrie.isStringAWordInSuccintTrie('⏣⅀ARNY⏣')); // true
console.log(mySuccintTrie.isStringAWordInSuccintTrie('⏣⅀ARNY♛')); // false
