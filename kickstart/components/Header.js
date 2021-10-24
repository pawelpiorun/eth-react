import React from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link'
import { Router } from 'next/router';

const Header = props => {
    return (
        <Menu style={{ marginTop: '20px' }}>
            <Link href="/">
                <a className="item">
                    <b>EthStarter</b>
                </a>
            </Link>
            <Menu.Menu position='right'>
                <Link href="/">
                    <Menu.Item>
                        Campaigns
                    </Menu.Item>
                </Link>

                <Link href="/campaigns/new">
                    <Menu.Item>
                        +
                    </Menu.Item>
                </Link>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;