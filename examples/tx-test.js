// see full article here https://wanderer.github.io/ethereum/2014/06/14/creating-and-verifying-transaction-with-node/
// Added test with load in wallet
//Not finished
//compare two methods
//MOAC libraries files 
var utils = require('../lib/txutils.js');
var Transaction = require('../lib/transactions.js')
//MOAC library
// var Chain3 = require('chain3'); //Should be used when finish
var Chain3 = require('./chain3.js');
var chain3 = new Chain3();

for (var p in chain3)
  console.log('Pro:', p);//chain3[p]);
return;

// const twallet             = require('./test_wallet.json');//Test data used to test the wallet keystore functions.
// console.log("Wallet:", twallet.address);
// console.log("Moac:",utils.toMoacAddress(twallet.address));

//ETH libraries
// var Tx = require('../../ethereumjs-tx');
// var ethUtils = require('ethereumjs-util');//

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
var txcount = 1;
var des_addr = taccts[0].addr;
var src = taccts[1];

var rawTx = {
  nonce: utils.intToHex(txcount),
  // 1 gwei
  gasPrice: utils.intToHex(1000000000),
  gasLimit: utils.intToHex(6100500),
  to: des_addr, 
  value: utils.intToHex(5000), 
  data: '0x00'
}
console.log(rawTx);

// var tx = new Tx(rawTx);
var moactx = new Transaction(rawTx);
console.log("moactx chainID:", moactx.getChainId())

//Get the account TX list to set the raw TX command nonce value
var privateKey = new Buffer(src.key, 'hex');

moactx.sign(privateKey);

var txdata = moactx.serialize().toString('hex');
console.log("len:", txdata.length)
console.log(txdata)
//online
return;

// moactx.verifySignature();
var recover = '0x'+moactx.getSenderAddress().toString('hex');

console.log("len:", recover.length)
console.log(recover)
//online
return;

/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, value){
  // console.log("Send from ", src, "to ", des);
    var txcount = chain3.mc.getTransactionCount(src["addr"]) + 4;
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
    console.log("moactx chainID:", moactx.getChainId())

    //Get the account TX list to set the raw TX command nonce value
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
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function checkBal(inadd){
  var outval = chain3.mc.getBalance(inadd);

  //check input address
  return chain3.fromSha(outval.toString(),'mc');
}

//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

//Call the function, note the 
for (i = 0; i < taccts.length; i ++)
  console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

return;


// console.log("Result:", sendTx(tacct1, tacct2, 1.23));
// return;
console.log("Result:", sendTx(taccts[1], taccts[2], 0.01));


// console.log("PUB: ", moactx.getSenderPublicKey().length);
// console.log(moactx.getSenderPublicKey())

// console.log("ADD: %x", moactx.getSenderAddress());
//GEt the public key address from the sig
// console.log("Verifying....")
// moactx.verifySignature();
// var recover = '0x'+moactx.getSenderAddress().toString('hex');
// assert.equal(tacct1.addr.toLowerCase(), recover);

// return;



return;

// var cmp_cmd = '0xf86c168509502f9000825208947312f4b8a4457a36827f185325fd6b66a3f8bb8b88016345785d8a0000001ba0c515be40cdaed29997219eb5fb1002ac03e35b8666ce84c3b9e181ad13760ea4a01eb2ded06283fb4663652120f031b5b0cef06b9cf0a831d3c2b5a158460790c1';
// if (assert.equal(cmp_cmd, out_cmd))
//   console.log("Results are equal!");
console.log("Test with assert equal:");
assert.equal(cmd2, out_cmd);

return;

// So now we have created a blank transaction but Its not quiet valid yet. We
// need to add some things to it. Lets start:
// notice we don't set the `to` field because we are creating a new contract.
tx.nonce = 0
tx.gasPrice = 100
tx.gasLimit = 1000
tx.value = 0
tx.data = '0x7f4e616d65526567000000000000000000000000000000000000000000000000003057307f4e616d6552656700000000000000000000000000000000000000000000000000573360455760415160566000396000f20036602259604556330e0f600f5933ff33560f601e5960003356576000335700604158600035560f602b590033560f60365960003356573360003557600035335700'

var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
tx.sign(privateKey)
// We have a signed transaction, Now for it to be fully fundable the account that we signed
// it with needs to have a certain amount of wei in to. To see how much this
// account needs we can use the getUpfrontCost() method.
var feeCost = tx.getUpfrontCost()
tx.gas = feeCost
console.log('Total Amount of wei needed:' + feeCost.toString())

// if your wondering how that is caculated it is
// bytes(data length) * 5
// + 500 Default transaction fee
// + gasAmount * gasPrice

// lets serialize the transaction

console.log('---Serialized TX----')
console.log(tx.serialize().toString('hex'))
console.log('--------------------')

// Now that we have the serialized transaction we can get AlethZero to except by
// selecting debug>inject transaction and pasting the transaction serialization and
// it should show up in pending transaction.

// Parsing & Validating transactions
// If you have a transaction that you want to verify you can parse it. If you got
// it directly from the network it will be rlp encoded. You can decode you the rlp
// module. After that you should have something like
var rawTx = [
  '0x00',
  '0x09184e72a000',
  '0x2710',
  '0x0000000000000000000000000000000000000000',
  '0x00',
  '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  '0x1c',
  '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
]

var tx2 = new Transaction(rawTx)

// Note rlp.decode will actully produce an array of buffers `new Transaction` will
// take either an array of buffers or an array of hex strings.
// So assuming that you were able to parse the tranaction, we will now get the sender's
// address

console.log('Senders Address: ' + tx2.getSenderAddress().toString('hex'))

// Cool now we know who sent the tx! Lets verfy the signature to make sure it was not
// some poser.

if (tx2.verifySignature()) {
  console.log('Signature Checks out!')
}

// And hopefully its verified. For the transaction to be totally valid we would
// also need to check the account of the sender and see if they have at least
// `TotalFee`.
