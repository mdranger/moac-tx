#!/usr/bin/env node

/*
 * Example program to use the Chain3 RPC commands
 * to generate a series of rawTx from one src account
 * to multiple des with certain amount
 *
 * 
*/

var Chain3 = require('chain3');
var chain3 = new Chain3();

//File operations
var fs = require('fs');

const csv = require('csv-streamify')

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected! Cannot continue!");
    return;
}

var srcAddr = "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B";

var cmdArray = [];//Array holding input rawTx commands
var chainid = 101;
// emits each line as a buffer or as a string representing an array of fields

var txcount = chain3.mc.getTransactionCount(srcAddr);
var outval = chain3.fromSha(chain3.mc.getBalance(srcAddr).toString(),'mc');//chain3.mc.getBalance(srcAddr);

//check input address
console.log("Bal in mc:", outval);
console.log("")
var sumValue = 0;

//Main parser to process the csv file and create rawTX array
//Check the balance of the send finally
 const parser = csv({ objectMode: true }, function (err, result) {
  if (err) throw err
  // our csv has been parsed succesfully
  result.forEach(function (line) {  
    var des=line[2];
    var amt=line[4];

    var rawTx = {
        to: des,
        gasPrice: chain3.intToHex(4000000000),
        gasLimit: chain3.intToHex(2000),
        value: chain3.intToHex(chain3.toSha(amt, 'mc')), 
        data: '0x00',
        chainId: chain3.intToHex(chainid)
    };
    // console.log("Value:", chain3.toSha(amt, 'mc'));
    //Save the cmd in the array
    cmdArray.push(rawTx);
  });

//After created all the cmd, 
console.log("Number of results:", cmdArray.length);
sumValue = 0;

for(var i = 0; i < cmdArray.length; i ++){
  var sendMcValue = chain3.toDecimal(chain3.fromSha(cmdArray[i].value,'mc'));
  console.log("To:", cmdArray[i].to, " value ", sendMcValue);
    console.log("Add TX count[",i,']=',txcount+i);
    cmdArray[i].nonce = chain3.intToHex(txcount+i);
    sumValue += sendMcValue;//chain3.toDecimal(cmdArray[i].value);
}
// console.log("cmdArray",cmdArray);
//Write the output TX to a JSON file for signing
var outJson = JSON.stringify(cmdArray);
fs.writeFile('inCmds.json', outJson, 'utf8');
console.log("Total send value is:", sumValue, ' vs ', outval);
if ( sumValue > outval)
  console.log("Need some depo!");

}
//Write out the cmd to a json file for processing

)
// now pipe some data into it
//Read in the input file and parse the 
fs.createReadStream('inputList.csv').pipe(parser)

return;

