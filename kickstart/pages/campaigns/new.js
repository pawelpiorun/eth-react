import React from "react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory"
import { Form, Button, Input, Message } from "semantic-ui-react";
import web3 from '../../ethereum/web3'
import Router from 'next/router'
import Link from 'next/link'

class CampaignNew extends React.Component {
    state = {
        premiumContribution: '',
        errorMessage: '',
        isLoading: false
    };

    onSubmit = async (e) => {
        e.preventDefault();

        this.setState({ isLoading: true, errorMessage: ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .newCampaign(this.state.premiumContribution)
                .send({
                    from: accounts[0]  
                });
            this.setState({ errorMessage: ''});
            Router.push("/");
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ isLoading: false});
    }

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Premium contribution</label>
                        <Input label="wei"
                            labelPosition="right"
                            placeholder="2000000"
                            value={this.state.premiumContribution}
                            onChange={e => this.setState({ premiumContribution: e.target.value})} />
                    </Form.Field>

                    <Button 
                        loading={this.state.isLoading}
                        disabled={this.state.isLoading}
                        primary>
                        Create
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

export default CampaignNew;