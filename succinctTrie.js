/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0, max-len: 0 */
const Bytepack = require('./bytepack.js');

const stringToSymbolArray = function _stringToSymbolArray(str) {
  return str.split('');
};

const symbolArrayToString = function _symbolArrayToString(arr) {
  let str = '';
  arr.forEach((symbol) => {
    str += symbol;
  });

  return str;
};

const removeLastSymbol = function _removeLastSymbol(someString) {
  const symbolArray = stringToSymbolArray(someString);
  const symbolArrayWithoutLastSymbol = symbolArray.slice(0, symbolArray.length - 1);
  return symbolArrayToString(symbolArrayWithoutLastSymbol);
};

/************************************ CONSTRUCTOR *********************************************/

function Base64SuccinctTrie(someBase64String, someExpandedUnicodeArray, someZeroPositions, someNodeNumbersThatDenoteWords) {
  const base64String = someBase64String;
  const expandedUnicodeArray = someExpandedUnicodeArray;
  const zeroPositions = someZeroPositions;
  const nodesThatDenoteWords = someNodeNumbersThatDenoteWords;

  // returns the number of zeros present in base64String before the char at the given index
  const getNumZerosBeforeCharIndex = function _getNumZerosBeforeCharIndex(index) {
    let iter = 0;
    while (zeroPositions[iter] < index) {
      iter += 1;
    }
    return iter;
  };

  const getPosOfNthZeroInChar = function _getPosOfNthZeroInChar(numberOfZerosBeforeChar, characterBitArray, n) {
    let counter = 0;
    let sum = numberOfZerosBeforeChar;
    while (counter < characterBitArray.length && sum < n) {
      if (characterBitArray[counter] === 0) {
        sum += 1;
      }
      counter += 1;
    }
    return counter;
  };

  // returns index of nth zero
  const select = function _select(n) {
    const charIndex = zeroPositions[n];
    const char = base64String.charAt(charIndex);
    const charBitArray = Bytepack.getBitArray(char);
    const numZerosBeforeChar = getNumZerosBeforeCharIndex(charIndex);
    const posOfNthZeroInChar = getPosOfNthZeroInChar(numZerosBeforeChar, charBitArray, n); // 1 thru 6
    const indexOfNthZeroInBase64Str = ((charIndex * Bytepack.byteWidth) - 1) + posOfNthZeroInChar;

    return indexOfNthZeroInBase64Str;
  };

  const getNumChildren = function _getNumChildren(nodeNumber) {
    return (select(nodeNumber + 2) - select(nodeNumber + 1)) - 1;
  };

  const nodeNumberToUnicodeSymbol = function _nodeNumberToUnicodeSymbol(nodeNumber) {
    if (nodeNumber === 0) { return ''; } // rootNode should return empty string ie no symbol
    return Bytepack.expandedByteArrayToUnicodeSymbol(
      expandedUnicodeArray.slice(
        (nodeNumber * Bytepack.bytesPerSymbol),
        (nodeNumber * Bytepack.bytesPerSymbol) + Bytepack.bytesPerSymbol));
  };

  const getNthChildOfNodeNumber = function _getNthChildOfNodeNumber(nodeNumber, childNumber) {
    // NodeNumber of  = (select(i + 1) - i);
    const nodeNumberOfChild = (select(nodeNumber + 1) - nodeNumber) + (childNumber - 1);
    return nodeNumberOfChild;
  };

  const nodeNumberDenotesWord = function _nodeNumberDenotesWord(nodeNumber) {
    /*
    The find() method returns the value of the first element in the array that
    satisfies the provided testing function. Otherwise undefined is returned.
    **/
    const found = nodesThatDenoteWords.find(element => element === nodeNumber);
    if (found === undefined) {
      return false;
    }
    return true;
  };

  const walkThroughTrie = function _walkThroughTrie(myClosure) {
    let nthChild;
    let someParent = 0; // rootNode number is 0
    myClosure.startForwardWalking(someParent);
    while (myClosure.keepForwardWalking() === true) {
      let counter = 1;
      const numberOfChildren = getNumChildren(someParent);
      myClosure.startSidewaysWalking();
      while ((counter <= numberOfChildren) && (myClosure.keepSidewaysWalking() === true)) {
        nthChild = getNthChildOfNodeNumber(someParent, counter);
        myClosure.update(nthChild);
        counter += 1; // side step
      }

      someParent = nthChild; // forward step
    }
  };

  const isStringAWordInTrieClosure = function _isStringAWordInTrieClosure(someString) {
    let matchSymbolToNode;
    let symbolArray = stringToSymbolArray(someString);
    let lastNodeVisited;

    const startForwardWalking = function _startForwardWalking(someNode) {
      matchSymbolToNode = true;
      lastNodeVisited = someNode;
    };

    const keepForwardWalking = function _keepForwardWalking() {
      return ((matchSymbolToNode === true) && (symbolArray.length > 0));
    };

    const startSidewaysWalking = function _startSidewaysWalking() {
      matchSymbolToNode = false;
    };

    const keepSidewaysWalking = function _keepSidewaysWalking() {
      return (matchSymbolToNode === false);
    };

    const update = function _update(nodeNumber) {
      if ((nodeNumberToUnicodeSymbol(nodeNumber) === symbolArray[0])) {
        matchSymbolToNode = true;
        lastNodeVisited = nodeNumber;
        symbolArray = symbolArray.slice(1);
      }
    };

    const getReturnValue = function _getReturnValue() {
      return ((symbolArray.length === 0) && (nodeNumberDenotesWord(lastNodeVisited) === true));
    };

    return {
      startForwardWalking,
      keepForwardWalking,
      startSidewaysWalking,
      keepSidewaysWalking,
      update,
      getReturnValue,
    };
  };

  const isStringAWordInTrie = function _isStringAWordInTrie(someString) {
    const myClosure = isStringAWordInTrieClosure(someString);
    walkThroughTrie(myClosure);
    return myClosure.getReturnValue();
  };

  const getSubtrieAtClosure = function _getSubtrieAtClosure(someString) {
    let matchSymbolToNode;
    let symbolArray = stringToSymbolArray(someString);
    let lastNodeVisited;

    const startForwardWalking = function _startForwardWalking(someNode) {
      matchSymbolToNode = true;
      lastNodeVisited = someNode;
    };

    const keepForwardWalking = function _keepForwardWalking() {
      return ((matchSymbolToNode === true) && (symbolArray.length > 0));
    };

    const startSidewaysWalking = function _startSidewaysWalking() {
      matchSymbolToNode = false;
    };

    const keepSidewaysWalking = function _keepSidewaysWalking() {
      return (matchSymbolToNode === false);
    };

    const update = function _update(nodeNumber) {
      if ((nodeNumberToUnicodeSymbol(nodeNumber) === symbolArray[0])) {
        matchSymbolToNode = true;
        lastNodeVisited = nodeNumber;
        symbolArray = symbolArray.slice(1);
      }
    };

    const getReturnValue = function _getReturnValue() {
      return (symbolArray.length === 0) ? lastNodeVisited : null;
    };

    return {
      startForwardWalking,
      keepForwardWalking,
      startSidewaysWalking,
      keepSidewaysWalking,
      update,
      getReturnValue,
    };
  };

  // Returns the node that represents the last symbol in the unicode string provided.
  // This node may be treated as the root of subTrie inside the larger trie
  const getSubtrieAt = function _getSubtrieAt(someString) {
    const myClosure = getSubtrieAtClosure(someString);
    walkThroughTrie(myClosure);
    return myClosure.getReturnValue();
  };

  const formWords = function _formWords(prefix, endings, prefixIsWord) {
    const words = [];
    if (prefixIsWord === true) {
      words.push(prefix);
    }
    endings.forEach((wordEnding) => {
      let word = removeLastSymbol(prefix);
      if (wordEnding.length > 0) {
        wordEnding.forEach((nodeNumber) => {
          word += nodeNumberToUnicodeSymbol(nodeNumber);
        });
        words.push(word);
      }
    });
    return words;
  };

  const getWordsThatStartWithPrefix = function _getWordsThatStartWithPrefix(prefixString) {
    const nodeStack = [];
    const counterStack = [];
    const wordEndings = [];
    const someNode = getSubtrieAt(prefixString);
    let prefixIsWord = false;
    if (someNode === null) { // prefixString not stored in trie
      return [];
    }
    // start walking
    counterStack.push(1);
    nodeStack.push(someNode);
    if (nodeNumberDenotesWord(nodeStack[nodeStack.length - 1]) === true) {
      wordEndings.push(nodeStack);
      prefixIsWord = true;
    }

    while (nodeStack.length > 0) {
      while (counterStack[counterStack.length - 1] <= getNumChildren(nodeStack[nodeStack.length - 1])) {
        // step forward
        const nThChild = getNthChildOfNodeNumber(nodeStack[nodeStack.length - 1], counterStack[counterStack.length - 1]);
        nodeStack.push(nThChild);
        counterStack.push(1);
        if (nodeNumberDenotesWord(nodeStack[nodeStack.length - 1]) === true) { wordEndings.push(nodeStack.slice(0)); }
      }
      // step backwards
      nodeStack.pop();
      counterStack.pop();
      // step sideways
      counterStack[counterStack.length - 1] += 1;
    }
    return formWords(prefixString, wordEndings, prefixIsWord);
  };

  return {
    isStringAWordInTrie,
    getWordsThatStartWithPrefix,
  };
}

/************************************ EXPORT **************************************************/

exports.Base64SuccinctTrie = Base64SuccinctTrie;
