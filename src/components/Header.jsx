import React from 'react'
import {
    Row, Col, Button
} from 'reactstrap'

import AuthModule from "../controller/AuthModule";

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.auth = new AuthModule();
    }

    render() {

        return (
          <Row className={'header p-2'}>
              <Col md={3}>
                  <div className={'logo d-block'} />
              </Col>
              <Col md={1} className={'offset-md-8'}>
                  <Button className={'logout'} color={'danger'} onClick={this.auth.logout}>
                      Çıkış ->
                  </Button>
              </Col>
          </Row>
        )
    }
}

export default Header;