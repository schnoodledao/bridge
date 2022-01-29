import React, { Component } from 'react';
import '../assets/css/app.css'
import ConnectWallet from './ConnectWallet';
import $ from 'jquery';
import './contractData';
import Web3 from "web3";
import {TokenContractAddress} from './contractData'
import {TokenContractAbi} from './contractData'
import {EthContractAbi} from './contractData'
import {EthContractAddress} from './contractData'
import {BNBTokenContractAddress} from './contractData'
import {BNBTokenContractAbi} from './contractData'
import {BNBContractAbi} from './contractData'
import {BNBContractAddress} from './contractData'
import {MATICTokenContractAddress} from './contractData'
import {MATICTokenContractAbi} from './contractData'
import {MATICContractAbi} from './contractData'
import {MATICContractAddress} from './contractData'
import firebase from 'firebase/app'
import 'firebase/database'
import config from '../config'
import { BigNumber } from "bignumber.js";
import Select from 'react-select'

class MainPage extends Component {
    
    isMetaMaskInstalled = () => {
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
      }

    isMetaMaskConnected = () => localStorage.getItem('account') && localStorage.getItem('account').length > 0
    
    componentDidMount = async () =>{
        this.checkServerStatus()
        //Если умер интернет покажет ресив снова
        if (localStorage.getItem('showrecieve') === "true"){
            if(localStorage.getItem('acctosend') != null){
                this.setState({acctosend:localStorage.getItem('acctosend')})
            }
            if(localStorage.getItem('ammtosend') != null){
                this.setState({ammtosend:localStorage.getItem('ammtosend')})
            }
            if(localStorage.getItem('typetrade') != null){
                this.setState({secondNet:localStorage.getItem('typetrade')})
            }
            if(localStorage.getItem('gasPay') != null) {
                let arrNumber = []
                let arr = localStorage.getItem('gasPay').split(',')
                for(let i = 0; i <arr.length; i++){
                    arrNumber.push(Number(arr[i]))
                }
                this.setState({gasPay:arrNumber})
            } else {
                let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
                let arr = []
                let gas = 15001 * Math.pow(10,11)
                for(let i = 0; i <urlArray.length; i++){
                    arr.push(gas)
                }  
                this.setState({gasPay:arr})
            }
            this.setState({showrecieve:true})
        }


        //Подключение бургера
        $(".burger").click(function () {
            $(".burger-list").toggleClass('active');
            $(".burger").toggleClass('active');
          });

        this.getApproveInfo()
        //Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
         }else {
            firebase.app();
         }
        this.getEthFeeInfo()
        this.getBnbFeeInfo()
        this.getMaticFeeInfo()
    }

    getApproveInfo = async () => {
         if(this.isMetaMaskInstalled() && this.isMetaMaskConnected()){
                const web3 = new Web3(window.ethereum);
                await this.changeChainId()
                if (this.state.chainid.toString() === process.env.REACT_APP_NETID_ETH){
                    const instanceToken = new web3.eth.Contract(TokenContractAbi, TokenContractAddress)
                    await instanceToken.methods.allowance(localStorage.getItem('account'), EthContractAddress).call({from:localStorage.getItem('account')}).then((result)=>{
                        if (result > 1000000000){
                            this.setState({approved:true})
                        }
                    });
                } else if (this.state.chainid.toString() === process.env.REACT_APP_NETID_BSC) {
                    const instanceToken = new web3.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
                    await instanceToken.methods.allowance(localStorage.getItem('account'), BNBContractAddress).call({from:localStorage.getItem('account')}).then((result)=>{
                        if (result > 1000000000){
                            this.setState({approvedbnb:true})
                        }
                    });
                } else if (this.state.chainid.toString() === process.env.REACT_APP_NETID_MATIC) {
                    const instanceToken = new web3.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)
                    await instanceToken.methods.allowance(localStorage.getItem('account'), MATICContractAddress).call({from:localStorage.getItem('account')}).then((result)=>{
                        if (result > 1000000000){
                            this.setState({approvedmatic:true})
                        }
                    });
                }
            this.getErrorsFunc()
        }
    }

    getEthFeeInfo = async () => {
        const web3 = new Web3(process.env.REACT_APP_ETH_PROVIDER);
        let gas = await web3.eth.getGasPrice() / 1e18
        this.setState({gas:gas}) 
        firebase.database().ref('feeApprove/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let appfee = (data.approvefee * this.state.gas).toFixed(6)
                this.setState({approvefee:appfee})
            }
        })
        firebase.database().ref('feeSend/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let sendfee = (data.sendfee * this.state.gas).toFixed(6)
                this.setState({sendfee:sendfee})
            }
        })
        firebase.database().ref('feeRecieve/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let recievefee = (data.recievefee * this.state.gas).toFixed(6)
                this.setState({recievefee:recievefee})
            }
        })
    }
    getBnbFeeInfo = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_PROVIDER));
        let gas = await web3.eth.getGasPrice() / 1e18
        this.setState({gas:gas}) 
        firebase.database().ref('bnbfeeApprove/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let appfee = (data.approvefee * this.state.gas).toFixed(6)
                this.setState({bnbapprovefee:appfee})
            }
        })
        firebase.database().ref('bnbfeeSend/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let sendfee = (data.sendfee * this.state.gas).toFixed(6)
                this.setState({bnbsendfee:sendfee})
            }
        })
        firebase.database().ref('bnbfeeRecieve/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let recievefee = (data.recievefee * this.state.gas).toFixed(6)
                this.setState({bnbrecievefee:recievefee})
            }
        })
    }

    getMaticFeeInfo = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_MATIC_PROVIDER));
        let gas = await web3.eth.getGasPrice() / 1e18
        this.setState({gas:gas}) 
        firebase.database().ref('maticfeeApprove/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let appfee = (data.approvefee * this.state.gas).toFixed(6)
                this.setState({maticapprovefee:appfee})
            }
        })
        firebase.database().ref('maticfeeSend/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let sendfee = (data.sendfee * this.state.gas).toFixed(6)
                this.setState({maticsendfee:sendfee})
            }
        })
        firebase.database().ref('maticfeeRecieve/').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                let recievefee = (data.recievefee * this.state.gas).toFixed(6)
                this.setState({maticrecievefee:recievefee})
            }
        })
    }

    getErrorsFunc = () => {
        if(this.isMetaMaskInstalled()){
            this.resetErrorsFunc()
            if(this.state.firstNet === "BEP") {
                if (this.state.chainid.toString() != process.env.REACT_APP_NETID_BSC) {
                    this.setState({errormessage:<div className="text-center text-red-500  mt-2.5">Wrong chain. Swap to {this.state.firstNet} network</div>})
                }
            } else if (this.state.firstNet === "ERC") {
                if (this.state.chainid.toString() != process.env.REACT_APP_NETID_ETH) {
                    this.setState({errormessage:<div className="text-center text-red-500  mt-2.5">Wrong chain. Swap to {this.state.firstNet} network</div>})      
                }
            } else if (this.state.firstNet === "MATIC") {
                if (this.state.chainid.toString() != process.env.REACT_APP_NETID_MATIC) {
                    this.setState({errormessage:<div className="text-center text-red-500  mt-2.5">Wrong chain. Swap to {this.state.firstNet} network</div>})      
                }
            }
        }
    }

    approveFunc = async () => {
        this.checkServerStatus()
        this.setState({loadingapprove: true}) 
        var amountToken = (Math.pow(10, 18) * Math.pow(10, 18));
        var amount = "0x" + amountToken.toString(16);
        if (this.state.firstNet === 'ERC'){
            //Eth chain
            const web3 = new Web3(window.ethereum);
            const instanceToken = new web3.eth.Contract(TokenContractAbi, TokenContractAddress)
            await instanceToken.methods.approve(EthContractAddress, amount).send({from:localStorage.getItem('account')})
                .on('receipt', function(receipt){
                    var database = firebase.database();
                    database.ref('feeApprove/').set({
                            approvefee: receipt.gasUsed,})
                    })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({loadingapprove:false})
                    this.setState({approved:true})
                    this.checkServerStatus()
            }).catch(err => {
                if(err.code === 4001) {
                    this.setState({loadingapprove:false})
                }
            })
        } else if (this.state.firstNet === 'BEP') {
            //Binance Chain
            const web3 = new Web3(window.ethereum);
            const instanceToken = new web3.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
            await instanceToken.methods.approve(BNBContractAddress, amount).send({from:localStorage.getItem('account')})
                .on('receipt', function(receipt){
                    var database = firebase.database();
                    database.ref('bnbfeeApprove/').set({
                            approvefee: receipt.gasUsed,})
                    })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({loadingapprove:false})
                    this.setState({approvedbnb:true})
                    this.checkServerStatus()
            }).catch(err => {
                if(err.code === 4001) {
                    this.setState({loadingapprove:false})
                }
            })
        } else if (this.state.firstNet === 'MATIC') {
            //MATIC Chain
            const web3 = new Web3(window.ethereum);
            const instanceToken = new web3.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)
            await instanceToken.methods.approve(MATICContractAddress, amount).send({from:localStorage.getItem('account')})
                .on('receipt', function(receipt){
                    var database = firebase.database();
                    database.ref('maticfeeApprove/').set({
                            approvefee: receipt.gasUsed,})
                    })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({loadingapprove:false})
                    this.setState({approvedmatic:true})
                    this.checkServerStatus()
            }).catch(err => {
                if(err.code === 4001) {
                    this.setState({loadingapprove:false})
                }
            })
        }
      }

      sendTokensFunc = async (amount) => {
        let splittedstr = localStorage.getItem('account').split("")
        let accsend = splittedstr[0] + splittedstr[1] + splittedstr[2] + splittedstr[3] + splittedstr[4] + splittedstr[5] + "..." + splittedstr[splittedstr.length-6] + splittedstr[splittedstr.length-5] + splittedstr[splittedstr.length-4] + splittedstr[splittedstr.length-3] + splittedstr[splittedstr.length-2] + splittedstr[splittedstr.length-1]
        localStorage.setItem('acctosend', accsend)
        this.setState({acctosend:accsend})
        localStorage.setItem('ammtosend', amount)
        this.setState({ammtosend:amount})
        localStorage.setItem('typetrade', this.state.secondNet)
        if (this.state.firstNet === 'ERC'){
            this.setState({loading: true}) 
            const web3 = new Web3(window.ethereum);
            const TokenEthContract = new web3.eth.Contract(TokenContractAbi, TokenContractAddress)
            let decimals = await TokenEthContract.methods.decimals().call()
            const instanceEthContract = new web3.eth.Contract(EthContractAbi, EthContractAddress)
            let x = new BigNumber(amount)
            let y = new BigNumber(Math.pow(10,decimals))
            let amountSend =x.times(y)
            amountSend = amountSend.toString(10)
            await instanceEthContract.methods.sendTokens(amountSend).send({from:localStorage.getItem('account')})
            .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('feeSend/').set({
                        sendfee: receipt.gasUsed,})
                })
            .on('transactionHash', async (hash) =>{
                let transactionReceipt = null
                while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                    transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }

                await this.apiRequstFunc(localStorage.getItem('account'), "ERC" , this.state.secondNet)

                let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
                console.log(this.state.apiRequestAmount)
                if (this.state.apiRequestAmount != urlArray.length){
                    localStorage.setItem('showrecieve', false)
                    this.setState({serverError:"Remote server error"})
                    this.setState({apiRequestAmount:0})
                } else {
                    this.setState({apiRequestAmount:0})
                    this.setState({loading:false})
                    if (this.state.serverError === null){
                        this.setState({showrecieve:true})
                        localStorage.setItem('showrecieve', true)
                    }
                }
            }).catch(err => {
                if(err.code === 4001) {
                localStorage.setItem('showrecieve', false)
                this.setState({loading:false})
                }
            })
        } else if (this.state.firstNet === 'BEP'){
            this.setState({loading: true}) 
            const web3 = new Web3(window.ethereum);
            const TokenBNBContract = new web3.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
            let decimals = await TokenBNBContract.methods.decimals().call()
            const instanceBNBContract = new web3.eth.Contract(BNBContractAbi, BNBContractAddress)
            let x = new BigNumber(amount)
            let y = new BigNumber(Math.pow(10,decimals))
            let amountSend =x.times(y)
            amountSend = amountSend.toString(10)
            await instanceBNBContract.methods.sendTokens(amountSend).send({from:localStorage.getItem('account')})
            .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('bnbfeeSend/').set({
                        sendfee: receipt.gasUsed,})
                })
            .on('transactionHash', async (hash) => {
                let transactionReceipt = null
                while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                    transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }

                await this.apiRequstFunc(localStorage.getItem('account'), 'BEP' , this.state.secondNet)

                let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
                console.log(this.state.apiRequestAmount)
                if (this.state.apiRequestAmount != urlArray.length){
                    localStorage.setItem('showrecieve', false)
                    this.setState({serverError:"Remote server error"})
                    this.setState({apiRequestAmount:0})
                } else {
                    this.setState({apiRequestAmount:0})
                    this.setState({loading:false})
                    if (this.state.serverError === null){
                        this.setState({showrecieve:true})
                        localStorage.setItem('showrecieve', true)
                    }
                }
            }).catch(err => {
                if(err.code === 4001) {
                localStorage.setItem('showrecieve', false)
                this.setState({loading:false})
                }
            })
       
        } else if (this.state.firstNet === 'MATIC'){
            this.setState({loading: true}) 
            const web3 = new Web3(window.ethereum);
            const TokenMATICContract = new web3.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)
            let decimals = await TokenMATICContract.methods.decimals().call()
            const instanceMATICContract = new web3.eth.Contract(MATICContractAbi, MATICContractAddress)
            let x = new BigNumber(amount)
            let y = new BigNumber(Math.pow(10,decimals))
            let amountSend =x.times(y)
            amountSend = amountSend.toString(10)
            await instanceMATICContract.methods.sendTokens(amountSend).send({from:localStorage.getItem('account')})
            .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('maticfeeSend/').set({
                        sendfee: receipt.gasUsed,})
                })
            .on('transactionHash', async (hash) => {
                let transactionReceipt = null
                while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                    transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }

                await this.apiRequstFunc(localStorage.getItem('account'),'MATIC', this.state.secondNet)

                let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
                console.log(this.state.apiRequestAmount)
                if (this.state.apiRequestAmount != urlArray.length){
                    localStorage.setItem('showrecieve', false)
                    this.setState({serverError:"Remote server error"})
                    this.setState({apiRequestAmount:0})
                } else {
                    this.setState({apiRequestAmount:0})
                    this.setState({loading:false})
                    if (this.state.serverError === null){
                        this.setState({showrecieve:true})
                        localStorage.setItem('showrecieve', true)
                    }
                }
            }).catch(err => {
                if(err.code === 4001) {
                localStorage.setItem('showrecieve', false)
                this.setState({loading:false})
                }
            })
        }
    }

    resetErrorsFunc = async () => {
        this.setState({errormessage: null})
    }

    apiRequstFunc = async (account, typeSwap, typeRecieve) => {
        let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
        for(let i = 0; i < urlArray.length; i++ ){
            await this.apiOneRequest(urlArray[i], account, typeSwap, typeRecieve)
        }
    }

    apiOneRequest = async (server, account, typeSwap, typeRecieve) => {
        try{
            let response = await fetch("http://" + server + "/WriteTransaction",{
                    method: 'POST',
                    body: JSON.stringify({address: account, typeSwap: typeSwap, typeRecieve: typeRecieve}),
            });  
            if (response.ok) {
                let json = await response.json();
                console.log(json.response)
                if (json.response === "error") {
                    localStorage.setItem('showrecieve', false)
                    this.setState({serverError:json.error})
                } 
                if (json.response === "busy") {
                    await new Promise(resolve => setTimeout(resolve, 15000))
                    this.apiOneRequest(server, account, typeSwap, typeRecieve)
                } else {
                    let howmuch = this.state.apiRequestAmount + 1
                    console.log(howmuch)
                    this.setState({apiRequestAmount:howmuch}) 
                }
                    
                
                let array = this.state.gasPay
                array.push(json.gas)
                this.setState({gasPay:array})
                localStorage.setItem('gasPay', array)
            } else {
                localStorage.setItem('showrecieve', false)
                console.log("Error HTTP: " + response.status)
            }
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 15000))
            this.apiOneRequest(server, account, typeSwap)
        }
    }

    changeChainId = async () => {
        const web3 = new Web3(window.ethereum);
        let chainid = await web3.eth.net.getId()
        this.setState({chainid:chainid})
    }

    recieveTokensFunc = async () => {
        this.checkServerStatus()
        if (this.state.secondNet === 'BEP'){
            this.setState({loadingrecieve:true})    
            const web3 = new Web3(window.ethereum);
            this.changeChainId()
            const bnbContract = new web3.eth.Contract(BNBContractAbi, BNBContractAddress)
            let arrGas = this.state.gasPay
            let sum = 0
            for(let i = 0; i < arrGas.length; i++) {
                sum += arrGas[i]
            }
            if (sum <= arrGas.length * 150000 * Math.pow(10,9)) {
                sum = arrGas.length * 150001 * Math.pow(10,9)
            }
            sum = sum.toFixed(0)
            const amount = sum.toString(); 
            console.log(amount)
            console.log(sum)
            let gasPrice = await web3.eth.getGasPrice()
            if(arrGas.length === 1){
                await bnbContract.methods.recieveTokens([arrGas[0].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                    var database = firebase.database();
                    database.ref('bnbfeeRecieve/').set({
                            recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            } else if (arrGas.length === 3) {
                await bnbContract.methods.recieveTokens([arrGas[0].toString(),arrGas[1].toString(),arrGas[2].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                    var database = firebase.database();
                    database.ref('bnbfeeRecieve/').set({
                            recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            }


        } else if (this.state.secondNet === 'ERC') {
            this.setState({loadingrecieve:true})
            const web3 = new Web3(window.ethereum);
            this.changeChainId()
            const instanceEthContract = new web3.eth.Contract(EthContractAbi, EthContractAddress)
            let arrGas = this.state.gasPay
            let sum = 0
            for(let i = 0; i < arrGas.length; i++) {
                sum += arrGas[i]
            }
            if (sum <= arrGas.length * 150000 * Math.pow(10,9)) {
                sum = arrGas.length * 150001 * Math.pow(10,9)
            }
            sum = sum.toFixed(0)
            const amount = sum.toString(); 
            console.log(amount)
            console.log(sum)
            let gasPrice = await web3.eth.getGasPrice()
            if(arrGas.length === 1){
                await instanceEthContract.methods.recieveTokens([arrGas[0].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('feeRecieve/').set({
                        recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            } else if (arrGas.length === 3){
                await instanceEthContract.methods.recieveTokens([arrGas[0].toString(),arrGas[1].toString(),arrGas[2].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('feeRecieve/').set({
                        recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            }
        } else if (this.state.secondNet === 'MATIC') {
            this.setState({loadingrecieve:true})
            const web3 = new Web3(window.ethereum);
            this.changeChainId()
            const instanceMATICContract = new web3.eth.Contract(MATICContractAbi, MATICContractAddress)
            let arrGas = this.state.gasPay
            let sum = 0
            for(let i = 0; i < arrGas.length; i++) {
                sum += arrGas[i]
            }
            if (sum <= arrGas.length * 150000 * Math.pow(10,9)) {
                sum = arrGas.length * 150001 * Math.pow(10,9)
            }
            sum = sum.toFixed(0)
            const amount = sum.toString(); 
            console.log(amount)
            console.log(sum)
            let gasPrice = await web3.eth.getGasPrice()
            if(arrGas.length === 1){
                await instanceMATICContract.methods.recieveTokens([arrGas[0].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('maticfeeRecieve/').set({
                        recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            } else if (arrGas.length === 3){
                await instanceMATICContract.methods.recieveTokens([arrGas[0].toString(),arrGas[1].toString(),arrGas[2].toString()]).send({from:localStorage.getItem('account'),value:amount,gasPrice: web3.eth.gasPrice})
                .on('receipt', function(receipt){
                var database = firebase.database();
                database.ref('maticfeeRecieve/').set({
                        recievefee: receipt.gasUsed + sum/gasPrice,})
                })
                .on('transactionHash', async (hash) =>{
                    let transactionReceipt = null
                    while (transactionReceipt === null) { // Waiting expectedBlockTime until the transaction is mined
                        transactionReceipt = await web3.eth.getTransactionReceipt(hash);
                        await new Promise(resolve => setTimeout(resolve, 1000))
                    }
                    this.setState({hash:hash})
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:false})
                    this.setState({showend:true})
                    localStorage.setItem('showrecieve', false)
                    this.setState({gasPay:[]})
                }).catch(err => {
                    if(err.code === 4001) {
                    this.setState({loadingrecieve:false})
                    this.setState({showrecieve:true})
                    localStorage.setItem('showrecieve', true)
                    }
                })
            }
        }
    }

    checkTokenBalance = async (amount) => {
        if(this.isMetaMaskInstalled() && this.isMetaMaskConnected()){
            //console.log(amount, typeof amount)
            if(!isNaN(+amount)) {
                if(this.state.chainid.toString() === process.env.REACT_APP_NETID_BSC){

                    const web3 = new Web3(window.ethereum);
                    const web3eth = new Web3(process.env.REACT_APP_ETH_PROVIDER);
                    const web3matic = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_MATIC_PROVIDER));

                    const TokenBNBContract = new web3.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
                    const TokenEthContract = new web3eth.eth.Contract(TokenContractAbi, TokenContractAddress)
                    const TokenMaticContract = new web3matic.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)

                    let ETHBridgeBalance = await TokenEthContract.methods.balanceOf(EthContractAddress).call()
                    let MATICBridgeBalance = await TokenMaticContract.methods.balanceOf(MATICContractAddress).call()

                    let decimals = await TokenBNBContract.methods.decimals().call()
                    let currentBalance = await TokenBNBContract.methods.balanceOf(localStorage.getItem('account')).call()
                    if(parseFloat(amount) * Math.pow(10,decimals) > currentBalance) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens for transaction</div>})
                    } else if (this.state.secondNet === "ERC" && (parseFloat(amount) * Math.pow(10,decimals) > ETHBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on ETH bridge</div>})
                    } else if (this.state.secondNet === "MATIC" && (parseFloat(amount) * Math.pow(10,decimals) > MATICBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on MATIC bridge</div>})
                    } else if (parseFloat(amount) < Math.pow(10,-decimals)){
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Token amount below minimum</div>})
                    } else {
                        this.setState({errormessageSend:null})
                    }
                } else if(this.state.chainid.toString() === process.env.REACT_APP_NETID_ETH){

                    const web3 = new Web3(window.ethereum);
                    const web3bsc = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_PROVIDER));
                    const web3matic = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_MATIC_PROVIDER));

                    const TokenEthContract = new web3.eth.Contract(TokenContractAbi, TokenContractAddress)
                    const TokenBNBContract = new web3bsc.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
                    const TokenMaticContract = new web3matic.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)

                    let BSCBridgeBalance = await TokenBNBContract.methods.balanceOf(BNBContractAddress).call()
                    let MATICBridgeBalance = await TokenMaticContract.methods.balanceOf(MATICContractAddress).call()

                    let decimals = await TokenEthContract.methods.decimals().call()
                    let currentBalance = await TokenEthContract.methods.balanceOf(localStorage.getItem('account')).call()
                    if(parseFloat(amount) * Math.pow(10,decimals) > currentBalance) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens for transaction</div>})
                    } else if (this.state.secondNet === "BEP" && (parseFloat(amount) * Math.pow(10,decimals) > BSCBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on BSC bridge</div>})
                    } else if (this.state.secondNet === "MATIC" && (parseFloat(amount) * Math.pow(10,decimals) > MATICBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on MATIC bridge</div>})
                    } else if (parseFloat(amount) < Math.pow(10,-decimals)){
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Token amount below minimum</div>})
                    } else {
                        this.setState({errormessageSend:null})
                    }
                } else if(this.state.chainid.toString() === process.env.REACT_APP_NETID_MATIC){

                    const web3 = new Web3(window.ethereum);
                    const web3bsc = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_BSC_PROVIDER));
                    const web3eth = new Web3(process.env.REACT_APP_ETH_PROVIDER);

                    const TokenMaticContract = new web3.eth.Contract(MATICTokenContractAbi, MATICTokenContractAddress)
                    const TokenBNBContract = new web3bsc.eth.Contract(BNBTokenContractAbi, BNBTokenContractAddress)
                    const TokenEthContract = new web3eth.eth.Contract(TokenContractAbi, TokenContractAddress)

                    let BSCBridgeBalance = await TokenBNBContract.methods.balanceOf(BNBContractAddress).call()
                    let ETHBridgeBalance = await TokenEthContract.methods.balanceOf(EthContractAddress).call()

                    let decimals = await TokenMaticContract.methods.decimals().call()
                    let currentBalance = await TokenMaticContract.methods.balanceOf(localStorage.getItem('account')).call()
                    if(parseFloat(amount) * Math.pow(10,decimals) > currentBalance) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens for transaction</div>})
                    } else if (this.state.secondNet === "BEP" && (parseFloat(amount) * Math.pow(10,decimals) > BSCBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on BSC bridge</div>})
                    } else if (this.state.secondNet === "ERC" && (parseFloat(amount) * Math.pow(10,decimals) > ETHBridgeBalance)) {
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Not enough tokens on ETH bridge</div>})
                    } else if (parseFloat(amount) < Math.pow(10,-decimals)){
                        this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Token amount below minimum</div>})
                    } else {
                        this.setState({errormessageSend:null})
                    }
                }
            } else {
                this.setState({errormessageSend:<div className="text-center text-red-500 mt-2.5">Wrong input</div>})
            }
        }
    }

    endButton = () => {
        this.setState({amount:null})
        this.resetErrorsFunc()
        this.firstNetReset()
        this.setState({showend:false})
    }

    resetApprove = () => {
        this.setState({approved:false}) 
        this.setState({approvedbnb:false}) 
        this.setState({approvedmatic:false}) 
        this.setState({chainid:0}) 
    }

    handleFAQ = () => {
        localStorage.setItem('info', "faq")
    }
    
    handleGuide = () => {
        localStorage.setItem('info', "guide")
    }

    checkServerStatus = async () => {
        let urlArray = process.env.REACT_APP_SERVER_URLS.split(' ')
        for(let i = 0; i < urlArray.length; i++ ){
            let response = await fetch("http://" + urlArray[i] + "/CheckServer").catch(function(err){
            console.log(err)
            this.setState({serverstatus:false})
            }.bind(this));  
            if (response != null)  {
                if (response.ok) {
                    let json = await response.json();
                    console.log(json.response)
                } else {
                    console.log("Error HTTP: " + response.status)
                    this.setState({serverstatus:false})
                }
            }
        }
    }

    handleChange = e => {
        this.resetErrorsFunc()
        this.setState({firstNet:e.value, typeSwap:""});
        console.log(e.value)
      }
    
    handleChangeSecond = e => {
        let typeSwap = this.state.firstNet + "to" + e.value
        this.setState({typeSwap:typeSwap,secondNet: e.value})
        console.log(typeSwap)
        if(this.isMetaMaskConnected()){
            this.getErrorsFunc()
        }
        // console.log(e.value)
    }

    firstNetReset = () => {
        this.setState({firstNet:""})
    }

    handleChangeAmount = async (event) => {
        //console.log(event.target.value)
        let write = event.target.value
        this.setState({amount:write})
        this.checkTokenBalance(write)
    }
    handleSubmit = async (event) =>{
        this.sendTokensFunc(this.state.amount)
        // event.preventDefault()
    }
    constructor(props){
        super(props)
        this.state = {
            bridge: 'BEPtoERC',
            loading: false,
            loadingapprove: false,
            Token: null,
            approved: false,
            approvedbnb: false,
            database: null,
            approvefee: 0,
            sendfee: 0,
            recievefee: 0,
            bnbapprovefee: 0,
            bnbsendfee: 0,
            bnbrecievefee: 0,
            maticapprovefee: 0,
            maticsendfee: 0,
            maticrecievefee: 0,
            gas:0,
            showrecieve:false,
            acctosend: 0x0,
            ammtosend:0,
            chainid:0,
            hash:"",
            serverstatus:true,
            loadingrecieve:false,
            showend:false,
            serverError: null,
            gasPay: [],
            apiRequestAmount: 0,
            firstNet: "",
            secondNet: "",
            approvedmatic:false,
            typeSwap: "",
            errormessage: null,
            amount:null,
            errormessageSend:null,
        }
    }
    render(){ 
        const options = [
            //{ value: 'MATIC', label: 'MATIC' },
            { value: 'BEP', label: 'BEP20' },
            { value: 'ERC', label: 'ERC20' },
          ]
        var options2 = []
        if (this.state.firstNet === 'MATIC') {
            options2 = [
                { value: 'BEP', label: 'BEP20' },
                { value: 'ERC', label: 'ERC20' },
              ]
        } else if (this.state.firstNet === 'BEP') {
            options2 = [
                // { value: 'MATIC', label: 'MATIC' },
                { value: 'ERC', label: 'ERC20' },
              ]
        } else if (this.state.firstNet === 'ERC') {
            options2 = [
                //{ value: 'MATIC', label: 'MATIC' },
                { value: 'BEP', label: 'BEP20' },
              ]
        }
        const Styles = {
            valueContainer: () => ({
                width:60,
            }),
            singleValue: base => ({
                ...base,
                color: "#dc20bc"
              }),
            control: (base, state) => ({
                ...base,
                background: "#070c39",
                border: "none",
            }),
            dropdownIndicator: base => ({
                ...base,
                color: "#dc20bc"
              }),
            menuList: base => ({
                ...base,
                background:"#070c39",
                color: "#dc20bc",
              }),
            option: (provided,state) => ({
                ...provided,
                color: state.isSelected || state.isFocused ? '#dc20bc' : '#6f1860',
                background: state.isSelected ? '#070c39' : state.isFocused ? "#070c39" : "#070c39",
            }) 
        }
        let bridge;
        if (this.state.loading === true){
            bridge = <div className="col-span-7 lg:px-6 lg:bg-tutu lg:py-10 rounded-xl lg:bg-main-bg bg-transparent flex items-center flex-col justify-center mt-14 lg:mt-0">
                <img src="/images/load.svg" alt="" className="w-16 h-16 mb-8 lg:mb-11 animate-spin"/>
                <div className=" text-2xl lg:text-3xl leading-snug text-white text-center">Please wait while the token swap transaction is confirmed...
            </div>
        </div>
        } else if (this.state.loadingapprove === true){
            bridge = <div className="col-span-7 lg:px-6 lg:bg-tutu lg:py-10 rounded-xl lg:bg-main-bg bg-transparent flex items-center flex-col justify-center mt-14 lg:mt-0">
                <img src="/images/load.svg" alt="" className="w-16 h-16 mb-8 lg:mb-11 animate-spin"/>
                <div className=" text-2xl lg:text-3xl leading-snug text-white text-center">Please wait while the token approve is finished...
            </div>
        </div>
        } else if (this.state.loadingrecieve === true){
            bridge = <div className="col-span-7 lg:px-6 lg:bg-tutu lg:py-10 rounded-xl lg:bg-main-bg bg-transparent flex items-center flex-col justify-center mt-14 lg:mt-0">
                <img src="/images/load.svg" alt="" className="w-16 h-16 mb-8 lg:mb-11 animate-spin"/>
                <div className=" text-2xl lg:text-3xl leading-snug text-white text-center">Please wait while the token recieve is finished...
            </div>
        </div>
        } else if (this.state.showend === true) {
            bridge = <div className="col-span-7 lg:bg-main-bg bg-transparent lg:py-40 pt-10  lg:px-14 px-4 rounded-xl flex items-center flex-col justify-center text-2xl lg:text-3xl text-white">
            <div className="flex items-center flex-col text-2xl lg:text-3xl ">
                <div className="text-center mb-9 leading-normal">We sent you <span className="text-main-color font-medium">{this.state.ammtosend}</span> <span className="font-bold">{"SNOOD " + (this.state.secondNet === 'MATIC'? 'MATIC' : (this.state.secondNet + "20"))}</span> tokens to the address <span> 
            <a className="text-main-color font-medium underline transition-all duration-200 hover:text-main-color-hover">{this.state.acctosend}</a></span></div>
            <div className="text-lg mb-16 lg:mb-5 text-center">You can track the transaction: <a href={this.state.secondNet === 'BEP'?"http://testnet.bscscan.com/tx/" + this.state.hash:this.state.secondNet === 'MATIC' ? "http://polygonscan.com/tx/" + this.state.hash: ("http://kovan.etherscan.io/tx/" + this.state.hash)} target="_blank" rel="noreferrer"
           className="text-main-color transition-all duration-200 hover:text-main-color-hover hover:underline">link</a>
            </div>
                <button onClick={() => this.endButton()} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">
                    END
                </button>
            </div>
        </div>
        } else if (this.state.serverstatus === false){
            bridge = <div className="col-span-7 lg:px-6 lg:bg-tutu lg:py-10 rounded-xl lg:bg-main-bg bg-transparent flex items-center flex-col justify-center mt-14 lg:mt-0">
                <div className=" text-2xl lg:text-3xl leading-snug text-white text-center">Service is now unavailable
            </div>
        </div>
        } else if (this.state.serverError != null){
            bridge = <div className="col-span-7 lg:px-6 lg:bg-tutu lg:py-10 rounded-xl lg:bg-main-bg bg-transparent flex items-center flex-col justify-center mt-14 lg:mt-0">
                <div className=" text-2xl lg:text-3xl leading-snug text-white text-center">{"Remote server error: " + this.state.serverError}
            </div>
        </div>
        } else if (this.state.showrecieve === true){
            bridge = <div className="col-span-7 lg:bg-main-bg lg:py-40 pt-10  lg:px-14 px-4 rounded-xl bg-transparent flex items-center flex-col justify-center text-2xl lg:text-3xl text-white">
            <div className="text-center mb-14 leading-normal ">You will receive <span
                        className="text-main-color font-medium">{this.state.ammtosend}</span> <span className="font-bold">{"SNOOD "+ (this.state.secondNet === 'MATIC'? 'MATIC' : (this.state.secondNet + "20"))}</span> tokens at <span> 
                    <div
                      className="text-main-color hover:text-main-color-hover font-medium underline transition-all duration-200">{this.state.acctosend}</div></span>
                </div>
                {this.state.secondNet === 'ERC'?( this.state.chainid.toString() === process.env.REACT_APP_NETID_ETH ? <button onClick={() => this.recieveTokensFunc()} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">
                    RECEIVE
                </button>:<button onClick={this.recieveTokensFunc} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none button--disabled">
                    RECEIVE
                </button>):this.state.secondNet === 'BEP'?(this.state.chainid.toString() === process.env.REACT_APP_NETID_BSC ? <button onClick={() => this.recieveTokensFunc()} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">
                    RECEIVE
                </button>:<button onClick={this.recieveTokensFunc} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none button--disabled">
                    RECEIVE
                </button>):(this.state.chainid.toString() === process.env.REACT_APP_NETID_MATIC ? <button onClick={() => this.recieveTokensFunc()} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">
                    RECEIVE
                </button>:<button onClick={this.recieveTokensFunc} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none button--disabled">
                    RECEIVE
                </button>)}
                {this.state.secondNet === 'ERC'?(this.state.chainid.toString() === process.env.REACT_APP_NETID_ETH ? null :<div className="text-center text-sm mt-2.5">Swap to ETH network</div>):this.state.secondNet === 'BEP'?(this.state.chainid.toString() === process.env.REACT_APP_NETID_BSC ? null :<div className="text-center text-sm mt-2.5">Swap to BSC network</div>):(this.state.chainid.toString() === process.env.REACT_APP_NETID_MATIC ? null :<div className="text-center text-sm mt-2.5">Swap to MATIC network</div>)}
            </div>
        } else {
            bridge = 
            <div className="col-span-7 lg:px-6 lg:py-10 rounded-13 lg:bg-main-bg bg-transparent">
                <div className="flex items-center lg:mb-9 mb-6 flex-col lg:flex-row">
                    <div className="w-full lg:w-5/12 p-5 lg:p-0 rounded-xl bg-second-bg lg:bg-transparent">
                        <div className="font-bold text-xs lg:mb-4 text-main-color">From</div>
                        <div className="flex items-center justify-between lg:p-4 bg-second-bg rounded-lg">
                            <div className="">
                                <div className="text-second-text opacity-50 uppercase text-xl font-bold">
                                    SNOOD
                                </div>
                                            <Select styles={Styles} options={options} onChange={this.handleChange} components={{IndicatorSeparator: () => null}}/>
                                            </div>
                            <div className="rounded-full w-16 h-16 flex justify-center items-center">
                                <img src="/images/logo-round.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 bg-main-color w-10 h-10 lg:mx-6 rounded-10 outline-none focus:outline-none -mt-3 lg:mt-7 relative z-20 lg:static transform rotate-90  lg:transform-none">
                        <img className="block w-5 h-5 mx-auto" src="/images/arrows.svg" alt=""/>
                    </button>
                    <div className="w-full lg:w-5/12 relative -top-3 lg:static bg-second-bg lg:bg-transparent p-5 lg:p-0 rounded-xl">
                        <div className="font-bold text-xs lg:mb-4 text-main-color">To</div>
                        <div className="flex items-center justify-between lg:p-5 bg-second-bg rounded-lg">
                            <div className="">
                                <div className="text-second-text opacity-50 uppercase text-xl font-bold">
                                    SNOOD
                                </div>
                                            <Select styles={Styles} options={options2} onChange={this.handleChangeSecond} components={{IndicatorSeparator: () => null}}/>
                                            </div>
                            <div className="w-16 h-16 flex justify-center items-center rounded-full">
                                <img src="/images/logo-round.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-50 text-white md:text-base mb-4 tracking-wide text-xs">Details</div>
                <form id="form" onSubmit={this.handleSubmit}>
                <div className="flex flex-col border-solid mb-10 lg:mb-16">
                    <input onChange={this.handleChangeAmount} className="w-full text-white bg-third-bg rounded-md text-sm border border-border p-3.5 font-medium outline-none focus:outline-none"
                           placeholder="Amount" type="text"/>
                </div>
                            {this.state.typeSwap != "" && this.state.errormessage === null && this.isMetaMaskInstalled() && this.isMetaMaskConnected() ? (this.state.firstNet === "BEP" && this.state.approvedbnb === false) || (this.state.firstNet === "ERC" && this.state.approved === false) || (this.state.firstNet === "MATIC" && this.state.approvedmatic === false)?<button onClick={this.approveFunc} className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">Approve Token</button>: (this.state.errormessageSend === null && this.state.amount != null && this.isMetaMaskConnected() ? <button from="form" type="submit" className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none">Send Tokens</button> :<button from="form" type="submit" className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none button--disabled">Send Tokens</button>)
                            : <button className="text-sm max-w-xs w-full mx-auto h-12 bg-main-color block rounded transition-all duration-200 hover:bg-main-color-hover text-white outline-none focus:outline-none button--disabled">Approve Token</button>}
                            </form>{this.state.errormessageSend}
                            {this.state.errormessage}
                        </div>
        }
        
        return(
<div className="font-Roboto flex flex-col min-h-screen bg-body">

<header className="bg-header relative z-50">
    <div className="container">
        <div className="flex justify-between py-3 items-center w-full">
            <div className="relative w-8 h-8 lg:hidden">
                <button className="burger outline-none focus:outline-none"></button>
            </div>
            <a href="/">
                <img className="w-40 h-auto" src="/images/logo.png" alt=""/>
            </a>
                <ConnectWallet getApproveInfo = {this.getApproveInfo} resetApprove = {this.resetApprove} changeChainId = {this.changeChainId} getErrorsFunc = {this.getErrorsFunc} resetErrorsFunc = {this.resetErrorsFunc}/>
            </div>
        </div>
</header>

<div className="lg:py-16 py-10 flex-grow">
    <div className="container">
        <div className="lg:grid grid-cols-12 block">
            <div className="col-span-5 rounded-13 lg:px-8 lg:mr-8 lg:py-10 lg:bg-main-bg bg-transparent relative">
                <div className="text-3xl lg:mb-8 mb-4 text-gradient bg-gradient-to-r from-purple-from to-purple-to">Schnoodle Bridge</div>
                    <div className="lg:mb-8 mb-4 text-white">The bridge allows to exchange ERC20 tokens for BEP20 tokens as well as BEP20 for ERC20
                    {/* , MATIC */}
                    </div>
                    <a className="font-bold text-main-color lg:block mb-8 hidden text-xl transition-all duration-200 hover:text-main-color-hover"
                   href="/info" onClick={() => this.handleGuide()}>Token exchange guide</a>
                <a className="font-bold text-main-color lg:block mb-8 hidden text-xl  transition-all duration-200 hover:text-main-color-hover"
                   href="/info" onClick={() => this.handleFAQ()}>FAQ</a>
                <div className="flex font-bold text-second-color lg:mb-8 mb-2 text-xl items-center">Fees
                </div>
                <div className="flex text-main-text mb-1.5">
                    Approve:
                    <div className="ml-1.5 text-white">{this.state.firstNet === 'ERC'? ("~ " + this.state.approvefee.toString() + " ETH"):(this.state.firstNet === 'MATIC'? ("~ " + this.state.maticapprovefee.toString() + " MATIC"):("~ " + this.state.bnbapprovefee.toString() + " BNB"))}</div>
                </div>
                <div className="flex text-main-text mb-1.5">
                    Send:
                    <div className="ml-1.5 text-white">{this.state.firstNet === 'ERC'? ("~ " + this.state.sendfee.toString() + " ETH"):(this.state.firstNet === 'MATIC'? ("~ " + this.state.maticsendfee.toString() + " MATIC"):("~ " + this.state.bnbsendfee.toString() + " BNB"))}</div>
                </div>
                <div className="flex text-main-text mb-7">
                    Receive:
                    <div className="ml-1.5 text-white">{this.state.secondNet === 'BEP'? ("~ " + this.state.bnbrecievefee.toString() + " BNB"):this.state.secondNet === 'MATIC'? ("~ " + this.state.maticrecievefee.toString() + " MATIC"):("~ " + this.state.recievefee.toString() + " ETH")}</div>
                </div>
            </div>
            {bridge}
        </div>
    </div>
</div>

<footer className=" hidden lg:block bg-main-bg h-9">
</footer>
        
<div className="burger-list bg-main-bg mr-20 h-auto p-8 pt-24 pb-0 fixed top-0 left-0 z-30 overflow-y-auto h-full">
    <div className="text-2xl lg:text-3xl mb-16 block text-white">Schnoodle Bridge</div>
    <a className="font-bold text-xl text-main-color mb-8 block" href="/">Main Page</a>
    <a href="/info" className="font-bold text-xl text-second-color mb-8 block" onClick={() => this.handleGuide()}>Token exchange guide</a>
    <a href="/info" className="font-bold text-xl text-second-color mb-8 block" onClick={() => this.handleFAQ()}>FAQ</a>
</div>
</div>
    )};
}
export default MainPage;