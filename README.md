{
  "name": "moac-lib",
  "version": "0.1.0",
  "description": "A javascript library for Mother Of All Chain(MOAC) project.",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/MOACChain/moac-lib.git"
  },
  "scripts": {
    "build-js": "browserify index.js --s moaclib -g [ babelify --presets [ es2015 react ] ] | uglifyjs -c > dist/moaclib.min.js",
    "build-dev": "browserify index.js -o dist/lightwallet.js --s lightwallet -g [ babelify --presets [ es2015 react ] ]",
    "test": "./node_modules/.bin/mocha --reporter spec",
    "coverage": "istanbul cover _mocha -- -R spec; open coverage/lcov-report/index.html"
  },
  "keywords": [
    "moac",
    "blockchain",
    "transactions",
    "contracts",
    "wallet"
  ],
  "contributors": [
    {
      "name": "MOAC lab",
      "email": "info@moac.io"
    }
  ],
  "license": "MIT",
  "dependencies": {
    "bitcore-mnemonic": "^1.5.0",
    "buffer": "^4.9.0",
    "crypto-js": "^3.1.5",
    "elliptic": "^3.1.0",
    "scrypt-async": "^1.2.0",
    "tweetnacl": "0.13.2"
  },
  "devDependencies": {
    "async": "^1.4.2",
    "babel-preset-es2015": "^6.13.2",
    "babel-preset-react": "^6.11.1",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-plugin-transform-es3-member-expression-literals": "^6.22.0",
    "babel-plugin-transform-es3-property-literals": "^6.22.0",
    "babelify": "^7.3.0",
    "bluebird": "^3.3.1",
    "browserify": "^13.1.0",
    "chai": "^3.0.0",
    "hooked-web3-provider": "christianlundkvist/hooked-web3-provider#updates_web3_14",
    "istanbul": "^0.3.15",
    "mocha": "^2.2.5",
    "uglify-js": "^2.7.2"
  }
}
