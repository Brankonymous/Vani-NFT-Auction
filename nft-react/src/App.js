import React, { Component } from 'react';
import Web3 from 'web3';
import "./App.css";
import NFT from './build/contracts/DeedRepository.json';
import AuctionRepository from './build/contracts/AuctionRepository.json';
import Info from './Info.js';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    // console.log(accounts)
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = NFT.networks[networkId]
    if(networkData) {
      const abi = NFT.abi
      const address = networkData.address
      //console.log(address);
      this.setState({address})
      const contract = new web3.eth.Contract(abi, "0xd94a5A879f2109707d89Cba8d5795F036B7ABC2a")
      const contract1 = new web3.eth.Contract(AuctionRepository.abi,"0xAB0E4cBABD6E4f57A61F8e86694B304AA017E371")
      this.setState({ contract })
      this.setState({ contract1 })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load NFTs
      for (var i = 1; i <= totalSupply; i++) {
          const id = i-1
          console.log(id)
          const Auction = await contract1.methods.getAuctionById(id).call()
          console.log(Auction[0])
          this.setState({
            Auctions: [...this.state.Auctions, {
              name: Auction[0], 
              blockDeadline: Auction[1],
              startPrice:Auction[2],
              metadata:Auction[3]}]
          })
        }
    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
    console.log(this.state.Auctions)
  }

  async mint(metadata, name, price, date) {
    await this.state.contract.methods.registerDeed(metadata).send({ from: this.state.account })
    await this.state.contract.methods.approve("0xAB0E4cBABD6E4f57A61F8e86694B304AA017E371", this.state.totalSupply).send({ from: this.state.account });
    await this.state.contract.methods.transferFrom( this.state.account ,"0xAB0E4cBABD6E4f57A61F8e86694B304AA017E371", this.state.totalSupply).send({ from: this.state.account});
    await this.state.contract1.methods.createAuction("0xd94a5A879f2109707d89Cba8d5795F036B7ABC2a", this.state.totalSupply, name, metadata, price, date).send({ from: this.state.account });
    // ovde treba dodati update state-a za auctions
    this.setState({
      Auctions: [...this.state.Auctions, {
        name: name, 
        blockDeadline: date,
        startPrice: price,
        metadata: metadata}]
    })
    const totalSupply = await this.state.contract.methods.totalSupply().call()
    this.setState({totalSupply})
    console.log(this.state.totalSupply)
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      contract1: null,
      totalSupply: 0,
      address: '',
      NFTs: [],
      Auctions: []
      
    }
  }

  render() {
    return (
      <div className="App">
      <div className="gornji">
          <small 
            style={{alignSelf: 'baseline-right'}}
            className="text-white">
              <span id="account">
                {this.state.account}
              </span>
          </small>
       <h1 style={{color: '#6BBAA2',fontFamily:'monospace',fontSize:40}}>
         Create a new token
       </h1>
       <div style={{alignSelf:'center',flexDirection:'row'}}>
         <div style={{}}>
          <input placeholder="Input Auction Name *" type="text" ref={(input) => { this.name = input }} style={{paddingLeft:10,marginRight:40,width:500,height:30,marginBottom:10,borderColor:'#474554',borderRadius:15,borderWidth:2.4,backgroundColor:'#BEC1FF',color:'#474554',fontSmooth:'normal',fontSize:17}}  ></input>
          <input placeholder="Input Image Url *" type="text" ref={(input) => { this.metadata = input }} style={{paddingLeft:10,marginRight:40,width:500,height:30,marginBottom:10,borderColor:'#474554',borderRadius:15,borderWidth:2.4,backgroundColor:'#BEC1FF',color:'#474554',fontSmooth:'normal',fontSize:17}}  ></input>
          <input placeholder="Starting Price (ETH) *" type="text" ref={(input) => { this.startPrice = input }} style={{paddingLeft:10,marginRight:40,width:500,height:30,marginBottom:10,borderColor:'#474554',borderRadius:15,borderWidth:2.4,backgroundColor:'#BEC1FF',color:'#474554',fontSmooth:'normal',fontSize:17}}  ></input>
          <input placeholder="Set Final Date (in seconds) *" type="text" ref={(input) => { this.blockDeadline = input }} style={{paddingLeft:10,marginRight:40,width:500,height:30,marginBottom:10,borderColor:'#474554',borderRadius:15,borderWidth:2.4,backgroundColor:'#BEC1FF',color:'#474554',fontSmooth:'normal',fontSize:17}}  ></input>
         </div>

         <div style={{marginRight:35,borderRadius:10,alignSelf:'center'}}>
         <button onClick={(event) => {
           const name = this.name.value
           const metadata = this.metadata.value  
           const price = this.startPrice.value
           const date = this.blockDeadline.value
           this.mint(metadata, name, price, date)
         }} title="mint" className='e-info' style={{width:100,height:30,marginTop:10,borderRadius:5,color:'#1C1A27',fontSize:18,fontFamily:'fantasy',backgroundColor:'#4CBE9F',borderColor:'#BEC1FF'}}>Mint</button>
         </div>
       </div>
      </div>
      
      <header className="App-header">
      <div style={{marginTop:'15vh',margin:'40px',width:'80%',justifyContent: 'center',alignSelf:'center',marginRight:100}} >
    
     {this.state.Auctions.map((name,key)=>{
       return (
       <Info price={name.startPrice} date={name.blockDeadline} name={name.name} rollNo={key} NFT = {name.metadata}/>);
       })}
    </div>
      </header>
      
    </div>
    );
  }
}

export default App;