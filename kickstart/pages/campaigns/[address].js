import React from "react"
import Layout from '../../components/Layout'
import Campaign from '../../ethereum/campaign'
import web3 from "../../ethereum/web3"
import { Card, Grid, Button } from 'semantic-ui-react'
import Link from 'next/link'
import ContributeForm from "../../components/ContributeForm"

class CampaignShow extends React.Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      premiumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: props.query.address
    };
  }

  renderDetails() {
    const {
      balance,
      manager,
      premiumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: web3.utils.fromWei(balance, 'ether') + ' ETH',
        description:
          'Total fundings gathered from contributors',
        meta: 'Balance',
      },
      {
        header: manager,
        description:
          'The manager created this campaign and can create requests to withdraw money.',
        meta: 'Addres of Manager',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(premiumContribution, 'ether') + ' ETH',
        description:
          'Minimum contribution that enables the contributor to become an approver.',
        meta: 'Premium contribution',
      },
      {
        header: requestsCount,
        description:
          'Withdrawal requests created by the manager.',
        meta: 'Requests',
      },
      {
        header: approversCount,
        description:
          'Contributors entitled to approve requests from this campaign.',
        meta: 'Approvers',
      },
    ]

    return (
      <Card.Group items={items} />
    );
  };

  render() {
    return (
      <Layout>
        <h3>{this.props.address}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderDetails()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${this.props.address}/requests`}>
                <Button primary>
                  View requests
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }

}

export default CampaignShow;