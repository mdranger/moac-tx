'use strict'
const moacUtil = require('./moacutils')
const fees = require('./params.json')
const BN = moacUtil.BN
// var BigNumber = require('bignumber.js');


// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
const SystemFlag  = 0x80
const QueryFlag  = 0x40
const ShardingFlag  = 0x20

// var N_DIV_2 = new BigNumber('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

/**
 * Creates a new transaction object.
 *
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s: '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
 *   controlFlag: 0,
 *   
 * };
 * var tx = new Transaction(rawTx);
 *
 * @class
 * @param {Buffer | Array | Object} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.
 *
 * Or lastly an Object containing the Properties of the transaction like in the Usage example.
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 *
 * @property {Buffer} raw The raw rlp encoded transaction
 * @param {Buffer} data.nonce nonce number
 * @param {Buffer} data.systemContract Default = 0, don't change
 * @param {Buffer} data.gasLimit transaction gas limit
 * @param {Buffer} data.gasPrice transaction gas price
 * @param {Buffer} data.to to the to address
 * @param {Buffer} data.value the amount of ether sent
 * @param {Buffer} data.data this will contain the data of the message or the init of a contract
 * @param {Buffer} data.v EC signature parameter
 * @param {Buffer} data.r EC signature parameter
 * @param {Buffer} data.s EC recovery ID
 * @param {Number} data.chainId EIP 155 chainId - mainnet: 1, ropsten: 3
 * @param {Buffer} data.nonce nonce number
 * */

class Transaction {
  constructor (data) {
    data = data || {}

    // Define Properties,
    // The properties need to follow the data structure in MOAC
    // core/type/
    // Added two more fields
    // controlFlag, ranger (1-2)
    // ScsConsensusAddr, can be empty

    const fields = [{
      name: 'nonce',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {name: 'controlFlag',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasPrice',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasLimit',
      alias: 'gas',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'to',
      allowZero: true,
      length: 20,
      default: new Buffer([])
    }, {
      name: 'value',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'data',
      alias: 'input',
      allowZero: true,
      default: new Buffer([])
    }, { name: 'scsConsensusAddr',
      length: 20,
      allowZero: true,
      default: Buffer.alloc(20)
    },{
      name: 'v',
      allowZero: true,
      default: new Buffer([0x1c])
    }, {
      name: 'r',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 's',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }]

    /**
     * Returns the rlp encoding of the transaction
     * @method serialize
     * @return {Buffer}
     * @memberof Transaction
     * @name serialize
     */
    // attached serialize
    moacUtil.defineProperties(this, fields, data)


    /**
     * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
     * @name from
     * @memberof Transaction
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(this)
    })

    // calculate chainId from signature
    let sigV = moacUtil.bufferToInt(this.v)
    let chainId = Math.floor((sigV - 35) / 2)
    if (chainId < 0) chainId = 0

    // set chainId
    this._chainId = chainId || data.chainId || 0
    this._homestead = true

    //compute the control flag from input flags
    //systemflag, queryflag, sharding flag
    console.log("Compute controlFlag")

    Object.defineProperty(this, 'controlFlag', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(this)
    })

    // this._controlFlag = 0
    // if ( data.queryflag > 0)
    //   this.setQueryFlag(data.queryflag)

    // if (data.shardingflag > 0)
    //   this.setQueryFlag(data.queryflag)

  }


  //Control Flag format:
  //

  /**
   * Set the control flag value 
   * @return {Boolean}
   */
  setQueryFlag (inValue) {
    if ( inValue == 1 || inValue == 0){
      this.controlFlag = inValue
      return true
    }
    return false
  }

  /**
   * Set the control flag value 
   * @return {Boolean}
   */
  setShardingFlag (inValue) {
    if ( inValue == 1 || inValue == 0){
      this.controlFlag = inValue
      return true
    }
    return false
  }
  /**
   * Display the TX in JSON format
   * @return {JSON string}
   */
  toJSON () {
    var outJson = {
      'from': this.from,
      'to': this.to,
      'controlFlag':this.controlFlag,
      'gasLimit':this.gasLimit,
      'gasPrice':this.gasPrice
    };

    return outJson;
  }


  /**
   * If the tx's `to` is to the creation address
   * @return {Boolean}
   */
  toCreationAddress () {
    return this.to.toString('hex') === ''
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   * The tx need to be the same 
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   * MOAC, added SystemContract, QueryFlag and ShardingFlag items for signing
   * if the transaction structure changesm, this follows the definition in
   *  
   * MoacCore\core\types\transaction.go
   * 
   type txdata struct {
  AccountNonce uint64          `json:"nonce"    gencodec:"required"`
  ControlFlag  uint64          `json:"controlFlag" gencodec:"required"`
  Price        *big.Int        `json:"gasPrice" gencodec:"required"`
  GasLimit     *big.Int        `json:"gas"      gencodec:"required"`
  Recipient    *common.Address `json:"to"       rlp:"nil"` // nil means contract creation
  Amount       *big.Int        `json:"value"    gencodec:"required"`
  Payload      []byte          `json:"input"    gencodec:"required"`
  ScsConsensusAddr common.Address `json:"ScsConsensusAddr" gencodec:"required"`

  // Signature values
  V *big.Int `json:"v" gencodec:"required"`
  R *big.Int `json:"r" gencodec:"required"`
  S *big.Int `json:"s" gencodec:"required"`

  // This is only used when marshaling to JSON.
  Hash *common.Hash `json:"hash" rlp:"-"`
  }
   * 
   */
  hash (includeSignature) {
    if (includeSignature === undefined) includeSignature = true

    // EIP155 spec:
    // when computing the hash of a transaction for purposes of signing or recovering,
    // 
    // instead of hashing the elements (ie. nonce, systemcontract,
    // gasprice, startgas, to, value, data, queryflag, shardingflag),
    // hash the elements with three more fields, with v replaced by CHAIN_ID, r = 0 and s = 0

    //MOAC has 8 items
    //
    const min_items = 8;

    let items
    if (includeSignature) {
      items = this.raw
    } else {

      if (this._chainId > 0) {
        // console.log("id > 0")
        const raw = this.raw.slice()
        this.v = this._chainId
        this.r = 0
        this.s = 0
        items = this.raw
        this.raw = raw
      } else {
        // console.log("chainID = 0 min slice")
        items = this.raw.slice(0, min_items)
      }
    }
 // console.log("items to seri", items);
 // console.log("================");

    // create hash
    return moacUtil.rlphash(items)
  }

  /**
   * returns the chain id, 
   * @return {Buffer}
   */
  getChainId () {
    return this._chainId
  }


  /**
   * returns the fields name and value, 
   * @return {Buffer}
   */
  getFields () {
    return this._fields
  }

  /**
   * returns controlFlag value, 
   * @return {Buffer}
   */
  getControlFlag () {
    return this._fields;
  }

  /**
   * returns the sender's address
   * @return {Buffer}
   */
  getSenderAddress () {
    if (this._from) {
      return this._from
    }
    const pubkey = this.getSenderPublicKey()
    this._from = moacUtil.publicToAddress(pubkey)
    
    //add for MOAC encoding

    return this._from
  }

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */
  getSenderPublicKey () {
    if (!this._senderPubKey || !this._senderPubKey.length) {
      if (!this.verifySignature()) throw new Error('Invalid Signature')
    }
    return this._senderPubKey
  }

  /**
   * Determines if the signature is valid
   * @return {Boolean}
   */
  verifySignature () {
    const msgHash = this.hash(false)

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this._homestead && new BN(this.s).cmp(N_DIV_2) === 1) {
    // if (this._homestead && new BigNumber(this.s).cmp(N_DIV_2) === 1) {  
      return false
    }


    try {
      let v = moacUtil.bufferToInt(this.v)
          console.log("v value:", v);
      if (this._chainId > 0) {
        v -= this._chainId * 2 + 8
      }
      
      this._senderPubKey = moacUtil.ecrecover(msgHash, v, this.r, this.s)
      
      console.log('public key:', this._senderPubKey.toString('hex'))

    } catch (e) {
      return false
    }

    return !!this._senderPubKey
  }

  /**
   * sign a transaction with a given a private key
   * @param {Buffer} privateKey
   */
  sign (privateKey) {
    const msgHash = this.hash(false)

    const sig = moacUtil.ecsign(msgHash, privateKey)

    if (this._chainId > 0) {
      sig.v += this._chainId * 2 + 8
    }
    // console.log("Signed sig:", sig.toString('hex'));

    Object.assign(this, sig)
  }

  /**
   * The amount of gas paid for the data in this tx
   * @return {BN}
   */
  getDataFee () {
    const data = this.raw[5]
    const cost = new BN(0)
    // const cost = new BigNumber(0)
    for (let i = 0; i < data.length; i++) {
      data[i] === 0 ? cost.iaddn(fees.txDataZeroGas.v) : cost.iaddn(fees.txDataNonZeroGas.v)
    }
    return cost
  }

  /**
   * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   * @return {BN}
   */
  getBaseFee () {
    const fee = this.getDataFee().iaddn(fees.txGas.v)
    if (this._homestead && this.toCreationAddress()) {
      fee.iaddn(fees.txCreation.v)
    }
    return fee
  }

  /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */
  getUpfrontCost () {
    return new BN(this.gasLimit)
      .imul(new BN(this.gasPrice))
      .iadd(new BN(this.value))
    // return new BigNumber(this.gasLimit)
    //     .times(new BigNumber(this.gasPrice))
    //     .plus(new BigNumber(this.value))
  }

  /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */
  validate (stringError) {
    const errors = []
    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    if (this.getBaseFee().cmp(new BN(this.gasLimit)) > 0) {
    // if (this.getBaseFee().cmp(new BigNumber(this.gasLimit)) > 0) {  

      errors.push([`gas limit is too low. Need at least ${this.getBaseFee()}`])
    }

    if (stringError === undefined || stringError === false) {
      return errors.length === 0
    } else {
      return errors.join(' ')
    }
  }
}

module.exports = Transaction
