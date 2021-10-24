import React from "react";
import web3 from "../ethereum/web3"
import Campaign from "../ethereum/campaign"
import Layout from "./Layout";
import { Button, Form, Input, Message } from "semantic-ui-react"
import Router from 'next/router'

class ContributeForm extends React.Component {
    state = {
        contributionAmount: '',
        errorMessage: '',
        isLoading: false
    };

    onSubmit = async (e) => {
        e.preventDefault();


        this.setState({ isLoading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.contribute()
                .send({ 
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.contributionAmount, 'ether')
                });

            this.setState({ errorMessage: '' });
            Router.replace(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ isLoading: false, contributionAmount: '' });
    }

    render() {
        return (
            <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
                <h3>Contribute to this campaign!</h3>
                <Form.Field>
                    <label>Premium contribution</label>
                    <Input label="ether"
                        labelPosition="right"
                        placeholder="0.2"
                        value={this.state.contributionAmount}
                        onChange={e => this.setState({ contributionAmount: e.target.value })} />
                </Form.Field>

                <Button
                    loading={this.state.isLoading}
                    disabled={this.state.isLoading}
                    primary>
                    Contribute!
                </Button>

                <Message
                    error
                    header='Error'
                    content={this.state.errorMessage} />
            </Form>
        );
    }
}

export default ContributeForm;