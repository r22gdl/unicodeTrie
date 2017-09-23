/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0, max-len: 0, no-console: 0*/
const Bytepack = require('../bytepack.js');
const { Trie } = require('../trie.js');
const { Base64SuccinctTrie } = require('../succinctTrie.js');

const myTrie = Trie();

myTrie.addStringToTrie('I');
myTrie.addStringToTrie('<3');
myTrie.addStringToTrie('⏣⅀ARNY⏣');

const mySuccintTrie = Base64SuccinctTrie(myTrie.getSuccinctTrieInformation());

console.log(mySuccintTrie.isStringAWordInTrie('<')); // false
console.log(mySuccintTrie.isStringAWordInTrie('')); // true
console.log(mySuccintTrie.isStringAWordInTrie('⏣⅀ARNY⏣')); // true
console.log(mySuccintTrie.isStringAWordInTrie('⏣⅀ARNY⏣♛♛♛♛♛')); // false
console.log('\n');

console.log(mySuccintTrie.getWordsThatStartWithPrefix('')); // ['', 'I', '<3', '⏣⅀ARNY⏣' ]
console.log(mySuccintTrie.getWordsThatStartWithPrefix('<')); // ['<3']

