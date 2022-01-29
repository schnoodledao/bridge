import React, { Component } from 'react';
import ConnectWallet from './ConnectWallet';
import $ from 'jquery';
class Error404 extends Component {
    componentDidMount = async () =>{
        $(".burger").click(function () {
            $(".burger-list").toggleClass('active');
            $(".burger").toggleClass('active');
        });

    }
    handleFAQ = () => {
        localStorage.setItem('info', "faq")
    }
    
    handleGuide = () => {
        localStorage.setItem('info', "guide")
    }

    render(){
        let page
            page = <div className="font-Roboto flex flex-col min-h-screen bg-body">

            <header className="bg-header relative z-50">
                <div className="container">
                    <div className="flex justify-between py-3 items-center w-full">
                        <div className="relative w-8 h-8 lg:hidden">
                            <button className="burger outline-none focus:outline-none"></button>
                        </div>
                        <a href="/">
                            <img className="w-40 h-auto" src="/images/logo.png" alt=""/>
                        </a>
                            <ConnectWallet/>
                            </div>
                        </div>
                    </header>
            
                    <div className="flex-grow flex justify-center items-center">
    <div className="container">
        <div className="flex justify-center items-center flex-col">
            <div className="md:text-9xl sm:text-8xl text-7xl text-white mb-5">404</div>
            <div className="uppercase sm:text-2xl text-gray-400 lg:mb-10 sm:mb-9 mb-7 text-center">Oops, sorry we can't find that page!</div>
            <a href="/">
            <button className="text-sm w-52 mx-auto h-12 bg-main-color shadow-sm hover:bg-main-color-hover block rounded-10 transition-all duration-200 text-white outline-none focus:outline-none">
                Home Page
            </button></a>
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
        return(<div>{page}</div>)}
}

export default Error404;