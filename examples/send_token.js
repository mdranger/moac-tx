/*
 * Generate a test operation for ERC20 token transfer
 * in the Ethereum network
 * for testing MOAC wallet server
 * need to load the contract address
 * Test conditions:
 * 1. a pair of public/private key for testing, public key need to have some balances.
 *    need to update the transaction nonce after each TX.
 * 2. an address to send to.
 * 2018/01/12, working on......
 * 
*/
//libraries to generate the Tx
var Tx = require('ethereumjs-tx');
var mcUtils = require('ethereumjs-util')
var chai = require('chai');
var assert = chai.assert;

//Eth chain3 interface
var Chain3 = require('chain3/index.js');
var chain3 = new Chain3();

//Set up the server to the Ethereum node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
const moacAbi             = require('../moac_abi.json');
const moacAddress = "0xCBcE61316759D807c474441952cE41985bBC5a40";
  

//libraries to send out the data for the ethereum network
var http = require('http');
var querystring = require('querystring')


//Test public/private key pair
/*
Test account1 on MOAC test net:
mFEZrK6AbkJacCN5aBRn6a2fGwgkVZW
0xa8863fc8Ce3816411378685223C03DAae9770ebB
262aaacc326812a19cf006b3de9c50345d7b321c6b6fa36fd0317c2b38970c3e

mk3tSCiHXw17SnjYq7XPyKMbmBKBXyq
0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B
c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b
*/

var tacct1 = {
  "maddr": "mFEZrK6AbkJacCN5aBRn6a2fGwgkVZW",
  "addr": "0xa8863fc8Ce3816411378685223C03DAae9770ebB", 
  "key": "262aaacc326812a19cf006b3de9c50345d7b321c6b6fa36fd0317c2b38970c3e"
}

var tacct2 = {
  "maddr": "mk3tSCiHXw17SnjYq7XPyKMbmBKBXyq",
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
}

var des_addr = tacc2;

//Get the account TX list to set the raw TX command nonce value
var privateKey = new Buffer(tacct1["key"], 'hex');

//Note: This number needs to be updated manually or get from getTransactionCount
console.log(chain3.mc.getTransactionCount(tacct1["addr"]));
console.log("Gas price:", chain3.mc.gasPrice);
var txcount = chain3.mc.getTransactionCount(tacct1["addr"]) + 1;
txcount = 11;

var tokenContract = chain3.mc.contract(moacAbi);
console.log(tokenContract.at(moacAddress).balanceOf(tacct1["addr"]).toNumber());

//function transferFrom(address _from, address _to, uint256 _value)
// console.log(tokenContract.at(moacAddress).transferFrom.sendTransaction(tacct1["addr"], des_addr, 10));
return;
// console.log(tokenContract.at(moacAddress).transfer.sendTransaction(des_addr, 10));
var mc_amt = 100000000000000000;//int represent the value of mc to transfer, 
   var tstr = "0xa9059cbb000000000000000000000000040b90762cee7a87ee4f51e715a302177043835e000000000000000000000000000000000000000000000000016345785d8a0000"

/*
 * des_addr: destination address start with '0x'
*/
function send_mc(des_addr, mc_amt) {
  //contract abi info for the transfer
   var cmd1 = "0xa9059cbb000000000000000000000000";
   //Add the des address without '0x' prefix
   var cmd4 = cmd1 + des_addr.substring(2);//cmd1.replace("aaaa", des_addr.substring(2));
// console.log("data len:", cmd4.length, " ", tstr.length - cmd4.length)
  // var amt = leftPad(chain3.toHex(chain3.toWei(mc_amt)).slice(2).toString(16),64,0);
  // console.log("In hex:", chain3.toHex(mc_amt));
   var amt = chain3.toHex(mc_amt).slice(2).toString(16);
  // var amt = chain3.toHex(chain3.toWei(mc_amt)).slice(2).toString(16)
  for(var i = 0; i < 64 - amt.length; i++) // Assign array indexes to variable i
    cmd4 = cmd4 + '0';
  return cmd4+amt;
}

  var cmdData = send_mc(des_addr, mc_amt)
console.log("cmd length :", cmdData.length);
console.log(cmdData);


// return;
// assert.equal(cmdData, tstr);
// return;
// 0x23b872dd000000000000000000000000040B90762Cee7a87ee4f51e715a302177043835e000000000000000000000000000000000013426172c74d822b878fe800000000
// 0xa9059cbb000000000000000000000000040b90762cee7a87ee4f51e715a302177043835e000000000000000000000000000000000000000000000000016345785d8a0000
// 0xa9059cbb000000000000000000000000040B90762Cee7a87ee4f51e715a302177043835e000000000000000000000000000000000000000000000000016345785d8a0000
// 0xa9059cbb000000000000000000000000040b90762cee7a87ee4f51e715a302177043835e000000000000000000000000000000000000000000000000016345785d8a0000

// 0xc523bd323f1efa6b4a2ee62d5d52184d16871b25
// 0xf4f78639d84b5f55d3f4bdb2062706eeffe06634

//30000000000
//Create the raw transaction to sign, 
//note the data should be used 
console.log("txcount:", txcount);

var rawTx = {
  nonce: mcUtils.intToHex(txcount),
  // 1 gwei
  gasPrice: mcUtils.intToHex(10000000000),
  gasLimit: mcUtils.intToHex(100000),
  to: des_addr, 
  value: '0x00', 
  data: cmdData
}

console.log(rawTx);
return;

var tx = new Tx(rawTx);

tx.sign(privateKey);


var out_cmd = '0x' + tx.serialize().toString('hex');

console.log(out_cmd);

//Setup the data to send out
var postData = querystring.stringify({
  'signature': out_cmd
});


const options = {
  hostname: '121.42.144.166',
  port: 3001,
  path: '/v1/moac/transfer',
  mmcod: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

//Prepare the request

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log("==========================");
    console.log(`BODY: ${chunk}`);
    console.log(chunk.data);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();

return;




