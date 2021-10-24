import React from 'react';
import { Menu } from 'semantic-ui-react'
import Header from './Header'
import Footer from './Footer'
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

const Layout = props => {
    return (
    <Container>
        <Header />
        <div>
            {props.children}
        </div>
        <Footer />
    </Container>
    );
};

export default Layout;