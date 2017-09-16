const { Trie } = require('./trie.js')

const myTrie = Trie();

myTrie.stringToTrie('I');
myTrie.stringToTrie('<3');
myTrie.stringToTrie('⏣⅀ARNY⏣');
console.log(myTrie.isStringInTrie('I')); // true
console.log(myTrie.isStringInTrie('<3')); // true
console.log(myTrie.isStringInTrie('⏣⅀ARNY⏣')); // true
console.log(myTrie.isStringInTrie('⅀ARNY')); //false