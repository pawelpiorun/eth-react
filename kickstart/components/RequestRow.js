import React from "react";
import { Table, Button } from 'semantic-ui-react'
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import Router from 'next/router'

class RequestRow extends React.Component {
    state = {
        isApproving: false,
        isFinalizing: false
    }

    onApprove =  async () => {
        this.setState({ isApproving: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.approveRequest(this.props.id)
                .send({ from: accounts[0]});
            Router.replace(`/campaigns/${this.props.address}/requests`);
        }
        catch (err) {

        }
            
        this.setState({ isApproving: false });
    }

    onFinalize =  async () => {
        this.setState({ isFinalizing: true });
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.finalizeRequest(this.props.id)
                .send({ from: accounts[0]});
            Router.replace(`/campaigns/${this.props.address}/requests`);
        } catch (err) {

        }

        this.setState({ isFinalizing: false });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.yesVotes >= approversCount / 2;

        return (
            <Row disabled={request.isFinalized}
                positive={readyToFinalize && !request.isFinalized}>
                <Cell>{id + 1}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')} ETH</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.yesVotes}/{approversCount}</Cell>
                <Cell>
                    {request.isFinalized ? null :
                        <Button basic color='green'
                            onClick={this.onApprove}
                            loading={this.state.isApproving}
                            disabled={this.state.isApproving}>
                            Approve
                        </Button>
                    }
                </Cell>
                <Cell>
                    {request.isFinalized ? null :
                        <Button basic color='orange'
                            onClick={this.onFinalize}
                            loading={this.state.isFinalizing}
                            disabled={this.state.isFinalizing}>
                            Finalize
                        </Button>
                    }
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;