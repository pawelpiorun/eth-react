import web3 from './web3';
require('dotenv').config();

export default new web3.eth.Contract(JSON.parse(process.env.REACT_APP_LOTTERY_ABI), process.env.REACT_APP_LOTTERY_ADDRESS);