import React from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import FirebaseModule from "./controller/FirebaseModule";
import AuthModule from "./controller/AuthModule";


// Components
import Portfolio from "./views/Portfolio";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

import { Container, Row, Col } from 'reactstrap'
import Header from "./components/Header";

library.add(fas, far);


class App extends React.Component {

    constructor(props) {
        super(props);

        new FirebaseModule(); // init firebase
        this.authModule = new AuthModule();
    }

    componentDidMount() {
        this.authModule.isLogged();
    }

    render() {

        const {isLogged} = this.props.auth

        return (

            <Container fluid>
                {isLogged &&
                <Header />
                }
                <section className={'h-100'}>
                    <Router>
                        <Switch>
                            <Route path={'/'} exact component={Login} />
                            <Route path={'/login'} exact component={Login} />
                            <Route path={'/dashboard'} exact component={Dashboard} />
                            <Route path={'/portfolio'} exact component={Portfolio} />
                            {/*<Redirect from="*" to="/" />*/}
                        </Switch>
                    </Router>
                </section>
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
