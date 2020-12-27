import React from "react";
import {connect} from "react-redux";

import {Row, Col, FormGroup,  InputGroup, InputGroupAddon, InputGroupText,
    Button, Input, Card, CardBody, CardHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withRouter} from "react-router-dom";

// Module
import AuthModule from "../controller/AuthModule";

// img
import logo from '../assets/images/fon-logo.png';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.authModule = new AuthModule();
        this.state = {
            email: null,
            password: null
        }
    }

    componentDidMount() {

        if (localStorage.getItem('isLogged') === 'logged') this.props.history.push('/portfolio')
    }

    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    handleLogin() {

        this.setState({email: this.state.email, password: this.state.password}, () => {
            this.authModule.login(this.state).then(r => {
                this.props.history.push('/portfolio')
            })
        })
    }

    handleLogout() {
        this.authModule.logout();
    }

    render() {
        return (
            <Row className={"h-100 d-flex justify-content-center align-items-center login"} noGutters>

                <Col md={4} className={'mx-auto text-center'}>

                    <Card>
                        <CardBody>
                            <img src={logo} className={'mb-3'} alt="Fon takip"/>

                            <FormGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <FontAwesomeIcon icon={['far', 'user']} className={'fa-fw'} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="email"
                                           name={'email'}
                                           onChange={this.handleInputChange.bind(this)}
                                            />
                                </InputGroup>
                            </FormGroup>

                            <FormGroup>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <FontAwesomeIcon icon={['fas', 'key']} className={'fa-fw'} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="şifre"
                                           name={'password'}
                                           onChange={this.handleInputChange.bind(this)}
                                           />
                                </InputGroup>
                            </FormGroup>

                            <FormGroup className={'text-right'}>
                                <Button color={'primary'} block onClick={this.handleLogin.bind(this)}>
                                    Login
                                </Button>
                            </FormGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}


export default connect(mapStateToProps)(withRouter(Login))