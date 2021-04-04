import React from "react";
import {Card, CardBody, CardTitle, CardHeader, Col, Row, Table, Container, TabContent, TabPane} from "reactstrap";
import ArrowIcon from "./ArrowIcon";
import BigNumbers from "./BigNumbers";
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

          const bigNumbersTextColor = grandProfitLoss >= 0 ? 'text-success' : 'text-danger'
          const profitLoss = grandProfitLoss >= 0

          return (
            <TabPane tabId={index} key={`pane${index}`}>
              <Row className={'mb-2'}>
                <Col>
                  <Card body>
                    <CardTitle>
                      Yatırım Özeti
                    </CardTitle>
                    <Row>
                      <Col md={3}>
                        <BigNumbers
                          amount={this.readableNumber(this.grandCost, '₺', true)}
                          title={'Yatırım Miktarı'} />
                      </Col>
                      <Col md={3}>
                        <BigNumbers
                          amount={this.readableNumber((this.grandCost + grandProfitLoss), '₺', true)}
                          title={'Toplam Mevduat'}
                          textColor={bigNumbersTextColor}
                          showArrow={true}
                          profitLoss={profitLoss}
                        />
                      </Col>
                      <Col md={3}>
                        <BigNumbers
                          amount={this.readableNumber(grandProfitLoss, '₺', true)}
                          title={'Kar/Zarar Miktarı'}
                          textColor={bigNumbersTextColor}
                          showArrow={true}
                          profitLoss={profitLoss}
                        />
                      </Col>
                      <Col md={3}>
                        <BigNumbers
                          amount={this.readableNumber(((grandProfitLoss / this.grandCost) * 100), '%', true)}
                          title={'Değişim'}
                          textColor={bigNumbersTextColor}
                          showArrow={true}
                          profitLoss={profitLoss}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col>
                  <Card className={'mb-4'} key={`card${index}`}>
                    <CardBody className={'p-2'}>
                      <Table size={'sm'} responsive className={'portfolio-list'}>
                        <thead>
                        <tr>
                          <th>#</th>
                          <th>Kod</th>
                          <th width="25%" className={'d-none d-lg-table-cell'}>Fon Adı</th>
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
                              <tr>
                                <td>{++index}</td>
                                <td>
                                  <a href={`https://www.tefas.gov.tr/FonAnaliz.aspx?FonKod=${item.code}`} target={"_blank"}>
                                    {item.code}
                                  </a>
                                </td>
                                <td className={'d-none d-lg-table-cell'}>
                                    <span className={'fundTitle'} title={item.fundTitle}>
                                      {item.fundTitle}
                                    </span>
                                </td>
                                <td className={'d-none d-lg-table-cell'}>{this.readableNumber(item.avgFundPrice)}</td>
                                <td className={'d-none d-lg-table-cell'}>{this.readableNumber(item.price)}</td>
                                <td className={'d-table-row d-lg-none'}>
                                  {this.readableNumber(item.avgFundPrice)}
                                  <br/>
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

                                  <ArrowIcon isProfit={item.profitIndicator}/>
                                </td>
                              </tr>
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