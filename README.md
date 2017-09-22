## Overview
#### The Trie

[![Doubly_Linked_List_Radix_Tree](https://i.imgur.com/T7ezka6.png)](https://en.wikipedia.org/wiki/Trie#Implementation_strategies)

Our trie is implemented as a doubly linked list as illustrated above. The above trie is the precise result of adding the words ["as", "at", "s" , "dad"] to our trie in the order presented here. The first accessible node in our trie is the "SuperRoot" node. From this SuperRoot node, we can traverse our way to every other node in the trie.

#### Node Relationships
Every node has two references to two other nodes in the trie. One of these references points to a "child" node. The other reference points to a "sibling" node.

All vertically oriented arrows in our diagram above indicate a "parent"-"child" relationship between nodes (i.e. the node labeled **Root** is a child of the node labeled **SuperRoot** and the node numbered **2** is a child of the node numbered **1**).

All horizontally oriented arrows indicate a sibling-to-sibling relationsihp between nodes (i.e. the nodes numbered **2**,**3**, and **4** all have a sibling relationship; however, with respect to nodes **5**, **6**, and **7**, only nodes **5** and **6** are siblings).

Finally, for any nodes x and y where x is the parent of y, any sibling of y is also a child of x.

#### Trie Traversal
As mentioned above, the diagram above illustrates the result of adding the words [“as”, “at”, “s” , “dad”] to our trie in that precise order.

Finding a word stored in such a trie involves identifying path illustrating a direct parent-child lineage between the Root node and a node that represents the end of a word (i.e. a green node). In our above trie diagram, one such path is the following:

    [ Node 1, Node 4, Node 7, Node 8]

which tells us that our trie holds the word "dad". 

How is that so (given that there is no single arrow indicating that Node 4 is a child of Node 1)? As mentioned previously, because Node 1 is the parent of Node 2 and Node 2 is a sibling of Node 4, we conclude that Node 4 is a child of Node 1. We construct the word from the aforemention node path by (1) replacing every node number in the path with the unicode symbol that the node holds (note: Node 1 effectively holds an empty string) and (2) combining the unicode symbols into a single string. Thus, the path [ Node 1, Node 4, Node 7, Node 8] translates to the ['', 'd', 'a', 'd'] which becomes the string 'dad'.

#### The Succinct Trie

// to be completed

## Getting Started
* [Installing Node.js]
* [Getting Started with npm]


1) Clone Repository
2) `$ cd` into your cloned repo
3) `$ npm i`
4) `$ node examples/usage.js` to see the unicode radix tree in action

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Installing Node.js]: <https://nodejs.org/en/download/>
   [Getting Started with npm]: <https://docs.npmjs.com/getting-started/installing-node/>
