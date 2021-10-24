import React from "react";
import Layout from "../../../components/Layout";
import { Header, Button, Grid } from 'semantic-ui-react'
import Link from 'next/link'
import Campaign from "../../../ethereum/campaign";
import RequestsList from "../../../components/RequestsList";

class RequestIndex extends React.Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        // const requests = [];
        // for (let i = 0; i < requestsCount; i++)
        // {
        //     const request = await campaign.methods.requests(i).call();
        //     requests.push(request);
        // }

        const requests = await Promise.all(
            Array(parseInt(requestsCount)).fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );

        return {
            address: props.query.address,
            requests: requests,
            approversCount: approversCount
        };
    }

    render() {
        return (
            <Layout>
                <Link href={`/campaigns/${this.props.address}/requests/new`}>
                    <Button primary
                        floated="right"
                        style={{ marginRight: '20px', marginTop: '20px'}}>
                        Add request
                    </Button>
                </Link>
                <Link href={`/campaigns/${this.props.address}`}>
                    <Button floated="right"
                        style={{ marginTop: '20px'}}>
                        Back
                    </Button>
                </Link>
                <Header as='h2'>
                    Requests
                    <Header.Subheader>
                        {this.props.address}
                    </Header.Subheader>
                </Header>
                <h4>Found {this.props.requests.length} request(s)</h4>
                <RequestsList
                    requests={this.props.requests}
                    approversCount={this.props.approversCount}
                    address={this.props.address} />
            </Layout>
        );
    }
}

export default RequestIndex;