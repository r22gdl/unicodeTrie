// last byte reserved for 'denotesWord' boolean flag
const bytesPerSymbol = 5;

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

exports.unicodeToByteArray = unicodeToByteArray;

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

exports.byteArrayToUnicode = byteArrayToUnicode;


/****************************** MAIN ************************************/

