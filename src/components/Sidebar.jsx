import React from 'react'
import {connect} from "react-redux";

import {
    Col, Button, ListGroup, ListGroupItem,
    InputGroup, Input, InputGroupAddon
} from 'reactstrap'

// Auth Module
import AuthModule from "../controller/AuthModule";
import {withRouter} from "react-router-dom";

class Sidebar extends React.Component {

    constructor(props) {
        super(props);

        this.auth = new AuthModule();
        //this.firebase = new FirebaseModule();

        this.state = {
            title: null,
            showForm: false,
            selectedPortfolioKey: 0
        }
    }

    handleShowForm() {
        this.setState({showForm: !this.state.showForm})
    }

    handleChange(event) {
        this.setState({title: event.target.value}, () => {
            event.target.value = "";
        });
    }


    handleCreatePortfolio() {
        this.firebase.savePortfolio(this.state.title);
        //this.setState({title: null})
    }

    handlePortfolioSelect(idx) {
        this.setState({
            selectedPortfolioKey: idx
        })
    }

    render() {

        const {list} = this.props;

        let listItems = null;

        if (list) {
            listItems = list.map((item, idx) => {
                if (item.ref) {
                    return (
                        <ListGroupItem
                            active={idx === this.state.selectedPortfolioKey}
                            tag={'button'}
                            onClick={this.handlePortfolioSelect.bind(this, idx)}
                            key={idx}>
                            {item.ref.id}
                        </ListGroupItem>)
                }
            });
        }

        const portfolioButtonColor = this.state.showForm ? 'warning' : 'success';
        const portfolioButtonText = this.state.showForm ? 'Formu Gizle -' : 'Portföy Oluştur +';

        return (

            <Col md={'2'} className={'sidebar'}>
                <div className="logo"/>
                <br/>

                <Button color={portfolioButtonColor} block className={'mb-3'}
                        onClick={this.handleShowForm.bind(this)}>
                    {portfolioButtonText}
                </Button>

                <ListGroup>
                    {this.state.showForm &&
                    <ListGroupItem>
                        <InputGroup>
                            <Input placeholder={'Portföy Başlık'} onChange={this.handleChange.bind(this)}/>
                            <InputGroupAddon addonType="append">
                                <Button color={'success'} size={'sm'}
                                        onClick={this.handleCreatePortfolio.bind(this)}>+</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </ListGroupItem>
                    }

                    {listItems}
                </ListGroup>

                <Button className={'logout'} color={'danger'} onClick={this.auth.logout}>
                    Çıkış ->
                </Button>
            </Col>

        )
    }
}

function mapStateToProps(state) {
    return {
        list: state.portfolio.list
    }
}

export default connect(mapStateToProps)(Sidebar)