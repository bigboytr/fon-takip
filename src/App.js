import React from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import AuthModule from "./controller/AuthModule";


// Components
import Sidebar from "./components/Sidebar";
import Portfolio from "./views/Portfolio";
import Login from "./views/Login";

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

import { Container, Row, Col } from 'reactstrap'

library.add(fas, far);


class App extends React.Component {

    constructor(props) {
        super(props);

        this.authModule = new AuthModule();
    }

    componentDidMount() {
        this.authModule.isLogged();
    }

    render() {

        const {isLogged} = this.props.auth

        return (

            <Container fluid>

                <Row>
                    {isLogged &&
                    <Sidebar />
                    }
                    <Col className={ isLogged ? 'offset-2' : ''}>

                        <Router>
                            <Switch>
                                <Route path={'/'} exact component={Login} />
                                <Route path={'/login'} exact component={Login} />
                                <Route path={'/portfolio'} exact component={Portfolio} />
                                {/*<Redirect from="*" to="/" />*/}
                            </Switch>
                        </Router>
                    </Col>
                </Row>

            </Container>

        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps) (withRouter(App))
