/*
 * Generate a test operation for MC transfer
 * in the MOAC network
 * for testing MOAC wallet server
 * need to load the contract address
 * Test conditions:
 * 1. a pair of public/private key for testing, public key need to have some balances.
 *    need to update the transaction nonce after each TX.
 * 2. an address to send to.
 * 
*/
//libraries to generate the Tx

//MOAC chain3 lib
var Chain3 = require('chain3');
var chain3 = new Chain3();


var Transaction = require('../../moac-tx/index.js');
var utils = require('../lib/moacutils.js');//moaclib.txutils;

//library used to compare two results.
var assert = require('assert');



//test accounts
const taccts = require('./test_accounts.json');

// var inval = 1000;

// //Notice chain3.toSha() returns a String in DEC, not number
// //
// console.log("Value::", chain3.toSha(0.1, 'mc'), " HEX: ", utils.intToHex(chain3.toSha(0.1, 'mc'))); 
// console.log("IntToHex", inval, " HEX: ", utils.intToHex(inval));
// var instr = chain3.toSha(0.1, 'mc');
// var a = new utils.BN(instr, 10);
// console.log('HEX', a.toString(16))
// return;
// var taccts = [{
//   "addr": "0xa8863fc8Ce3816411378685223C03DAae9770ebB", 
//   "key": "262aaacc326812a19cf006b3de9c50345d7b321c6b6fa36fd0317c2b38970c3e"
// },{
//   "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
//   "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
// },{
//   "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
//   "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
// }];


//Test offline create TX and signing
// var rawTx = {
//   from: tacct1.addr,
//   nonce: 1,
//   // 1 gwei
//   gasPrice: utils.intToHex(40000000000),
//   gasLimit: utils.intToHex(2100000),
//   to: tacct2.addr, 
//   value: utils.intToHex(0x016345785d8a0000), 
//   data: '0x00',
//     queryFlag: 0,
//   shardingFlag: 0
// }

// console.log(rawTx);

// // var tx = new Tx(rawTx);
// var moactx = new Transaction(rawTx);
// console.log("moactx chainID:", moactx.getChainId())

// //Get the account TX list to set the raw TX command nonce value
// var privateKey = new Buffer(tacct1["key"], 'hex');
// tx.sign(privateKey);
// moactx.sign(privateKey);

// // moactx.verifySignature();
// // var recover = '0x'+moactx.getSenderAddress().toString('hex');

// //online
// return;

/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, chainid, value){

    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)

    //The input is in unit 'mc', convert it to sha using
    //chain3 function toSha
    // The return is a String in base 10.
    // need conver to BN
    var hexval = new utils.BN(chain3.toSha(value, 'mc'), 10);

    //Build the raw tx obj
    //note the transaction inputs should be HEX string for value
    var rawTx = {
      from: src.addr,
      nonce: utils.intToHex(txcount),
      gasPrice: utils.intToHex(30000000000),
      gasLimit: utils.intToHex(2000),
      to: des.addr, 
      value: utils.addHexPrefix(hexval.toString(16)), 
      data: '0x00',
      shardingFlag: 0
    }


    // console.log(rawTx);

    //Create the new Transaction object

    var moactx = new Transaction(rawTx);
    moactx.setChainId(chainid);


    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key

    var privateKey = new Buffer(src["key"], 'hex');
    moactx.sign(privateKey);

    var cmd2 = '0x' + moactx.serialize().toString('hex');

console.log("Send cmd:", cmd2)

chain3.mc.sendRawTransaction(cmd2, function(err, hash) {
        if (!err){
            
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            return err.message;
        }
    
    // console.log(response);
    console.log("Get response from MOAC node in the feedback function!")
    });

}

/*
 * display the balance value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function checkBal(inadd){
  var outval = chain3.mc.getBalance(inadd);
  //check input address
  return chain3.fromSha(outval.toString(),'mc');
}


//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

// for (i = 0; i < taccts.length; i ++)
//   console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

//Call the function, note the input value is in 'mc'
var src = taccts[1];
var des = taccts[2];

console.log("\nBefore transfer:", checkBal(src.addr), checkBal(des.addr));
var networkid = chain3.version.network;
console.log("This TX is on network ", networkid);
console.log("Gas price:", chain3.mc.gasPrice);

sendTx(src, des, networkid, 0.1);


return;



