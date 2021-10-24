import React from "react";
import Layout from "../../../../components/Layout";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import { Form, Button, Message, Input } from 'semantic-ui-react'
import Link from 'next/link'
import Router from 'next/router'

class NewRequest extends React.Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        isLoading: false
    };

    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const {
            description,
            value,
            recipient
        } = this.state;

        this.setState({ isLoading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value),
                recipient
                )
                .send({
                    from: accounts[0]
                });
            this.setState({ errorMessage: '' });
            Router.push(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ isLoading: false });
    }

    render() {
        return (
            <Layout>
                <Link href={`/campaigns/${this.props.address}/requests`}>
                    <Button floated="right">
                        Back
                    </Button>
                </Link>
                <h3>New request</h3>
                <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description}
                            onChange={e => this.setState({ description: e.target.value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input label="ether"
                            labelPosition="right"
                            value={this.state.value}
                            onChange={e => this.setState({ value: e.target.value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value={this.state.recipient}
                            onChange={e => this.setState({ recipient: e.target.value })} />
                    </Form.Field>

                    <Button
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}
                        primary>
                        Create request
                    </Button>

                    <Message
                        error
                        header='Error'
                        content={this.state.errorMessage} />
                </Form>
            </Layout>
        );
    }
}

export default NewRequest;