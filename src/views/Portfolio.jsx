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
    NavItem,
    NavLink,
    FormGroup, Label,
    InputGroup, InputGroupAddon, ButtonGroup, Input,
} from 'reactstrap'


import data from '../database.json'
import spk from '../spk.json' // mock
import ListView from '../components/ListView'
import GridView from '../components/GridView'

import axios from "axios";
import {setSelectedPortfolio, setSelectedPortfolioText} from "../store/portfolioActions";
import PortfolioModule from "../controller/PortfolioModule";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Portfolio extends React.Component {

    constructor(props) {
        super(props);

        this.portfolio = data.portfolio;

        this.pm = new PortfolioModule();

        this.state = {
            groupedPortfolio: null,
            begin: this.prepareDate(true),
            gridView: false,
            selectedPortfolioKey: 0,
            fundCode: null
        }
    }

    componentDidMount() {
        //this.groupingPortfolio();

        if (localStorage.getItem('isLogged') === 'notLogged') this.props.history.push('/login')

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
                // const proxy = "https://cors-anywhere.herokuapp.com/"
                const proxy = "https://thingproxy.freeboard.io/fetch/"
                const spk = "https://ws.spk.gov.tr/PortfolioValues/api/PortfoyDegerleri/"

                const code = codes.join(',');
                const params = `${code}/4/${begin}/${begin}`;

                setTimeout(() => {

                    axios({
                        method: "GET",
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

    handlePortfolioSelection(e) {
        this.setState({
            selectedPortfolioKey: +e.target.value
        })
        this.props.setSelectedPortfolio(+e.target.value);
        this.props.setSelectedPortfolioText(e.target.selectedOptions[0].text);
    }

    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    saveFund() {

        const {list, portfolioId} = this.props;
        const activePortfolioTitle = list[portfolioId].ref.id;

        this.pm.saveFundToPortfolio(activePortfolioTitle, this.state.fundCode)
    }

    render() {

        const { list, portfolioId } = this.props;

        let listItems, listOptions = null;

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

            listOptions = list.map((item, idx) => {
                if (item.ref) {
                    const selected = idx === portfolioId;
                    return (
                      <option key={`tab${idx}`} value={idx} selected={selected}>
                          {item.ref.id}
                      </option>
                    )
                }
            });
        }

        return (

            <Container className={'portfolio-view'}>

                <Card className={'my-3'}>
                    <CardBody className={'p-2'}>
                        <Row>
                            <Col sm={'3'}>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <input type="date" className={'form-control'} name={'begin'}
                                               value={this.state.begin}
                                               onChange={this.handleDateChange.bind(this)}/>
                                    </InputGroupAddon>
                                    <button className="btn btn-primary"
                                            onClick={this.componentDidMount.bind(this)}>
                                        <FontAwesomeIcon icon={['fas', 'running']} className={'fa-fw'} />
                                    </button>
                                </InputGroup>
                            </Col>
                            <Col sm={2}>
                                <Input type={"select"} onChange={this.handlePortfolioSelection.bind(this)}>
                                    {listOptions}
                                </Input>
                            </Col>
                            <Col sm={2}>
                              <ButtonGroup>
                                <Button onClick={this.switchTemplate.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'bars']} className={'fa-fw'} />
                                </Button>
                                <Button onClick={this.switchTemplate.bind(this)}>
                                    <FontAwesomeIcon icon={['fas', 'th-large']} className={'fa-fw'} />
                                </Button>
                              </ButtonGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {/*<Row className={'mb-3'}>
                    <Col>
                        <Nav tabs className={'tab-section'}>
                            {listItems}
                        </Nav>
                    </Col>
                </Row>*/}

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


                <Card className={'my-3'}>
                    <CardBody className={'p-2'}>
                        <Row>
                            <Col sm={'6'}>
                              <FormGroup row>
                                  <Label sm={2}>Fon Kodu: </Label>
                                  <Col sm={7}>
                                      <Input type="text" name="fundCode" placeholder="AFO / AFT"
                                             onChange={this.handleInputChange.bind(this)} />
                                  </Col>
                                  <Col sm={3}>
                                      <Button onClick={this.saveFund.bind(this)}>
                                          <FontAwesomeIcon icon={['fas', 'check']} className={'fa-fw'} />
                                          Kaydet
                                      </Button>
                                  </Col>
                              </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>

        )
    }
}

function mapStateToProps(state) {
    return {
        portfolioId: state.portfolio.selectedPortfolio,
        list: state.portfolio.list

    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSelectedPortfolio: (id) => {dispatch(setSelectedPortfolio(id))},
        setSelectedPortfolioText: (value) => {dispatch(setSelectedPortfolioText(value))}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)