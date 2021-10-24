import React from "react";
import { Table } from 'semantic-ui-react';
import RequestRow from './RequestRow'

class RequestsList extends React.Component {

    render() {
        const { Header, Row, HeaderCell, Body }
            = Table;

        return (
            <Table celled selectable>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>

                <Body>
                    {this.props.requests.map((request, index) => {
                        return (
                            <RequestRow key={index}
                                id={index}
                                request={request}
                                approversCount={this.props.approversCount}
                                address={this.props.address} />
                        );
                    })}
                </Body>
            </Table>
        );
    }
}

export default RequestsList;