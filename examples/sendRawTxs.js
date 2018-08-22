/*
 * Send the raw TX in the input JSON file
 * to the local MOAC nodes.
 * Require NODE access
 * 
*/


//libraries to generate the Tx

//MOAC chain3 lib
var Chain3 = require('chain3');
var chain3 = new Chain3();

//Read in the signedTxs
var fs = require('fs');


//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected! Cannot continue!");
    return;
}

var initBlock = chain3.mc.blockNumber;
  var i = 0;
  console.log("Cur block:", initBlock);

  while (i < initBlock+1){
    setInterval(function () { 
    console.log('wait for all TXs returned!',  chain3.mc.blockNumber); 
}, 1000); 
    i = chain3.mc.blockNumber;
  }
console.log("Final blockNumber:", i);

  return;
//Get the txcount and the balance of the src account for later check
var srcAddr = "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B";
var txcount = chain3.mc.getTransactionCount(srcAddr);
var srcBal = chain3.fromSha(chain3.mc.getBalance(srcAddr).toString(),'mc');
//check input address
console.log("Bal in mc:", srcBal, " with ", txcount, " TXs");
var initBlock = chain3.mc.blockNumber;

console.log("init:", initBlock);

var hashArray = [];//save the tx hash

fs.readFile('./signedCmds.json', 'utf8', function (err, data) {
  if (err) throw err;

  var inCmds = JSON.parse(data);
  console.log("Total Txs will be sent:", inCmds.length);

  //Go through all the input TXS
  if (inCmds.length > 0){
    for (i = 0; i < inCmds.length; i ++){
      //Send the raw TXS and saved the HASH
      chain3.mc.sendRawTransaction(inCmds[i], function(err, hash) {
        if (!err){
            console.log("TX[",i,"] Succeed!: ", hash);
            var result = {
              "cmd": inCmds[i],
              "hash": hash

            };
            hashArray.push(result);
        }else{
            var result = {
              "cmd": inCmds[i],
              "err": err.message

            };
            hashArray.push(result);
            console.log("Chain3 error:", err.message);
        }
        // res.send(response);
      });
    }

  }

  //when we get all the responses, write out to a file
  var i = 0;
  while (hashArray.length < inCmds.length && i < initBlock+1){
    console.log(hashArray.length, i);
    setInterval(function () { 
    console.log('wait for all TXs returned!',  chain3.mc.blockNumber); 
}, 5000); 
    i = chain3.mc.blockNumber;
  }
  writeResultsOut(hashArray);


});


/*
 * write the input msg to output file
*/
function writeResultsOut(hashArray){
    var outJson = JSON.stringify(hashArray);;
    var outfile = 'txReceipts'+ Math.round(new Date().getTime()/1000)+'.json';
    fs.writeFile(outfile, outJson, 'utf8');
}


return;



