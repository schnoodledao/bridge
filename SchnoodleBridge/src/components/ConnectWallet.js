import React, { Component } from 'react';
import '../assets/css/app.css'
class ConnectWallet extends Component {
    componentDidMount = async () => {
        if (this.isMetaMaskInstalled()){
            window.ethereum.on('accountsChanged',async () =>{
            const newAccounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            // this.setState({account:[]})
            console.log(newAccounts[0])
            if (newAccounts != []) {
                this.setState({account:newAccounts[0]})
                localStorage.setItem('account', newAccounts[0])
                let acc = localStorage.getItem('account')
                let splittedstr = acc.split("")
                let accsend = splittedstr[0] + splittedstr[1] + splittedstr[2] + splittedstr[3] + splittedstr[4] + splittedstr[5] + "..." + splittedstr[splittedstr.length-6] + splittedstr[splittedstr.length-5] + splittedstr[splittedstr.length-4] + splittedstr[splittedstr.length-3] + splittedstr[splittedstr.length-2] + splittedstr[splittedstr.length-1]
                this.setState({account:newAccounts[0],butt:<div className={this.state.classDefault}>{accsend}</div>})
                this.props.resetApprove()
                this.props.resetErrorsFunc()
                this.props.getErrorsFunc()
                this.props.getApproveInfo()
            } else {
                this.props.resetApprove()
                this.props.resetErrorsFunc()
                this.setState({butt: <button onClick={() => this.handleClick()} className={this.state.classDefault}>Connect Wallet</button>})
            }
            
            })

            window.ethereum.on('chainChanged', function () {
                this.props.getErrorsFunc()
                this.props.resetApprove()
                this.props.getApproveInfo()
            }.bind(this))
        }
        if(this.isMetaMaskConnected()){
            let acc = localStorage.getItem('account')
                let splittedstr = acc.split("")
                let accsend = splittedstr[0] + splittedstr[1] + splittedstr[2] + splittedstr[3] + splittedstr[4] + splittedstr[5] + "..." + splittedstr[splittedstr.length-6] + splittedstr[splittedstr.length-5] + splittedstr[splittedstr.length-4] + splittedstr[splittedstr.length-3] + splittedstr[splittedstr.length-2] + splittedstr[splittedstr.length-1]
            this.setState({butt:<div className={this.state.classDefault}>{accsend}</div>})
        } else {
            this.setState({butt: <button onClick={() => this.handleClick()} className={this.state.classDefault}>Connect Wallet</button>})
        }
    }
    isMetaMaskInstalled = () => {
        const { ethereum } = window
        return Boolean(ethereum && ethereum.isMetaMask)
    }
    async Connect() {
        try {
                const newAccounts = await window.ethereum.request({
                  method: 'eth_requestAccounts',
                })
                localStorage.setItem('account', newAccounts[0])
                let acc = localStorage.getItem('account')
                let splittedstr = acc.split("")
                let accsend = splittedstr[0] + splittedstr[1] + splittedstr[2] + splittedstr[3] + splittedstr[4] + splittedstr[5] + "..." + splittedstr[splittedstr.length-6] + splittedstr[splittedstr.length-5] + splittedstr[splittedstr.length-4] + splittedstr[splittedstr.length-3] + splittedstr[splittedstr.length-2] + splittedstr[splittedstr.length-1]
                this.setState({account:newAccounts[0],butt:<div className={this.state.classDefault}>{accsend}</div>})
                
              } catch (error) {
                console.error(error)
              }
        this.props.getApproveInfo()
      }
    isMetaMaskConnected = () => localStorage.getItem('account') && localStorage.getItem('account').length > 0
    
    handleClick() {
        this.Connect();
    }
    constructor(props){
        super(props)
        this.state = {
            theme:"",
            account: [],
            classDefault: "min-w-min lg:text-sm text-xs font-medium lg:py-4 lg:px-6 py-2 px-4 rounded transition-all duration-200 bg-gradient-to-b via-btn-to from-purple-from to-purple-to  shadow-sm hover:bg-main-color-hover text-white outline-none focus:outline-none",
            butt:<button onClick={() => this.handleClick()} className="min-w-min lg:text-sm text-xs font-medium lg:py-4 lg:px-6 py-2 px-4 rounded transition-all duration-200 bg-gradient-to-b via-btn-to from-purple-from to-purple-to  shadow-sm hover:bg-main-color-hover text-white outline-none focus:outline-none">
            Connect Wallet
        </button>,
        }
    }
    render(){
        let content = this.state.butt;
        return (content)
    }

}

export default ConnectWallet;