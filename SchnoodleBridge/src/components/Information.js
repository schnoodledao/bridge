import React, { Component } from 'react';
import ConnectWallet from './ConnectWallet';
import $ from 'jquery';

class Information extends Component {
    componentDidMount= () =>{
        $('.tabs').on('click', '.tab:not(.tab--active)', function () {
            $(this).addClass('tab--active').siblings().removeClass('tab--active').closest('.container').find('.content').removeClass('content--active').eq($(this).index()).addClass('content--active');
          });
          $(".faq__btn").click(function () {
            $(this).next(".faq__text").slideToggle();
            $(this).find(".faq__close").toggleClass("open");
          });
          $(".burger").click(function () {
            $(".burger-list").toggleClass('active');
            $(".burger").toggleClass('active');
          });
          if (localStorage.getItem('info') === "faq") {
            $('.tabs').children('.tab:not(.tab--active)').addClass('tab--active').siblings().removeClass('tab--active').closest('.container').find('.content').removeClass('content--active').eq($('.tabs').index()).addClass('content--active');
          }
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
        
                    <div className="lg:py-16 py-10 flex-grow">
    <div className="container">
        <div className="lg:grid grid-cols-12 block">
            <div className="col-span-4 px-8 pt-11 pb-8 mr-8 lg:bg-main-bg bg-transparent rounded h-52 hidden lg:block ">
                <a href="/" className="flex mb-4 items-center group">
                <svg className="transition-all duration-200  w-3 h-2 mr-2.5 fill-current text-main-color group-hover:text-main-color-hover" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.81681 7.83254C4.6996 7.93977 4.54065 8 4.37492 8C4.2092 8 4.05025 7.93977 3.93304 7.83254L0.182994 4.40091C0.0658229 4.29365 0 4.1482 0 3.99655C0 3.84489 0.0658229 3.69944 0.182994 3.59219L3.93304 0.16055C4.05092 0.0563667 4.2088 -0.0012815 4.37268 2.16208e-05C4.53655 0.00132474 4.69331 0.061475 4.80919 0.167517C4.92507 0.273559 4.99081 0.417009 4.99223 0.566969C4.99365 0.71693 4.93066 0.861403 4.81681 0.969272L2.13365 3.42461H9.37499C9.54075 3.42461 9.69973 3.48487 9.81694 3.59212C9.93415 3.69938 10 3.84486 10 3.99655C10 4.14823 9.93415 4.29371 9.81694 4.40097C9.69973 4.50823 9.54075 4.56849 9.37499 4.56849H2.13365L4.81681 7.02382C4.93398 7.13108 4.9998 7.27653 4.9998 7.42818C4.9998 7.57984 4.93398 7.72529 4.81681 7.83254Z"/>
                    </svg>

                    <div className="transition-all duration-200  text-main-color font-bold text-xs group-hover:text-main-color-hover">Back to main page</div>
                </a>
                <div className="tabs">
                    <button className="tab tab--active w-full rounded-md border text-white border-border py-3 mb-2 outline-none focus:outline-none">
                        Token exchange guide
                    </button>
                    <button className="tab w-full text-white rounded-md border border-border py-3 outline-none focus:outline-none">
                        FAQ
                    </button>
                </div>
            </div>
            <a href="/" className="flex mb-4 items-center lg:hidden ">
                <svg className="transition-all duration-200  w-3 h-2 mr-2.5 fill-current text-faq group-hover:text-main-color" width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.81681 7.83254C4.6996 7.93977 4.54065 8 4.37492 8C4.2092 8 4.05025 7.93977 3.93304 7.83254L0.182994 4.40091C0.0658229 4.29365 0 4.1482 0 3.99655C0 3.84489 0.0658229 3.69944 0.182994 3.59219L3.93304 0.16055C4.05092 0.0563667 4.2088 -0.0012815 4.37268 2.16208e-05C4.53655 0.00132474 4.69331 0.061475 4.80919 0.167517C4.92507 0.273559 4.99081 0.417009 4.99223 0.566969C4.99365 0.71693 4.93066 0.861403 4.81681 0.969272L2.13365 3.42461H9.37499C9.54075 3.42461 9.69973 3.48487 9.81694 3.59212C9.93415 3.69938 10 3.84486 10 3.99655C10 4.14823 9.93415 4.29371 9.81694 4.40097C9.69973 4.50823 9.54075 4.56849 9.37499 4.56849H2.13365L4.81681 7.02382C4.93398 7.13108 4.9998 7.27653 4.9998 7.42818C4.9998 7.57984 4.93398 7.72529 4.81681 7.83254Z"/>
                </svg>
                <div className="text-faq font-bold text-xs">Back to main page</div>
            </a>
            <div className="col-span-8 lg:bg-main-bg bg-transparent rounded py-4 ">
                <div className=" lg:p-8 lg:py-4 content content--active lg:overflow-y-auto lg:h-56 scroll-style text-white">
                    <div className="font-bold text-3xl lg:text-4xl text-main-color mb-5 ">ERC to BEP20</div>
                    <div className="mb-8">1. Connect Wallet
                    <p>Before using bridge you need to connect your Metamask Wallet.</p>
                    </div>
                    <img className="mb-7" src="/images/f1.png" alt=""/>
                    <div className="mb-8">2. Select chains
                    <p>Select networks for tokens swap.</p>
                    </div>
                    <img className="mb-7" src="/images/f2.png" alt=""/>
                    <img className="mb-7" src="/images/f2-1.png" alt=""/>
                    <div className="mb-8">3. Approve Token
                    <p>Switch to the first network you have chosen. First time using our bridge you need to push Approve button to give our website permission for interacting with your tokens.</p>
                    </div>
                    <img className="mb-7" src="/images/f3.png" alt=""/>
                    <div className="mb-8">4. Send Tokens
                    <p>After sucsessful approve fill in "Amount" field - amount of tokens you want to transfer. After input is filled click Send button.</p>
                    </div>
                    <img className="mb-7" src="/images/f4.png" alt=""/>
                    <div className="mb-8">5. Wait for Send Transaction
                    <p>Then you need to be patient and wait until token send transaction is finished. Runtime depends on of the network difficulty.</p>
                    </div>
                    <img className="mb-7" src="/images/f5.png" alt=""/>
                    <div className="mb-8">6. Recieve
                    <p>Before clicking Recieve button you need to change chain to the second network you have chosen. After that you can click Recieve and get your tokens on the other network.</p>
                    </div>
                    <img className="mb-7" src="/images/f6.png" alt=""/>
                    <div className="mb-8">7. Wait for Recieve
                    <p>Then you need to wait until token recieve transaction is finished. Runtime depends on of the network difficulty.</p>
                    </div>
                    <img className="mb-7" src="/images/f7.png" alt=""/>
                    <div className="mb-8">8. End
                    <p>On this stage token swap is finished. You can ckick on "link" and see recieve transaction in network scaner. Clicking End button will return you back to main page of the bridge.</p>
                    </div>
                    <img className="mb-7" src="/images/f8.png" alt=""/>
                    <div className="font-bold text-3xl lg:text-4xl text-main-color mb-5 ">How to add SNOOD token in Metamask</div>
                    <div className="mb-8">In Metamask, click Add Token-Custom Token. Copy and paste the SNOOD Contract Address below to Metamask
                                    <p>ETH Mainnet: </p>
                                    <p>BSC Mainent: </p>
                                    {/* <p>MATIC Mainent: </p> */}
                                    <p>Click Next-Add Token. Then you will be able to see the SNOOD you just swapped.</p></div>
                    <img className="mb-7" src="/images/m1.png" alt=""/>
                    <div className="font-bold text-3xl lg:text-4xl text-main-color mb-5 ">How to use bridge on smartphone</div>
                    <div className="mb-7">1. Download Metamask on smartphone
                    <p></p>
                    You can download Metamask here:
                    <p></p>
                    <a href="https://apps.apple.com/us/app/metamask/id1438144202?_branch_match_id=883846660062352704" target="_blank" rel="noreferrer" className="text-main-color transition-all duration-200 hover:text-main-color-hover hover:underline ">For IOS</a>
                    <p></p>
                    <a href="https://play.google.com/store/apps/details?id=io.metamask&hl=en_US&ref=producthunt&_branch_match_id=883846660062352704" target="_blank" rel="noreferrer" className="text-main-color transition-all duration-200 hover:text-main-color-hover hover:underline">For Android</a>
                    <p></p>
                    </div>
                    <div className="mb-7">2. How to use Metamask on smartphone
                    <p></p>
                    Tap on the <span className="font-bold">"Burger"</span> to open menu
                    </div>
                    <img className="mb-7" src="/images/mf1.jpg"/>
                    <div className="mb-7">3. Browser
                    <p></p>
                    Open <span className="font-bold">Browser</span> and search for <a href="https://bridge.trustworks.global/" target="_blank" rel="noreferrer" className="bg-clip-text text-transparent bg-gradient-to-r from-corn to-el-violet transition-all duration-200 hover:underline ">Trustworks Bridge</a>
                    </div>
                    <img className="mb-7" src="/images/mf2.jpg"/>
                    <div className="mb-7">4. Connect Wallet
                    <p></p>
                    Tap on <span className="font-bold">Connect Wallet</span> and start using bridge as like as the desktop version
                    </div>
                    <img className="mb-7" src="/images/mf3.jpg"/>
                    <a href="/">
                    <button className="sm:w-56 h-12 w-full bg-main-color shadow-sm hover:bg-main-color-hover rounded text-white mt-8 outline-none focus:outline-none mb-8 transition-all duration-200">
                        Back to main page
                    </button></a>
                </div>

                <div className=" lg:p-8 lg:py-4 content lg:overflow-y-auto lg:h-48 scroll-style text-white">
                    <div className="font-bold text-4xl text-main-color mb-4">FAQ</div>
                    <div className="border-b border-white border-opacity-10 border-solid py-4 cursor-pointer">
                        <div className="faq__btn flex justify-between items-center">
                            <div className="w-2/3 text-xl">How many tokens can be transferred across the bridge?
                            </div>
                            <button className="bg-btn-color w-10 h-10 rounded-full outline-none focus:outline-none">
                                <div className="faq__close w-full h-full mx-auto"></div>
                            </button>
                        </div>
                        <div className="faq__text mt-8 opacity-50">
                        There are no restrictions on the transfer of tokens across the bridge.
                        </div>
                    </div>
                    <div className="border-b border-white border-opacity-10 border-solid py-4 cursor-pointer">
                        <div className="faq__btn flex justify-between items-center">
                            <div className="w-2/3 text-xl">How long does it take for a token to cross the bridge?
                            </div>
                            <button className="bg-btn-color w-10 h-10 rounded-full outline-none focus:outline-none">
                                <div className="faq__close w-full h-full mx-auto"></div>
                            </button>
                        </div>
                        <div className="faq__text mt-8 opacity-50">
                        The transition speed depends on the network congestion, but usually it takes up to 5-15 minutes.
                        </div>
                    </div>
                    <div className="border-b border-white border-opacity-10 border-solid py-4 cursor-pointer">
                        <div className="faq__btn flex justify-between items-center">
                            <div className="w-2/3 text-xl">Does the bridge work one way?
                            </div>
                            <button className="bg-btn-color w-10 h-10 rounded-full outline-none focus:outline-none">
                                <div className="faq__close w-full h-full mx-auto"></div>
                            </button>
                        </div>
                        <div className="faq__text mt-8 opacity-50">
                        {/* No, our bridge allows for the transition of tokens from chains like MATIC, BSC and ETH. */}
                        No, our bridge allows for the transition of tokens from ERC20 to BEP20 as well as in the opposite direction from BEP20 to ERC20
                        </div>
                    </div>
                    <div className="border-b border-white border-opacity-10 border-solid py-4 cursor-pointer">
                        <div className="faq__btn flex justify-between items-center">
                            <div className="w-2/3 text-xl">How to find out the commission fees?
                            </div>
                            <button className="bg-btn-color w-10 h-10 rounded-full outline-none focus:outline-none">
                                <div className="faq__close w-full h-full mx-auto"></div>
                            </button>
                        </div>
                        <div className="faq__text mt-8 opacity-50">
                        Commission fees are displayed in the left panel.
                        </div>
                    </div>
                    <div className="border-b border-white border-opacity-10 border-solid py-4 cursor-pointer">
                        <div className="faq__btn flex justify-between items-center">
                            <div className="w-2/3 text-xl">Which wallet should I use to work with the bridge?
                            </div>
                            <button className="bg-btn-color w-10 h-10 rounded-full outline-none focus:outline-none">
                                <div className="faq__close w-full h-full mx-auto"></div>
                            </button>
                        </div>
                        <div className="faq__text mt-8 opacity-50">
                        To work with the bridge, you need to use the Metamask wallet.
                        </div>
                    </div>
                    <a href="/">
                    <button className="w-full sm:w-56 h-12 bg-main-color shadow-sm hover:bg-main-color-hover rounded text-white mt-8 outline-none focus:outline-none mb-8 transition-all duration-200">
                        Back to main page
                    </button></a>
                </div>


            </div>
        </div>
    </div>
</div>
<footer className=" hidden lg:block bg-firefly">
    <div className="container">
        <div className="flex justify-center py-3 text-xs items-center">
            <div className="flex items-center">
                <a className="w-6 h-6 flex justify-center items-center mr-16" href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x6507458bb53aec6be863161641ec28739c41cc97" target="_blank" rel="noreferrer">
                    <img src="/images/rabbit.svg" alt="" className="w-5 h-5"/>
                </a>
                <a className="w-6 h-6 flex justify-center items-center mr-16" href="https://www.instagram.com/footballstarsio/" target="_blank" rel="noreferrer">
                    <svg className="w-5 h-5 fill-current text-main-color" height="511pt" viewBox="0 0 511 511.9" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0"/><path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0"/><path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" fill='#20DCCB' /></svg>
                </a>
                <a className="w-6 h-6 flex justify-center items-center mr-16" href="https://twitter.com/FootballStarsIO" target="_blank" rel="noreferrer">
                    <svg className="w-5 h-5 fill-current text-main-color" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                    <g>
                        <g>
                            <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                                c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                                c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                                c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                                c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                                c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                                C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                                C480.224,136.96,497.728,118.496,512,97.248z"/>
                        </g>
                    </g>

                    </svg>
                </a>
                <a className="w-6 h-6 flex justify-center items-center" href="https://t.me/FootballStarsIO" target="_blank" rel="noreferrer">
                    <svg className="w-5 h-5" enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" fill="#20DCCB"/></svg>
                </a>
            </div>
        </div>
    </div>
</footer>
        
<div className="burger-list bg-main-bg mr-20 h-auto p-8 pt-24 pb-0 fixed top-0 left-0 z-30 overflow-y-auto h-full">
    <div className="text-2xl lg:text-3xl mb-16 block text-white">Schnoodle Bridge</div>
    <a className="font-bold text-xl text-main-color mb-8 block" href="/">Main Page</a>
    <a href="/info" className="font-bold text-xl text-second-color mb-8 block" onClick={() => this.handleGuide()}>Token exchange guide</a>
    <a href="/info" className="font-bold text-xl text-second-color mb-8 block" onClick={() => this.handleFAQ()}>FAQ</a>
    <div className="flex mb-12">
        <a className="w-10 h-10 flex justify-center items-center mr-8" href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x6507458bb53aec6be863161641ec28739c41cc97" target="_blank" rel="noreferrer">
            <img src="/images/rabbit.svg" alt="" className="w-7 h-7"/>
        </a>
        <a className="w-10 h-10 flex justify-center items-center mr-8" href="https://www.instagram.com/footballstarsio/" target="_blank" rel="noreferrer">
            <svg className="w-7 h-7 fill-current text-main-color" height="511pt" viewBox="0 0 511 511.9" width="511pt" xmlns="http://www.w3.org/2000/svg"><path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0"/><path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0"/><path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" fill='#20DCCB' /></svg>
        </a>
        <a className="w-10 h-10 flex justify-center items-center mr-8" href="https://twitter.com/FootballStarsIO" target="_blank" rel="noreferrer">
            <svg className="w-7 h-7 fill-current text-main-color" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
            <g>
                <g>
                    <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                        c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                        c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                        c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                        c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                        c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                        C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                        C480.224,136.96,497.728,118.496,512,97.248z"/>
                </g>
            </g>

            </svg>
        </a>
        <a className="w-10 h-10 flex justify-center items-center" href="https://t.me/FootballStarsIO" target="_blank" rel="noreferrer">
            <svg className="w-7 h-7" enable-background="new 0 0 24 24" height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" fill="#20DCCB"/></svg>
        </a>
    </div>
</div>
    </div>
        return(<div>{page}</div>)
    }
}

export default Information;