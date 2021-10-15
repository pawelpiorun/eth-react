import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  state = {
    manager: '',
    playersCount: 0,
    balance: '',
    value: '',
    message: 'Send ether to enter.'
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const playersCount = players.length;
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, playersCount, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...'})
    const accounts = await web3.eth.getAccounts();
    const hash = await lottery.methods.enter()
      .send({ from: accounts[0], value: web3.utils.toWei(this.state.value) });

    this.setState({ value: ''});
    this.setState({ message: 'You have been entered!'})
  };

  onPickWinner = async () => {

    this.setState({ message: 'Picking a winner...'})
    const accounts = await web3.eth.getAccounts();
    const hash = await lottery.methods.pickWinner()
      .send({ from: accounts[0] });

    this.setState({ value: ''});
    this.setState({ message: 'Aaaand the winner is... Well, you should check yourself :)'})
  }

  render() {
    return (
      <div style={{paddingLeft: 40 + 'px'}}>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by... <b>{this.state.manager}</b>
        </p>
        <p>
          There are currently <b>{this.state.playersCount}</b> people entered, competing to
          win <b>{web3.utils.fromWei(this.state.balance, 'ether')} ether!</b>
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <p>
            <b>Want to try your luck?</b>
          </p>
          <div>
            <label>Amout of ether to enter</label>
            <input
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
          </div>
          <button type='submit'>
            Enter
          </button>
        </form>

        <hr/>

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onPickWinner}>Pick a winner!</button>

        <hr/>
        
        <div><h1><b>{this.state.message}</b></h1></div>
      </div>

    );
  }
}
export default App;
