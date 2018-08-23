/*
 * Utilities used in MOAC transaction process
*/
var CryptoJS = require('crypto-js');
var BN = require('bn.js');
var Chain3 = require('chain3');
// var Chain3 = require('../../RestAPI/index.js');
var chain3 = new Chain3();//used to encode the transaction parameters

var Transaction = require('./transactions');
var rlp = require('./moacrlp');


function add0x (input) {
  if (typeof(input) !== 'string') {
    return input;
  }
  if (input.length < 2 || input.slice(0,2) !== '0x') {
    return '0x' + input;
  }

  return input;
}

function strip0x (input) {
  if (typeof(input) !== 'string') {
    return input;
  }
  else if (input.length >= 2 && input.slice(0,2) === '0x') {
    return input.slice(2);
  }
  else {
    return input;
  }
}

//
function _encodeFunctionTxData (functionName, types, args) {

  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName, { outputLength: 256 }).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = '0x' + signature + chain3.encodeParams(types, args);

  return dataHex;
}

function _getTypesFromAbi (abi, functionName) {

  function matchesFunctionName(json) {
    return (json.name === functionName && json.type === 'function');
  }

  function getTypes(json) {
    return json.type;
  }

  var funcJson = abi.filter(matchesFunctionName)[0];

  return (funcJson.inputs).map(getTypes);
}

function functionTx (abi, functionName, args, txObject) {
  // txObject contains gasPrice, gasLimit, nonce, to, value

  var types = _getTypesFromAbi(abi, functionName);
  var txData = _encodeFunctionTxData(functionName, types, args);

  var txObjectCopy = {};
  txObjectCopy.to = add0x(txObject.to);
  txObjectCopy.gasPrice = add0x(txObject.gasPrice);
  txObjectCopy.gasLimit = add0x(txObject.gasLimit);
  txObjectCopy.nonce = add0x(txObject.nonce);
  txObjectCopy.data = add0x(txData);
  txObjectCopy.value = add0x(txObject.value);

  return '0x' + (new Transaction(txObjectCopy)).serialize().toString('hex');
}

function createdContractAddress (fromAddress, nonce) {
  var rlpEncodedHex = rlp.encode([new Buffer(strip0x(fromAddress), 'hex'), nonce]).toString('hex');
  var rlpEncodedWordArray = CryptoJS.enc.Hex.parse(rlpEncodedHex);
  var hash = CryptoJS.SHA3(rlpEncodedWordArray, {outputLength: 256}).toString(CryptoJS.enc.Hex);

  return '0x' + hash.slice(24);
}

function createContractTx (fromAddress, txObject) {
  // txObject contains gasPrice, gasLimit, value, data, nonce

  var txObjectCopy = {};
  txObjectCopy.to = add0x(txObject.to);
  txObjectCopy.gasPrice = add0x(txObject.gasPrice);
  txObjectCopy.gasLimit = add0x(txObject.gasLimit);
  txObjectCopy.nonce = add0x(txObject.nonce);
  txObjectCopy.data = add0x(txObject.data);
  txObjectCopy.value = add0x(txObject.value);

  var contractAddress = createdContractAddress(fromAddress, txObject.nonce);
  var tx = new Transaction(txObjectCopy);

  return {tx: '0x' + tx.serialize().toString('hex'), addr: contractAddress};
}

function valueTx (txObject) {
  // txObject contains gasPrice, gasLimit, value, nonce

  var txObjectCopy = {};
  txObjectCopy.to = add0x(txObject.to);
  txObjectCopy.gasPrice = add0x(txObject.gasPrice);
  txObjectCopy.gasLimit = add0x(txObject.gasLimit);
  txObjectCopy.nonce = add0x(txObject.nonce);
  txObjectCopy.value = add0x(txObject.value);

  var tx = new Transaction(txObjectCopy);

  return '0x' + tx.serialize().toString('hex');
}

/**
 * Returns a `Boolean` on whether or not the a `String` starts with '0x'
 * @param {String} str the string input value
 * @return {Boolean} a boolean if it is or is not hex prefixed
 * @throws if the str input is not a string
 */
function isHexPrefixed(str) {
  if (typeof str !== 'string') {
    throw new Error("value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
  }

  return str.slice(0, 2) === '0x';
}

/**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */
function padToEven(value) {
  var a = value; // eslint-disable-line

  if (typeof a !== 'string') {
    throw new Error(`[moac-tx-moacutils] while padding to even, value must be string, is currently ${typeof a}, while padToEven.`);
  }

  if (a.length % 2) {
    a = `0${a}`;
  }

  return a;
}

/**
 * Converts a `Number` into a hex `String`
 * This could have problem when the input number is
 * too large
 *  Use bn.js to convert the input to 
 * certain range.
 * @param {Number} i
 * @return {String}
 */
function intToHex(i) {
  var inNum = new BN(i, 10);
  var hex = inNum.toString(16);

  return `0x${padToEven(hex)}`;
}

module.exports = {
  _encodeFunctionTxData: _encodeFunctionTxData,
  _getTypesFromAbi: _getTypesFromAbi,
  functionTx: functionTx,
  createdContractAddress: createdContractAddress,
  createContractTx: createContractTx,
  valueTx: valueTx,
  intToHex: intToHex
};
