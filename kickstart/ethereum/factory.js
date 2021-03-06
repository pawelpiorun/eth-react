import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const campaignFactory = new web3.eth.Contract(
    CampaignFactory.abi,
    process.env.NEXT_PUBLIC_ADDRESS
)

export default campaignFactory;