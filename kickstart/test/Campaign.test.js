const assert = require('assert');
const { WSAEWOULDBLOCK } = require('constants');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { send } = require('process');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({
            from: accounts[0],
            gas: '1500000'
        });
    
        await factory.methods.newCampaign('6000')
        .send({ 
            from: accounts[0], 
            gas: '1500000'
        });

    [campaignAddress] = await factory.methods.getCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaign', () => {
    it ('deploys contract', async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it ('marks caller as campaign manager', async () => {
        let addr = await campaign.methods.manager().call();
        assert.equal(accounts[0], addr);
    });
    it ('enables contributions and marking as approvers', async () => {
        await campaign.methods.contribute()
            .send({
                value: '10000',
                from: accounts[1],
                gas: '1000000',
                gasPrice: '5000000'
            });
        let isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });
    it ('enables contributions and reuqires minimum contribution to be an approver', async () => {
        await campaign.methods.contribute()
        .send({
            value: '5000',
            from: accounts[1],
            gas: '1000000',
            gasPrice: '5000000'
        });
        let isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(!isApprover);
    });
    it ('allows a manager to make a payment requset', async () => {
        await campaign.methods
            .createRequest("Buy candies", 3500, accounts[2])
            .send({
                 from: accounts[0],
                 gas: '1000000',
                 gasPrice: '5000000' });
        
        const request = await campaign.methods.requests(0).call();
        assert("Buy candies", request.description);
        assert(3500, request.value);
        assert(accounts[2], request.recipient);
    });

    it('performs full campaign', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });
        await campaign.methods
            .createRequest("Live alone", web3.utils.toWei('1', 'ether'), accounts[2])
            .send({ from: accounts[0], gas: '1000000', gasPrice: '5000000' });
        await campaign.methods.approveRequest(0)
            .send({ from: accounts[1], gas: '1000000', gasPrice: '5000000' });
        
        let initialBalance = await web3.eth.getBalance(accounts[2]);
        initialBalance = web3.utils.fromWei(initialBalance, 'ether');
        initialBalance = parseFloat(initialBalance);

        await campaign.methods.finalizeRequest(0)
            .send({ from: accounts[0], gas: '1000000', gasPrice: '5000000' });
        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance = initialBalance + 1);
    });
});