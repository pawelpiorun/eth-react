import web3 from './web3';

export default new web3.eth.Contract(process.env.LOTTERY_ABI, process.env.LOTTERY_ADDR);