import React from "react";
import {Link, withRouter} from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Container,
  TabContent,
  TabPane,
  NavItem,
  NavLink
} from "reactstrap";

import {connect} from "react-redux";
import {setSelectedPortfolio} from "../store/portfolioActions";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
  }

  go(id) {
    debugger
    console.log(id);
    this.props.setSelectedPortfolio(+id);
    this.props.history.push('/portfolio');

  }

  render() {

    const { list } = this.props;
    console.log(this.props);

    let listItems;

    if (list) {
      listItems = list.map((item, idx) => {
        if (item.ref) {
          return (
            <Col sm={3}>
              <Card body key={`tab${idx}`}>
                <h3>
                  {item.ref.id}
                </h3>
                <button onClick={this.go.bind(this, idx)}>Portföye git > </button>
              </Card>
            </Col>
          )
        }
      });
    }

    return (
      <Container fluid>
        <Row className={'mt-3'}>
          {listItems}
          <Col sm={3}>
            <Card body>
              <h3> Yeni Portföy +</h3>

            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeTab: state.portfolio.selectedPortfolio,
    list: state.portfolio.list

  }
}

function mapDispatchToProps(dispatch) {
  return {
    setSelectedPortfolio: (id) => {dispatch(setSelectedPortfolio(id))}
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard))