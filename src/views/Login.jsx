import React from "react";
import {connect} from "react-redux";

import {Row, Col, FormGroup,  InputGroup, InputGroupAddon, InputGroupText,
    Button, Input, Card, CardBody, CardHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {withRouter} from "react-router-dom";

// Module
import AuthModule from "../controller/AuthModule";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.authModule = new AuthModule();
        this.state = {
            email: null,
            password: null
        }
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
            <Row className={"h-100 justify-content-center align-items-center login"} noGutters>
                <div className={'login-bg'}></div>
                <Col md={4} className={'mx-auto text-center'}>

                    <Card>
                        <CardBody>
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


                            <Row className={'m-0'}>
                                <Col className={'m-0 p-0'}>
                                    Remember me
                                </Col>
                                <Col className={'m-0 p-0'}>
                                    <FormGroup className={'text-right'}>
                                        <Button color={'primary'} block onClick={this.handleLogin.bind(this)}>
                                            Login
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Button color={'danger'} block
                                            onClick={this.handleLogout.bind(this)}>
                                        Login
                                    </Button>
                                </Col>
                            </Row>
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