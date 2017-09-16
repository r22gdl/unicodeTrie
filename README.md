# unicodeTrie
Methods to produce a searchable, compact trie (ie radix tree) for unicode symbols

## Getting Started
_assuming you have node installed_ : )

1) Clone Repository
2) cd into your cloned repo
3) `$ npm i`
4) `$ node usage.js` to see the unicode radix tree in action


## Overview

Our radix tree can be compacted into a "succinct data structure" as suggested by Steve Havnov on his post: https://web.archive.org/web/20110504064022/http://stevehanov.ca/blog/index.php?id=120 Our radix tree, much like other normal radix tree, is a directed graph of nodes. Each node holds a single unicode character in addition to holding public variables that point to other nodes in the graph.

According to Steve Havnov's post, we compact this graph into an array of 0s and 1s that convey the parent-child relationships between the nodes in the graph. This array of 0s and 1s is further compacted by encoding every sequence of 6 digits in the aforementioned "bit array" into one of 64 characters. This resulting "BASE64" string (effectively a succinct trie which we'll call `base64SuccinctTrie`) still holds the same information about parent-child relationships between nodes as the original radix tree. We then create a structure to hold only the unicode symbols stored in the trie. This second data structure supplements the information about relationships between nodes in the graph. We use both data structures in conjunction to navigate between nodes, child nodes, and sibling nodes much like we would navigate a radix tree.


To translate our trie (ie radix tree) into a `base64SuccinctTrie`, we must perform the following procedure

[Step 1] `const myTrie = Trie();` <br />
[Step 2] `const trieBitArray = myTrie.trieToBitArray();` <br />
[Step 3] `const base64SuccinctTrie = bytepack.bitArrayToBase64String(trieBitArray);` <br />

We create the accompanying data structure that holds the unicodeSymbols in the trie inserted in level order by doing the following

[Step 4] `const UnicodeSymbolArray = myTrie.trieToUnicodeSymbolArray();`

Rather than a string, this second data structure that holds all the unicode symbols in the trie is implemented as an array.

Unicode symbols vary from one two three bytes in length. Navigating through symbols in a string requires the extra work of the start and end of a symbol. To avoid this extra work, we instead append extra bytes to every symbol such that every unicode symbol in our array is represented by 5 bytes. These extra bytes also store information about whether a symbol denotes the end of a 'word' in our trie.
