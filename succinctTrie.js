/* eslint spaced-comment: 0, jsx-a11y/href-no-hash: 0, max-len: 0 */
const Bytepack = require('./bytepack.js');

/************************************ CONSTRUCTOR *********************************************/

function Base64SuccinctTrie(someBase64String, someExpandedUnicodeArray, someZeroPositions) {
  const base64String = someBase64String;
  const expandedUnicodeArray = someExpandedUnicodeArray;
  const zeroPositions = someZeroPositions;

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

  const stringToSymbolArray = function _stringToSymbolArray(str) {
    return str.split('');
  };

  const isStringInSuccintTrie = function _isStringInSuccintTrie(someString) {
    let someRoot = 0; // rootNode number is 0
    let someSymbolArray = stringToSymbolArray(someString);
    let matchedSymbolToChild = true;

    while ((matchedSymbolToChild === true) && (someSymbolArray.length > 0)) {
      let counter = 1;
      const numberOfChildren = getNumChildren(someRoot);
      matchedSymbolToChild = false;

      if (numberOfChildren > 0) {
        while (counter <= numberOfChildren && (matchedSymbolToChild === false)) {
          const nthChild = getNthChildOfNodeNumber(someRoot, counter);

          if (nodeNumberToUnicodeSymbol(nthChild) === someSymbolArray[0]) {
            someRoot = nthChild;
            matchedSymbolToChild = true;
            someSymbolArray = someSymbolArray.slice(1);
          }
          counter += 1;
        }
      }
    }
    return (someSymbolArray.length === 0);
  };

  return {
    select,
    getNthChildOfNodeNumber,
    isStringInSuccintTrie,
  };
}

/************************************ EXPORT **************************************************/

exports.Base64SuccinctTrie = Base64SuccinctTrie;
