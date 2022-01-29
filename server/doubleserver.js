const fastify = require('fastify')();
require('dotenv').config();
const Web3 = require('web3');
fs = require('fs');
var CryptoJS = require("crypto-js");
const BigNumber = require('bignumber.js');
        
const web3bnb = new Web3(new Web3.providers.HttpProvider(process.env.BSC_CHAIN));
const web3 = new Web3(process.env.ETH_CHAIN);

const expectedBlockTime = 1000; 
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

fastify.listen(process.env.PORT,process.env.URL, function(err, address){
    if (err) {
        console.log(err);
    } else {
        console.log('Server runs on', address);
    }
})

fastify.get('/CheckServer', async (request, reply) => {
    reply
        .header("Access-Control-Allow-Origin", "*")
        .send({
        response: 'Ok'
        });
});

fastify.post('/WriteSecretKey', async (request, reply) => {
	var data = JSON.parse(request.body)
	fs.readFile('acc.json', 'utf-8', async (error, dataFile) => {
		console.log(error)
		if (data.key.toString() != "" && dataFile == null){
			const acc = {"account": data.key.toString()}
			const dataJSON = JSON.stringify(acc);;
			fs.writeFile('acc.json', dataJSON, (err) => {
				if (err) {
					reply
						.header("Access-Control-Allow-Origin", "*")
						.send({
							response: 'error'
						})
				}
			});
			reply
				.header("Access-Control-Allow-Origin", "*")
				.send({
					response: 'Ok'
				})
		} else if (data.key.toString() === "") {
			reply
				.header("Access-Control-Allow-Origin", "*")
				.send({
					response: 'request is empty'
				})
		} else {
			reply
				.header("Access-Control-Allow-Origin", "*")
				.send({
					response: 'Key already exists'
				})
		}
	});
});

const EthContractAddress = "";
const EthContractAbi = []

const BNBContractAddress = ""
const BNBContractAbi = []

var busy = false

fastify.post('/WriteTransaction', async (request, reply) => {
	if (busy === false) {
		busy = true

		var data = JSON.parse(request.body)
		console.log("====================================================================")
		console.log(Date.now())
		console.log("Data: ", data)
		fs.readFile('acc.json', 'utf-8', async (error, dataFile) => {
			if (data.address != "" && data.typeRecieve != "" && data.typeSwap != "" && data.typeRecieve != null && data.typeSwap != null){
				//ACCOUNT
				const acc = JSON.parse(dataFile.toString());
				var bytes  = CryptoJS.AES.decrypt(acc.account, process.env.KEY);
				var originalAcc = bytes.toString(CryptoJS.enc.Utf8);
				const mainPrivateKey = originalAcc
				const mainAccount = web3.eth.accounts.privateKeyToAccount(mainPrivateKey);
				//CONTRACTS
				const EthContract = new web3.eth.Contract(EthContractAbi, EthContractAddress)
				const BNBContract = new web3bnb.eth.Contract(BNBContractAbi, BNBContractAddress)
					try{
					var tokensRecievedBNB = new BigNumber(await BNBContract.methods.tokensRecieved(data.address).call())
					var tokensRecievedETH = new BigNumber(await EthContract.methods.tokensRecieved(data.address).call())
					} catch (err) {
						console.log(err)
					}
					var tokensSentETH = new BigNumber(await EthContract.methods.tokensRecievedButNotSent(data.address).call())
					var tokensSentBNB = new BigNumber(await BNBContract.methods.tokensRecievedButNotSent(data.address).call())

				let RecievedTotal = tokensRecievedBNB.plus(tokensRecievedETH)
				let SentTotal = tokensSentETH.plus(tokensSentBNB)
				const amount = RecievedTotal.minus(SentTotal)
				
				console.log(`${RecievedTotal} = ${tokensRecievedBNB} + ${tokensRecievedETH}`)
				console.log(`${SentTotal} = ${tokensSentBNB} + ${tokensSentETH}`)
				console.log(`Amount to send: ${amount} = ${RecievedTotal} - ${SentTotal}`)

				if(data.typeRecieve == "ERC"){
					var send = EthContract.methods.writeTransaction(data.address, amount)
					
					try {
						var encodedABIsend = send.encodeABI()
					} catch(error) {
						console.log(error)

						busy = false

						reply
							.header("Access-Control-Allow-Origin", "*")
							.send({
								response: 'error',
								error:error.message,
							});
					}

					gasPrice = await web3.eth.getGasPrice()

					let BiggerGasPrice = new BigNumber(gasPrice)
					BiggerGasPrice = BiggerGasPrice.times(1.2).toFixed(0)
					console.log(gasPrice, BiggerGasPrice)

					var txSend = {
						from: mainAccount.address,
						to: EthContractAddress,
						gasPrice: BiggerGasPrice,
						data: encodedABIsend,
					}

					try{

						var gasLimit = await web3.eth.estimateGas(txSend)
						console.log(gasLimit)
						txSend.gasLimit = gasLimit

					} catch (error) {
						console.log("Error gas")
						var gasLimit = 300000

						txSend.gasLimit = gasLimit
					}

					try {
						web3.eth.accounts.signTransaction(txSend, mainPrivateKey).then(async function(signed){
							var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

							tran.on('transactionHash', async function(hash){
								let transactionReceipt = null
								while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
									transactionReceipt = await web3.eth.getTransactionReceipt(hash);
									await sleep(expectedBlockTime)
								}

								busy = false
								console.log(">>>>>>>>Transaction Successful<<<<<<<<")
								reply
								.header("Access-Control-Allow-Origin", "*")
								.send({
									response: 'Ok',
									gas:transactionReceipt.gasUsed * (await web3.eth.getGasPrice())
								});
							})

							tran.on('error', error => {
								console.log(error)

								busy = false
								reply
									.header("Access-Control-Allow-Origin", "*")
									.send({
										response: 'error',
										error:error.message,
									});
							});
					})
					} catch(error) {
						console.log(error)

						busy = false

						reply
							.header("Access-Control-Allow-Origin", "*")
							.send({
								response: 'error',
								error:error.message,
							});
					}
				} else if (data.typeRecieve == "BEP"){
					var send = BNBContract.methods.writeTransaction(data.address, amount)
					
					try {
						var encodedABIsend = send.encodeABI()
					} catch(error) {
						console.log(error)

						busy = false

						reply
							.header("Access-Control-Allow-Origin", "*")
							.send({
								response: 'error',
								error:error.message,
							});
					}

					gasPrice = await web3bnb.eth.getGasPrice()

					let BiggerGasPrice = new BigNumber(gasPrice)
					BiggerGasPrice = BiggerGasPrice.times(1.2).toFixed(0)
					console.log(gasPrice, BiggerGasPrice)

					var txSend = {
						from: mainAccount.address,
						to: BNBContractAddress,
						gasPrice: BiggerGasPrice,
						data: encodedABIsend,
					}

					try{

						var gasLimit = await web3bnb.eth.estimateGas(txSend)
						console.log(gasLimit)
						txSend.gasLimit = gasLimit

					} catch (error) {
						console.log("Error gas")
						var gasLimit = 300000

						txSend.gasLimit = gasLimit
					}
				
					try {
						web3bnb.eth.accounts.signTransaction(txSend, mainPrivateKey).then(async function(signed){
							var tran = web3bnb.eth.sendSignedTransaction(signed.rawTransaction);

							tran.on('transactionHash', async function(hash){
								let transactionReceipt = null
								while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
									transactionReceipt = await web3bnb.eth.getTransactionReceipt(hash);
									await sleep(expectedBlockTime)
								}

								busy = false
								console.log(">>>>>>>>Transaction Successful<<<<<<<<")
								reply
								.header("Access-Control-Allow-Origin", "*")
								.send({
									response: 'Ok',
									gas:transactionReceipt.gasUsed * (await web3bnb.eth.getGasPrice() )
								});
							})
							
							tran.on('error', error => {
								console.log(error)
								busy = false
								reply
									.header("Access-Control-Allow-Origin", "*")
									.send({
										response: 'error',
										error:error.message,
									});
							});
						})
					} catch(error) {
						console.log(error)

						busy = false

						reply
							.header("Access-Control-Allow-Origin", "*")
							.send({
								response: 'error',
								error:error.message,
							});
					}
				}
			} else if (process.env.KEY == null) {
				busy = false
				reply
					.header("Access-Control-Allow-Origin", "*")
					.send({
					response: 'Empty Key'
					});
			} else if (error != null) {
				console.log(error)
				busy = false
				reply
					.header("Access-Control-Allow-Origin", "*")
					.send({
						response: 'error',
						error:error.message,
					});
			} else {
				busy = false
				reply
					.header("Access-Control-Allow-Origin", "*")
					.send({
					response: 'Empty Address'
					});	
			}
		});
	} else {
		reply
			.header("Access-Control-Allow-Origin", "*")
			.send({
				response: 'busy'
			});	
	}
});
