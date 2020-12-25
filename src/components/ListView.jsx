import React from "react";
import {Card, CardBody, CardHeader, Col, Row, Table, Container, TabContent, TabPane} from "reactstrap";
import ArrowIcon from "./ArrowIcon";
import {connect} from "react-redux";

class ListView extends React.Component {

    constructor(props) {
        super(props);

        this.grandCost = 0
        this.state = {
            begin: null
        }
    }

    humanReadbleDate(theDate) {
        const d = new Date(theDate)

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

    readableNumber(value, indicator = '₺', localeString = false) {
        const v = localeString
          ? Number(value.toFixed(2)).toLocaleString('tr-TR')
          : indicator === '%'
            ? Number(value.toFixed(2))
            : Number(value.toFixed(6))

        return `${v} ${indicator}`
    }

    render() {

        const {groupedPortfolio, activeTab} = this.props
        let grandProfitLoss = 0;

        return (
          <TabContent activeTab={activeTab}>

                    {groupedPortfolio.map((portfolio, index) => {
                        grandProfitLoss = 0;
                        this.grandCost = 0;

                        portfolio.group.map(item => {
                            this.grandCost += item.totalCost
                            grandProfitLoss += item.profitLoss
                        })

                        return (
                          <TabPane tabId={index} key={`pane${index}`}>
                              <Row className={'mb-2'}>
                                  <Col md={4} className={'mb-4 mb-xl-0'}>
                                      <Card>
                                          <CardHeader>Yatırım Özeti</CardHeader>
                                          <CardBody>
                                              <Row className={'mb-2'}>
                                                  <Col sm={12} xl={4} className={'text-center text-xl-left'}>
                                                      Yatırım:
                                                  </Col>
                                                  <Col sm={12} xl={8} className={'p-0 text-center text-xl-left'}>
                                                      <h5>{this.readableNumber(this.grandCost, '₺', true)}</h5>
                                                  </Col>
                                              </Row>
                                              <Row className={'mb-2'}>
                                                  <Col sm={12} xl={4} className={'text-center text-xl-left'}>
                                                      Kar / Zarar:
                                                  </Col>
                                                  <Col sm={12} xl={8} className={'p-0 text-center text-xl-left'}>
                                                      <h5 className={grandProfitLoss > 0 ? 'text-success' : 'text-danger'}>
                                                          {this.readableNumber(grandProfitLoss, '₺', true)}
                                                          <span className={'ml-4'}>
                                                              {this.readableNumber(((grandProfitLoss / this.grandCost) * 100), '%')}
                                                          </span>
                                                          <ArrowIcon className={'ml-2'} indicator={(grandProfitLoss > 0 )} />
                                                      </h5>
                                                  </Col>
                                              </Row>
                                              <Row className={'mb-2'}>
                                                  <Col sm={12} xl={4} className={'text-center text-xl-left'}>
                                                      Kasa:
                                                  </Col>
                                                  <Col sm={12} xl={8} className={'p-0 text-center text-xl-left'}>
                                                      <h5 className={grandProfitLoss > 0 ? 'text-success' : 'text-danger'}>
                                                          {this.readableNumber((this.grandCost + grandProfitLoss), '₺', true)}
                                                          <ArrowIcon className={'ml-2'} indicator={(grandProfitLoss > 0 )} />
                                                      </h5>
                                                  </Col>
                                              </Row>
                                          </CardBody>
                                      </Card>
                                  </Col>
                                  <Col md={8}>
                                      <Card className={'mb-4'} key={`card${index}`}>
                                          <CardBody className={'p-2'}>
                                              <Table size={'sm'} responsive className={'portfolio-list'}>
                                                  <thead>
                                                  <tr>
                                                      <th>#</th>
                                                      <th>Kod</th>
                                                      <th width="20%" className={'d-none d-lg-table-cell'}>Fon Adı</th>
                                                      <th className={'d-none d-lg-table-cell'}>Alış Fiyatı</th>
                                                      <th className={'d-none d-lg-table-cell'}>Anlık Fiyat</th>
                                                      <th className={'d-table-cell d-lg-none'}>Alış/Anlık Fiyat</th>
                                                      <th>Maliyet</th>
                                                      <th>Kar/Zarar</th>
                                                      <th>Değişim</th>
                                                  </tr>
                                                  </thead>
                                                  {
                                                      portfolio.group.map((item, index) => {
                                                          return (
                                                            <tbody key={item.code}>
                                                            {/*<tr>
                                                                <td colSpan={6} className={'d-table-cell d-lg-none'}>
                                                                    {item.fundTitle}
                                                                </td>
                                                            </tr>*/}
                                                            <tr>
                                                                <td>{++index}</td>
                                                                <td>{item.code}</td>
                                                                <td className={'d-none d-lg-table-cell'}>
                                                                    <span className={'fundTitle'}
                                                                          title={item.fundTitle}>
                                                                        <span>{item.fundTitle}</span>
                                                                    </span>
                                                                </td>
                                                                <td className={'d-none d-lg-table-cell'}>{this.readableNumber(item.avgFundPrice)}</td>
                                                                <td className={'d-none d-lg-table-cell'}>{this.readableNumber(item.price)}</td>
                                                                <td className={'d-table-row d-lg-none'}>
                                                                    {this.readableNumber(item.avgFundPrice)}
                                                                    <br />
                                                                    {this.readableNumber(item.price)}
                                                                </td>
                                                                <td>{this.readableNumber(item.totalCost, '₺', true)}</td>
                                                                <td className={item.profitIndicator
                                                                  ? 'text-success'
                                                                  : 'text-danger'}>
                                                                    {this.readableNumber(item.profitLoss, '₺', true)}
                                                                </td>
                                                                <td className={item.profitIndicator
                                                                  ? 'text-success'
                                                                  : 'text-danger'}>
                                                                    {this.readableNumber(item.percentage, '%')}

                                                                    <ArrowIcon indicator={item.profitIndicator}/>
                                                                </td>
                                                            </tr>
                                                            {/*<tr>
                                                                <td colSpan={2}></td>
                                                                <td colSpan={3}>
                                                                    <Row>
                                                                        <Col md={6}>
                                                                            <strong>Maliyet</strong><br/>
                                                                            {Number(item.totalCost.toFixed(2)).toLocaleString('tr-TR')} ₺
                                                                        </Col>
                                                                        <Col md={6}>
                                                                            <div className={item.profitIndicator
                                                                              ? 'text-success'
                                                                              : 'text-danger'}>

                                                                                    {Number(item.profitLoss).toLocaleString('tr-TR')} ₺

                                                                                    {(item.percentage).toFixed(2)} %

                                                                                <ArrowIcon indicator={item.profitIndicator}/>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </td>
                                                            </tr>*/}
                                                            </tbody>
                                                          )
                                                      })
                                                  }
                                              </Table>
                                          </CardBody>
                                      </Card>
                                  </Col>
                              </Row>
                          </TabPane>
                        )
                    })

                    }
          </TabContent>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeTab: state.portfolio.selectedPortfolio,
    }
}

export default connect(mapStateToProps)(ListView)