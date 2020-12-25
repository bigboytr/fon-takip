import React from 'react'
import {connect} from 'react-redux';

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Spinner,
    Button,
    TabContent,
    TabPane,
    NavItem,
    NavLink,
    Nav,
} from 'reactstrap'


import data from '../database.json'
import spk from '../spk.json' // mock
import ListView from '../components/ListView'
import GridView from '../components/GridView'

import axios from "axios";
import {setSelectedPortfolio} from "../store/portfolioActions";

class Portfolio extends React.Component {

    constructor(props) {
        super(props);

        this.portfolio = data.portfolio;

        this.state = {
            groupedPortfolio: null,
            begin: this.prepareDate(true),
            gridView: false,
            selectedPortfolioKey: 0
        }
    }

    componentDidMount() {
        //this.groupingPortfolio();

        this.setState({groupedPortfolio: null}, () => {
            this.getFundValues().then(r => {
                if (r) {
                    this.setState({fundValues: r});
                }
                this.groupingPortfolio();
            })
        })

    }

    handleDateChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    groupingPortfolio() {
        //console.log(this.portfolio);
        const item = this.portfolio.map(item => {

            let a = {
                title: item.title,
                group: []
            }

            item.items.forEach(i => {

                const code = i.code;

                if (a.group[code] === undefined) {

                    a.group[code] = {
                        code,
                        totalCost: 0,
                        totalQuantity: 0,
                        items: []
                    }
                }

                // Total cost
                a.group[code].totalCost += i.cost;
                // Total fund quantity
                a.group[code].totalQuantity += (i.cost / i.purchasePrice);

                //avg fund price
                a.group[code].avgFundPrice = a.group[code].totalCost / a.group[code].totalQuantity;

                // Anlık Değerler
                if (this.state.fundValues) {
                    const fundValue = this.state.fundValues.find(fund => {
                        return fund.FonKodu === code
                    });

                    if (fundValue) {

                        a.group[code].fundTitle = fundValue.FonUnvani
                        a.group[code].price = fundValue.BirimPayDegeri
                        a.group[code].priceDate = new Date(fundValue.Tarih).toLocaleDateString()
                    } else {
                        // if fund value not exist
                        a.group[code].fundTitle = ''
                        a.group[code].price = 0
                        a.group[code].priceDate = new Date(this.state.begin).toLocaleDateString()
                    }

                } else {
                    // if fund value not exist
                    a.group[code].fundTitle = ''
                    a.group[code].price = 0
                    a.group[code].priceDate = new Date(this.state.begin).toLocaleDateString()
                }

                // Calculation
                const calculation = (a.group[code].totalQuantity * a.group[code].price) - a.group[code].totalCost

                a.group[code].profitLoss = calculation
                a.group[code].profitIndicator = calculation > 0

                // percentage
                a.group[code].percentage = (calculation / a.group[code].totalCost) * 100

                // Items for each unique fund code
                a.group[code].items.push(i)

            })

            a.group = Object.values(a.group);

            return a;

        })

        this.setState({
            groupedPortfolio: item
        }, () => {
            //console.log(this.state.groupedPortfolio);
        })
    }

    prepareDate(setForm) {
        const d = setForm ? new Date() : new Date(this.state.begin)
        const day = d.getDay();

        const Y = d.getFullYear();
        let D = d.getDate();
        let M = d.getMonth() + 1;

        M = +M < 10 ? `0${M}` : M;

        D = (day === 6)
            ? D - 1
            : (day === 0)
                ? D - 2
                : D;

        return `${Y}-${M}-${D}`;
    }

    getFundValues() {

        return new Promise((res, rej) => {
            if (this.portfolio) {

                //res(spk)

                const codes = this.portfolio.map(p => {
                    return p.items.map(item => {
                        return item.code
                    });
                })

                const begin = this.prepareDate(false)
                const proxy = "https://cors-anywhere.herokuapp.com/"
                const spk = "https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/"

                const code = codes.join(',');
                const params = `${code}/4/${begin}/${begin}`;

                setTimeout(() => {

                    axios({
                        method: "GET",
                        //url: "./server.php",
                        url: proxy+spk+params,
                        data: {
                            code: codes.join(','),
                            begin: begin,
                            end: begin
                        }
                    }).then(resp => {
                        //console.log(JSON.parse(resp.data));
                        res(resp.data);
                    })

                }, 200)
            }
        })
    }

    switchTemplate() {
        this.setState({gridView : !this.state.gridView})
    }

    handlePortfolioSelect(idx) {
        this.setState({
            selectedPortfolioKey: idx
        })
        this.props.setSelectedPortfolio(idx);
    }

    render() {

        const { list } = this.props;

        let listItems = null;

        if (list) {
            listItems = list.map((item, idx) => {
                if (item.ref) {
                    return (
                      <NavItem key={`tab${idx}`}>
                          <NavLink
                            className={idx === this.state.selectedPortfolioKey ? 'active' : null}
                            onClick={this.handlePortfolioSelect.bind(this, idx)}
                          >
                              {item.ref.id}
                          </NavLink>
                      </NavItem>
                    )
                }
            });
        }

        return (

            <Container fluid className={'portfolio-view'}>

                <Row>
                    <Col>
                        <Card className={'mt-2 mb-3'}>
                            <CardBody className={'p-2'}>
                                <Row>
                                    <Col sm={'3'}>
                                        <div className="form-group">
                                            <label>Başlangıç :</label>
                                            <input type="date" className={'form-control'} name={'begin'}
                                                   value={this.state.begin}
                                                   onChange={this.handleDateChange.bind(this)}/>
                                        </div>
                                    </Col>

                                    <Col sm={'2'}>
                                        <div className="form-group">
                                            <label>Getir :</label>
                                            <button className="btn btn-primary btn-block"
                                                    onClick={this.componentDidMount.bind(this)}>
                                                Çalıştır
                                            </button>
                                        </div>
                                    </Col>
                                    <Col sm={'2'}>
                                        <label>Görünüm: </label>
                                        <Button color={'secondary'} block onClick={this.switchTemplate.bind(this)}>
                                            {this.state.gridView ? 'Liste' : 'Grid'}
                                        </Button>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className={'mb-3'}>
                    <Col>
                        <Nav tabs className={'tab-section'}>
                            {listItems}
                        </Nav>
                    </Col>
                </Row>

                {!this.state.groupedPortfolio &&
                <Row>
                    <Col className={'text-center justify-content-center'}>
                        <Spinner size="xl" color="primary"/>
                    </Col>
                </Row>
                }

                {(this.state.groupedPortfolio && !this.state.gridView) &&
                    <ListView groupedPortfolio={this.state.groupedPortfolio} selectedDate={this.state.begin} />
                }

                {(this.state.groupedPortfolio && this.state.gridView) &&
                    <GridView groupedPortfolio={this.state.groupedPortfolio} selectedDate={this.state.begin} />
                }
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
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)