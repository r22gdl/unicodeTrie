/* eslint spaced-comment: 0, no-bitwise: 0, jsx-a11y/href-no-hash: 0, max-len: 0 */

/************************************ CONSTANTS *************************************************/

// INVARIANT: BYTES ARE LITTLE ENDIAN

const byteWidth = 6;
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE64_CACHE = (function setBase64Cache() { // EXPLAIN
  const cache = {};
  BASE64.split('').forEach((val, index) => { cache[val] = index; });
  return cache;
}());
const bytesPerSymbol = 5;

/************************************ METHODS *************************************************/

//Note: For all methods below, base64 characters can be thought of as a sequence of 6 bits,
// each indexed as 0 thru 5

// returns the value represented by a character in our base64 schema
const ord = function _ord(someChar) {
  return BASE64_CACHE[someChar];
};

// returns character that represents given decimal value in our base64 schema
const char = function _char(val) {
  return BASE64[val];
};

// returns the bit located at the given index of the character provided
const getBitAt = function _getBitAt(index, c) {
  const mask = 1 << (index);
  if (typeof c === 'number') {
    return ((c & mask) === 0) ? 0 : 1;
  }
  return ((ord(c) & mask) === 0) ? 0 : 1;
};

// returns the last character in a given string XOR 0 if str is empty
const getLastChar = function _getLastChar(str) {
  if (str === '' && str.length === 0) {
    return 0; // EXPLAIN
  }
  return str.charAt(str.length - 1);
};

const setLastChar = function _setLastChar(someStr, c) {
  let str = someStr;
  if (str.length === 0 && str === '') {
    return str + c;
  }
  str = str.slice(0, str.length - 1);
  str += c;
  return str;
};

// c  - some character in our custom BASE64
// returns an array of bits representing the character provided
const getBitArray = function _getBitArray(c) {
  const bitArr = [];
  let counter = 0;
  while (counter < byteWidth) {
    bitArr.push(getBitAt(counter, c));
    counter += 1;
  }
  return bitArr.reverse();
};

// c - some character in our custom BASE64 to be modified or some number MAX: 32 bit signed integer
// returns a modified value, NOT NECESSARILY a character belonging to our custom BASE64
const setBitAt = function _setBitAt(bit, index, c) {
  let mask;
  if (bit === 0) {
    mask = ~(1 << (index));
    if (typeof c === 'number') {
      return (c & mask);
    }
    return (ord(c) & mask);
  } // bit === 1
  mask = 1 << (index);
  if (typeof c === 'number') {
    return (c | mask);
  }
  return (ord(c) | mask);
};

const getOffsetOfLastBit = function _getOffsetOfLastBit(numBitsAddedToBase64String) {
  return numBitsAddedToBase64String % byteWidth;
};

// EXPLAIN
const getIndexToAddBit = function _getIndexToAddBit(offset) {
  const index = offset + 1;
  return byteWidth - index; // litte endian
};

const addBitToBase64String = function _addBitToBase64String(bit, index, someBitArr, numBits, someBase64String) {
  const offsetLastBit = getOffsetOfLastBit(numBits);
  const indexToAddBit = getIndexToAddBit(offsetLastBit); // EXPLAIN
  // add 'empty' byte
  let base64String = someBase64String;
  if (offsetLastBit === 0) {
    base64String += '_';
  }
  const updatedLastChar = char(setBitAt(bit, indexToAddBit, getLastChar(base64String)));
  base64String = setLastChar(base64String, updatedLastChar);
  return base64String;
};

// bitArr - cannot be undefined, cant be null, may be empty array
const bitArrayToBase64String = function _bitArrayToBase64String(bitArr) {
  // count the number of bits that have been added to the base64String
  let numBitsAddedToBase64String = 0;
  let base64String = '';
  if (bitArr === null || bitArr === undefined) {
    // do nothing;
    throw 'bitArrayToBase64String() called w/ undefined || null parameter';
  } else {
    bitArr.forEach((bit, index, arr) => {
      base64String =
        addBitToBase64String(bit, index, arr, numBitsAddedToBase64String, base64String);
      numBitsAddedToBase64String += 1;
    });
  }
  return base64String;
};

// last byte reserved for 'denotesWord' boolean flag
const getPadding = function _getPadding(byteLength, denotesWord) {
  const padding = [];
  const fullByte = 0xFF;
  const wordFlag = denotesWord ? 0x01 : 0x00;
  for (let i = byteLength; i < bytesPerSymbol - 1; i += 1) {
    padding.push(fullByte);
  }
  padding.push(wordFlag);
  return padding;
};

const unicodeSymbolsToExpandedByteArray = function _unicodeSymbolsToExpandedByteArray(str) {
  let byteArray = [];
  let denotesWord = false;
  for (let i = 0; i < str.length; i += 1) {
    // character denotes word if it's last char in string
    denotesWord = (i === str.length - 1);
    if (str.charCodeAt(i) <= 0x7F) {
      byteArray.push(str.charCodeAt(i));
      byteArray = byteArray.concat(getPadding(1, denotesWord));
    } else {
      const h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (let j = 0; j < h.length; j += 1) {
        byteArray.push(parseInt(h[j], 16));
      }
      byteArray = byteArray.concat(getPadding(h.length, denotesWord));
    }
  }
  if (str === 0xFF) { // for adding super root and root to byteArray
    byteArray = byteArray.concat(getPadding(0, false));
  }
  return byteArray;
};

const expandedByteArrayToUnicodeSymbol = function _expandedByteArrayToUnicodeSymbol(byteArray) {
  let str = '';
  for (let i = 0; i < byteArray.length; i += 1) {
    if (((i + 1) % bytesPerSymbol) === 0) {
      // do nothing
    } else if (byteArray[i] <= 0x7f) {
      if (byteArray[i] === 0x25) {
        str += '%25';
      } else {
        str += String.fromCharCode(byteArray[i]);
      }
    } else if (byteArray[i] === 0xFF) {
      // do nothing
    } else {
      // encode (193 -> 'C3' -> '%C3')
      str += `%${byteArray[i].toString(16).toUpperCase()}`;
    }
  }
  return decodeURIComponent(str);
};

/************************************ EXPORTS *************************************************/

exports.addBitToBase64String = addBitToBase64String;

exports.unicodeSymbolsToExpandedByteArray = unicodeSymbolsToExpandedByteArray;

exports.expandedByteArrayToUnicodeSymbol = expandedByteArrayToUnicodeSymbol;

exports.bitArrayToBase64String = bitArrayToBase64String;

exports.byteWidth = byteWidth;

exports.getBitArray = getBitArray;

exports.bytesPerSymbol = bytesPerSymbol;
