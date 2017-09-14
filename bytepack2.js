/******************************* GLOBALS ************************************/

// NOTE: BYTES ARE ENTERED LITTLE ENDIAN
/* BASE64 */
const byteWidth = 6;
var totalBitsInByteStr = 0; //always divisible by 8 | must be updated appropriately when adding a significant bit to byteStr
var byteStr = '';
var numSigBitsInByteStr = 0;
const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const BASE64_CACHE = {};
BASE64.split('').forEach(function (val, index) { BASE64_CACHE[val] = index; });
const bytesPerSymbol = 5;


/******************************* EXPORTS ************************************/

exports.ord = ord;
exports.char = char;
exports.addBitToByteString = addBitToByteString;
exports.BASE64= BASE64;
exports.BASE64_CACHE = BASE64_CACHE;
exports.unicodeToByteArray = unicodeToByteArray;
exports.byteArrayToUnicode = byteArrayToUnicode;

// for testing
exports.byteWidth = byteWidth;
exports.totalBitsInByteStr = totalBitsInByteStr;


/******************************* METHODS ************************************/

// RETURN: the value represented by a character in our base64 schema
// TESTED: TRUE
function ord(char) {
  return BASE64_CACHE[char];
}

// RETURN: character that represents given decimal value in our base64 schema
// TESTED: TRUE
function char(val) {
  return BASE64[val];
}

// RETURN: given the number of bits to add, func returns number of extra bytes that must be added
// to byte string to fit said bits
// TESTED: TRUE
function getNumBytes(numBitsToAdd) {
  // emptyBits i.e. insignificant bits to be filled
  const emptyBits = (totalBitsInByteStr === 0) ? byteWidth : totalBitsInByteStr%byteWidth;
  if (emptyBits >= numBitsToAdd){
    return 0;
  } // else
  const numBytes = Math.floor((numBitsToAdd - emptyBits)/byteWidth) + ((numBitsToAdd - emptyBits)%byteWidth ? 1 : 0);
  return numBytes;
}

// PARAMS: index ... the index of the desired bit
//         c ... some character in our custom BASE64
// RETURN: the bit at the provided index of the character provided
// Note: index of the first bit in char 'c' is 0
// TESTED: FALSE
function getBitAt(index, c) {
  const mask = 1 << (index);
  if (typeof c === 'number') {
    return ((c & mask) === 0) ? 0 : 1;
  } // else
  return ((ord(c) & mask) === 0) ? 0 : 1;
}

// PARAMS: str ... string
// RETURN: the last character in a given string XOR 0 if str is empty
// TESTED: FALSE
function getLastChar(str) {
  if (str === '' && str.length === 0) {
    return 0;
  } // else
  return str.charAt(str.length - 1);
}

function setLastChar(str, c) {
  if (str.length === 0 && str === '') {
    // console.log('str.length === 0');
    // console.log('c: ', c);
    return str + c;
  }
  // console.log('str.length: ', str.length);
  str = str.slice(0, str.length - 1);
  str = str + c;
  return str;
}

// PARAMS: c ... some character in our custom BASE64
// RETURN: an array of bits representing the character provided
// TESTED: FALSE
function getBitArray(c) {
  const emptyBits = (totalBitsInByteStr === 0) ? byteWidth : totalBitsInByteStr%byteWidth;
  const sigBits = byteWidth - emptyBits;
  const bitArr = [];
  let counter = 0;
  while(counter < byteWidth) {
    bitArr.push(getBitAt(counter, c));
    counter += 1;
  }
  return bitArr.reverse();
}

// PARAMS: index - the index of the bit to be modified
//         c - some character in our custom BASE64 to be modified,
//         or some number MAX: 32 bit signed integer
// RETURN: modified value, NOT NECESSARILY a character belonging to our custom BASE64
// Note: index of the first bit in char 'c' is 0
// TESTED: FALSE
function setBitAt(bit, index, c) {
  // console.log('setBitAt()');
  // console.log('bit: ', bit);
  // console.log('index: ', index);
  // console.log('c: ', c);
  let mask;
  if (bit === 0) {
    mask = ~(1 << (index));
    if (typeof c === 'number') {
      return (c & mask);
    } // else
    return(ord(c) & mask);
  } // else bit === 1
  mask = 1 << (index);
  if (typeof c === 'number') {
    return (c | mask);
  } // else
  return (ord(c) | mask);
}
  // To put in setBitAt()
  // if(c === null ||  c === undefined){
  //   throw 'setBitAt given null or undefined char'
  // }

// PARAMS:
// RETURN:
// TESTED: FALSE
function getOffsetOfLastBit() {
  return totalBitsInByteStr%byteWidth;
  // const offset = totalBitsInByteStr%byteWidth;
  // if (offset === 0) {
  //   return 0;
  // } // else
  // // return byteWidth - offset;
  // return byteWidth - offset;
}

function getIndexToAddBit(offset) {
  let index = offset + 1;
  return byteWidth - index; // litte Endian
}

// PARAMS:
// RETURN:
// TESTED: FALSE
function addBitToByteString(bit) {
  // console.log('addBitToByteString: ', bit);
  const emptyBits = (totalBitsInByteStr === 0) ? byteWidth : totalBitsInByteStr%byteWidth;
  let offsetLastBit = getOffsetOfLastBit();
  // console.log('offsetLastBit: ', offsetLastBit);
  const index  = getIndexToAddBit(offsetLastBit);
  // console.log('indexToAddBit: ', index);
  if(offsetLastBit === 0) { // add empty byte
    // console.log('adding empty byte');
    byteStr += '_'; // REPLACE WITH: addNewByte(byteStr, '_');
    // console.log('byteStr: ', byteStr);
  }
  // console.log ('about to set lastChar');
  // console.log('getLastChar(byteStr): ', getLastChar(byteStr));
  const lastChar = char(setBitAt(bit, index, getLastChar(byteStr)));
  byteStr = setLastChar(byteStr, lastChar);
  // console.log('byteStr: ', byteStr);
  // console.log('added lastChar above');
  totalBitsInByteStr += 1;
}

// ERROR: throws error when called with undefined or null argument
// PARAMS: bitArr - can't be undefined, cant be null, may be empty array
// TESTED: UNOFFICIALLY
function bitArrayToByteString(bitArr) {
  if(bitArr === null || bitArr === undefined) {
    // do nothing;
    throw 'bitArrayToByteString() called w/ undefined || null parameter'
  } else {
    bitArr.forEach(addBitToByteString);
  }
}

// last byte reserved for 'denotesWord' boolean flag
var getPadding = function _getPadding(byteLength, denotesWord) {
  const padding = [];
  const fullByte = 0xFF;
  const wordFlag = denotesWord ? 0x01 : 0x00;
  for (let i = byteLength; i < bytesPerSymbol - 1; i += 1) {
    padding.push(fullByte);
  }
  padding.push(wordFlag);
  return padding;
};

var unicodeToByteArray = function _unicodeToByteArray(str) {
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
  return byteArray;
};

var byteArrayToUnicode = function _byteArrayToUnicode(byteArray) {
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

/******************************* MAIN ************************************/

var bitArray = [0,0,0,0,0,0,0];
try {
bitArrayToByteString(bitArray);
} catch (e) {
  console.log(e);
}
console.log('bitArray: ', bitArray);
for (var i = 0; i < byteStr.length; i += 1) {
  console.log(getBitArray(byteStr[i]));
}
console.log('getBitArray(byteStr) above');
console.log('byteStr: ', byteStr);

console.log(`byteArrayToUnicode(unicodeToByteArray('ü')): `, byteArrayToUnicode(unicodeToByteArray('ü')));
console.log(`byteArrayToUnicode(unicodeToByteArray('ß'))`, byteArrayToUnicode(unicodeToByteArray('ß')));

/****************************** SCRAP ************************************/

// TESTED: FALSE
// function addBitToByteString() {
  // must be aware of how many bits in byteStr
  // i.e. byteStr === 0xFGAA which means 8 + 8 + 8 + 8  32 bits total but in this supposed scenario
  // only 29 of these bits are meaningful the rest are "unfilled"
// }