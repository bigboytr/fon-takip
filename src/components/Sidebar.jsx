import React from 'react'

import {Col, Button} from 'reactstrap'

class Sidebar extends React.Component {

    render() {

        return (

            <Col md={'2'} className={'sidebar'}>
                <div className="logo" />
                <br/>

                <Button color={'success'} block>
                    Porföy Oluştur +
                </Button>
            </Col>

        )
    }
}

export default Sidebar;