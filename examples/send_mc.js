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


var moaclib = require('../../moac-tx/index.js');
var utils = moaclib.txutils;
var Transaction = moaclib.txs;
// const twallet             = require('./test_wallet.json');//Test data used to test the wallet keystore functions.
// console.log("Wallet:", twallet.address);
// console.log("Moac:",utils.toMoacAddress(twallet.address));

//ETH libraries
// var Tx = require('../../ethereumjs-tx');
// var mcUtils = require('ethereumjs-util');//

//library used to compare two results.
var chai = require('chai');
var assert = chai.assert;

//c1 is the api'S public key
//c2 is the public key from MOAC core

// var c1 = 'dd455d4658ac192c84e0a4c5b559686ac064d29d5bdaeec0fbcac692f24d9ea88b1e546f4ddd893dcd3e89be95461a3d7053b9bd039a934f478588df53fad43d'
// var c2 = '04a380698991c4ed5117fdbdfc4b9c943091fb2e1aee2b447993d9172430e7af24ec13b627c1f17f5b5511922c3d815f5cfd62777c172335983855f1bfd6910700'
// console.log(c1.length, c2.length)

// var s1 = '2326d740b849090079ae6d5fff83820231aac362b5c4b96f28b44b8085580b092e7f04fb8f2c1fd000ef759c365759919264de0856423c4114724199802e842d';
// var s2 = '2326d740b849090079ae6d5fff83820231aac362b5c4b96f28b44b8085580b092e7f04fb8f2c1fd000ef759c365759919264de0856423c4114724199802e842d00';
// console.log(s1.length, s2.length)
// return;


//test accounts
var taccts = [{
  "maddr": "mFEZrK6AbkJacCN5aBRn6a2fGwgkVZW",
  "addr": "0xa8863fc8Ce3816411378685223C03DAae9770ebB", 
  "key": "262aaacc326812a19cf006b3de9c50345d7b321c6b6fa36fd0317c2b38970c3e"
},{
  "maddr": "mk3tSCiHXw17SnjYq7XPyKMbmBKBXyq",
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
},{
  "maddr": "mcmNw9TVcYXp7Ep3gxdN2VsDCtu7BTtE",
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
}];


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
function sendTx(src, des, value){
  // console.log("Send from ", src, "to ", des);
    var txcount = chain3.mc.getTransactionCount(src["addr"]) + 1;
    console.log("Get tx account", txcount)
    // console.log(chain3.toSha(value, 'mc'))
    // return chain3.toSha(value, 'mc')
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      nonce: utils.intToHex(txcount),
      // 1 gwei
      gasPrice: utils.intToHex(4000000000),
      gasLimit: utils.intToHex(210000),
      to: des.addr, 
      value: utils.intToHex(chain3.toSha(value, 'mc')), 
      data: '0x00',
      queryFlag: 0,
      shardingFlag: 0
    }


    // console.log(rawTx);
    var moactx = new Transaction(rawTx);
    // console.log("moactx chainID:", moactx.getChainId())

    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key

    var privateKey = new Buffer(src["key"], 'hex');
    moactx.sign(privateKey);

    var cmd2 = '0x' + moactx.serialize().toString('hex');
console.log("Send cmd:", cmd2)
// return;

chain3.mc.sendRawTransaction(cmd2, function(err, hash) {
        if (!err){
            
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log(response);
    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
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

for (i = 0; i < taccts.length; i ++)
  console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

//Call the function, note the input value is in 'mc'
var src = taccts[1];
var des = taccts[2];

console.log("\nBefore transfer:", checkBal(src.addr), checkBal(des.addr));

console.log("Result:", sendTx(src, des, 1.1));

console.log("\nAfter transfer:", checkBal(src.addr), checkBal(des.addr));


return;



