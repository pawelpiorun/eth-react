const { throws } = require('assert');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile');

let accounts;
let lottery;

beforeEach(async () =>
{
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery', () =>
{
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
    it('enables entering single player', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether') 
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);

        const balance = await lottery.methods.balanceOf(accounts[1])
            .call({
                from: accounts[0],
            });
        assert.equal(web3.utils.toWei('0.02', 'ether'), balance);
    });
    it('enables entering multiple players', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether') 
        });     
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.03', 'ether') 
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.04', 'ether') 
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(3, players.length);

        let balance = await lottery.methods.balanceOf(accounts[1])
            .call({
                from: accounts[0],
            });
        assert.equal(web3.utils.toWei('0.02', 'ether'), balance);
        balance = await lottery.methods.balanceOf(accounts[2])
            .call({
                from: accounts[0],
            });
        assert.equal(web3.utils.toWei('0.03', 'ether'), balance);
        balance = await lottery.methods.balanceOf(accounts[3])
            .call({
                from: accounts[0],
            });
        assert.equal(web3.utils.toWei('0.04', 'ether'), balance);
    });
    it ('requires minimum amout to enter', async () => {
        try {
            await lottery.methods.enter()
                .send({
                    from: accounts[0],
                    value: '200'
                });
            assert(false);
        } catch (error) {
            assert(error);
        }

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(0, players.length);

        const balance = await lottery.methods.balanceOf(accounts[0])
            .call({from: accounts[0]});
        assert.equal(0, balance);
    });
    it ('only manager can pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
    it ('sends money to winner and resets', async () => {
        let contractBalance = await web3.eth.getBalance(lottery.options.address);
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.32', 'ether') 
        });
        
        const initialBalance = await web3.eth.getBalance(accounts[1]);
        contractBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(contractBalance, web3.utils.toWei('0.32', 'ether'));

        // await lottery.methods.enter().send({
        //     from: accounts[2],
        //     value: web3.utils.toWei('0.45', 'ether') 
        // });   

        let playerBalance = await lottery.methods.balanceOf(accounts[1])
            .call({
                from: accounts[0],
            });
        assert.equal(web3.utils.toWei('0.32', 'ether'), playerBalance);

        // balance = await lottery.methods.balanceOf(accounts[2])
        //     .call({
        //         from: accounts[0],
        //     });
        // assert.equal(web3.utils.toWei('0.45', 'ether'), balance);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        contractBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(0, contractBalance);

        const finalBalance = await web3.eth.getBalance(accounts[1]);
        const diff = finalBalance - initialBalance;
        assert(diff > web3.utils.toWei('0.31', 'ether'));

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(0, players.length);
    });
});