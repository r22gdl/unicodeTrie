const assert = require('assert');
let { BASE64, BASE64_CACHE, char, ord, totalBitsInByteStr, byteWidth } = require('./../bytepack2.js');

// TEST SUITE A: for functionality of methods used in compacting a
//               normal dictionary trie to a similarly navigable byte string
describe('Testing methods for translating trie to custom BASE64 byte string', function describeTrieToByteString() {

  // TEST A1
  describe('ord(char())', function describeOrdOnChar() {
    it('should return the value provided originally as an argument to char()', function itOrdOnChar() {
      BASE64.split('').forEach(function assertOrdOnChar(c) {
        assert.strictEqual(c, char(ord(c)));
      });
    });
  });

  // TEST A2
  describe('char(ord())', function describeCharOnOrd() {
    it('should return the char provided originally as an argument to ord()', function itCharOnOrd() {
      Object.keys(BASE64_CACHE).forEach(function assertCharOnOrd(key) {
        assert.strictEqual(key, char(ord(key)));
      });
    });
  });

  // TEST A3
  describe('bitArrayToByteString()', function describeBitArrayToByteString(argument) {
    it('should throw error when provided ');
  });
});

/****************************************** SCRAP ******************************************************/

  // describe('getNumBytes(numBitsToAdd)', function describeGetNumBytes() {
  //   // If we mod both 'totalBitsInByteStr' and 'numBitsToAdd' by byteWidth=6,
  //   // question becomes "Should we add 0 bytes or 1 byte?"
  //   // getNumBytes correct if it answers this question precisely (Proof lies in induction)
  //   // should return 0 when (totalBitsInByteStr%byteWidth) + (numBitsToAdd%byteWidth) <= byteWidth
  //   // should return 1 when (totalBitsInByteStr%byteWidth) + (numBitsToAdd%byteWidth) > byteWidth
  //   it('should return 0 or 1 based on total bits currently stored and no. of bits to add',
  //   function itgetNumBytes() {
  //     totalBitsInByteStr = 0;
  //     let numBitsToAdd = 0;
  //     let numBytes = 0;
  //     while(totalBitsInByteStr <= 6) {
  //       while(numBitsToAdd <=6){
  //         numBytes = (((totalBitsInByteStr%byteWidth) + (numBitsToAdd%byteWidth)) <= byteWidth) ? 0 : 1;
  //         assert.strictEqual(numBytes, getNumBytes(numBitsToAdd));
  //         numBitsToAdd += 1;
  //       }
  //       totalBitsInByteStr += 1;