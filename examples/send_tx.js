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
//MOAC libraries files 
var Chain3 = require('chain3');
// var Chain3 = require('../../RestAPI/dist/chain3.js');
var chain3 = new Chain3();
var chai = require('chai');
var assert = chai.assert;


var moaclib = require('../../moac-lib/index.js');
var utils = moaclib.txutils;
var Transaction = moaclib.txs;


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

//Test offline tx creation and signing
// var val = chain3.toSha(1, 'mc');
// console.log(val);
// console.log(utils.intToHex(val));
// console.log(utils.intToHex(210000));
// return;
//     var rawTx = {
//       from: taccts[0].addr,
//       nonce: utils.intToHex(1),
//       // 1 gwei
//       gasPrice: utils.intToHex(4000000000),
//       gasLimit: utils.intToHex(210000),
//       to: taccts[2].addr, 
//       value: utils.intToHex(chain3.toSha(1, 'mc')), 
//       data: '0x00',
//       queryFlag: 0,
//       shardingFlag: 0
//     }

// // console.log(rawTx);

//     // console.log(rawTx);
//     var moactx = new Transaction(rawTx);
//     console.log("Build TX:");
//     // console.log(moactx.getFields());

//     var privateKey = new Buffer(taccts[0]["key"], 'hex');
//     moactx.sign(privateKey);

// // console.log("Validate:", moactx.validate("notvali"));
// // console.log("Sender:", moactx.getSenderAddress());
// console.log("signed tx:", moactx.toJSON());

// //the command send to server for processing
//     var cmd2 = '0x' + moactx.serialize().toString('hex');
// console.log("tx length", cmd2.length);
// console.log("Send cmd:", cmd2);

// var cmd1 = "f884018084ee6b28008303345094d814f2ac2c4ca49b33066582e4e97ebae02f2ab98a01000000000000000000009400000000000000000000000000000000000000001ca04c795e5840c72e1531831c17aaccf1f98e1ee6f45fe3e913badafb2f7b818107a028b2ecee612c90b06951c41c773f815311602856845e84aa7ee9586ab7b91207";

//This command should be decoded in MOAC core
//rlp.Decode
// assert.equal(cmd1, cmd2);

// return;
//Below are the process to send the TX to the MOAC node
//using Chain3 RPC.

//library used to compare two results.




/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, value){
  // console.log("Send from ", src, "to ", des);
    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)
    // console.log(chain3.toSha(value, 'mc'))
    // return chain3.toSha(value, 'mc')
    //Build the raw tx obj
    //note the transaction
    //For mc transaction, default is global, no other settings
    //Some fields with default values
    // var gp = chain3.mc.get
    var rawTx = {
      from: src.addr,
      nonce: utils.intToHex(txcount),
      // 1 gwei
      gasPrice: utils.intToHex(400),
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
    // console.log("Get queryFlag", moactx.getQueryFlag)

    //Get the account TX list to set the raw TX command nonce value
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
for (i = 0; i < taccts.length; i ++)
console.log("Acct[",i,"]:",checkBal(taccts[i].addr));
console.log("Move 1.23 from 0 to 1:", sendTx(taccts[0], taccts[1], 1.23));
for (i = 0; i < taccts.length; i ++)
console.log("Acct[",i,"]:",checkBal(taccts[i].addr));


return;



