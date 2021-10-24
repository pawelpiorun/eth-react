import React from "react";
import factory from '../ethereum/factory.js'
import { Card, Button } from "semantic-ui-react";
import Layout from '../components/Layout'
import Link from 'next/link'

class CampaignIndex extends React.Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getCampaigns().call();
        return { campaigns };
    }

    renderCampaings() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link href={`/campaigns/${address}`}>
                        <a>View campaign</a>
                        </Link>
                ),
                fluid: true,
                style: { overflowWrap: 'break-word'}
            };
        });
        
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout bodyAttributes={{style: 'background-color: #ddd'}}>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link href="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content='Create campaign'
                                icon='add'
                                labelPosition='left'
                                primary />
                        </a>
                    </Link>
                    {this.renderCampaings()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;