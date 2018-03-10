#!/usr/bin/env node
//Test program to run the contract interface
//
//sendTransaction({from: src, to: des, value: chain3.toSha(1, "mc")})

// var Chain3 = require('../../RestAPI/index.js');
var Chain3 = require('chain3');
var chain3 = new Chain3();

// for (var p in chain3 )
//   console.log("method:", p);
// return;

//Example codes to deploy the contrat to MOAC through Chain3
const fs = require("fs");
const solc = require('solc')
// let Web3 = require('web3');

// let web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
//local input of the contract
var input = {
    'mytoken.sol': fs.readFileSync('examples/mytoken.sol', 'utf8')
};

let output = solc.compile({sources: input}, 1);
// for (var contractName in output.contracts) {
//     // code and ABI that are needed by web3
//     console.log(contractName + ': ' + output.contracts[contractName].bytecode)
//     console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface))
// }
// // console.log(compiledContract.contracts);
// // for (var p in output.contracts)
// //   console.log("Contract method:", p);
// return;
let abi = output.contracts['mytoken.sol:TokenERC20'].interface;
let bytecode = '0x'+output.contracts['mytoken.sol:TokenERC20'].bytecode;


chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

let gasEstimate = chain3.mc.estimateGas({data: bytecode});
console.log("Gas Estimate on contract:", gasEstimate);

return;



var lms = LMS.new("sanchit", "s@a.com", {
   from:chain3.mc.coinbase,
   data:bytecode,
   gas: gasEstimate
 }, function(err, myContract){
    if(!err) {
       if(!myContract.address) {
           console.log(myContract.transactionHash) 
       } else {
           console.log(myContract.address) 
       }
    }
  });
return;

var inadd = "mFEZrK6AbkJacCN5aBRn6a2fGwgkVZW";
// console.log("test:", chain3.isMoacAddress(inadd));
// console.log("HEX format:", chain3.fromMoacAddress(inadd));
// return;

// var hexadd = chain3.fromMoacAddress(inadd);

// const mctokenAbi             = require('../mctoken_abi.json');
// const mctokenAddress = "0xcc03bfab94686e12054c217f1ff53ef61e653808";

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

var tokenabi='[{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]';
var tokenaddress='0x0a674edac2ccd47ae2a3197ea3163aa81087fbd1';
var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));
var tcalls=tokenContract.at(tokenaddress);


// var tokenAbi='[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]';
// var tokenAddress="0x25B1c7e88f4038eB952967B33A28F22C4C3473a0";
var totalBal = 0;

if ( chain3.isConnected() ){
    console.log("RPC connected, check token balance");
    //Check all the balances in the node
for (var acctNum in chain3.mc.accounts) {
    var acct = chain3.mc.accounts[acctNum];
    var acctBal = tcalls.balanceOf(acct);
    totalBal += parseFloat(acctBal);
    console.log("  mc.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal);
}
console.log("  Total balance: " + totalBal);

    // console.log("Balance:", chain3.mc.getBalance(inadd));

    // var tokenContract = chain3.mc.contract(tokenabi);
    // tokenbal = {
    //     token: "MOAC",
    //     address: tokenaddress,
    //     value: tokenContract.at(tokenaddress).balanceOf(query.address)
    // };
    // response.balance = tokenbal;
    // console.log("token bal:", tokenbal);
    // var tokenContract = chain3.mc.contract(mctokenAbi);
//console.log("Contract:", tokenContract);
//Check the input address
// console.log("Balance:", tokenContract.at(mctokenAddress).balanceOf(hexadd));
// console.log("Balance:", tokenContract.at(mctokenAddress).balanceOf(inadd));
//test on the contract;

}else
    console.log("RPC not connected!");


return;

