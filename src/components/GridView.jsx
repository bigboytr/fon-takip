import React from "react";
import {Badge, Card, CardBody, CardHeader, Col, Row, Table} from "reactstrap";
import ArrowIcon from "./ArrowIcon";

class ListView extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        const {groupedPortfolio} = this.props
        let grandCost, grandProfitLoss = 0;

        return (
            <>
                {groupedPortfolio.map((portfolio) => {
                    return (
                        <Row className={'mb-4'}>
                            <Col sm={'12'} className={'mb-2'}>
                                <Card>
                                    <CardBody>
                                        <h5 className={'m-0'}>{portfolio.title}</h5>
                                    </CardBody>
                                </Card>
                            </Col>
                            {portfolio.group.map((item) => {
                                return (
                                    <Col sm={'3'} className={'p-3'}>
                                        <Card>
                                            <CardBody className={'pb-3 portfolio-item'}>
                                                <div>
                                                    <h5>{item.code}</h5>
                                                    <div className={'long-title mb-2'}>{item.fundTitle}</div>
                                                </div>
                                                <Row>
                                                    <Col sm={'12'}>
                                                        {item.priceDate}
                                                    </Col>
                                                    <Col className={'p-1'}>
                                                        <p><strong>Alış Fiyatı: </strong><br/>
                                                            <h6>{Number(item.avgFundPrice.toFixed(6))} ₺</h6>
                                                        </p>
                                                    </Col>
                                                    <Col className={'p-1'}>

                                                        <strong>Fon Fiyatı: </strong>
                                                        <Badge color={'info'}>
                                                            <h6 className={'m-0'}>{Number(item.price.toFixed(6))} ₺</h6>
                                                        </Badge>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                <Row>
                                                    <Col className={'p-1'}>
                                                        <strong>Fon Miktarı:</strong> <br/>
                                                        <h6>{item.totalQuantity.toFixed(0)}</h6>
                                                    </Col>
                                                    <Col className={'p-1'}>
                                                        <strong>Maliyet:</strong> <br/>
                                                        <h6>{Number(item.totalCost.toFixed(2)).toLocaleString('tr-TR')} ₺</h6>
                                                    </Col>
                                                </Row>
                                                <hr/>
                                                <Row>
                                                    <Col className={'p-1'}>
                                                        <strong>Kar/Zarar</strong>
                                                        <Badge color={item.profitIndicator ? 'success' : 'danger'}>
                                                            <h6 className={'m-0'}>
                                                                {Number(item.profitLoss).toLocaleString('tr-TR')} ₺
                                                                <ArrowIcon className={'ml-2'}
                                                                           indicator={item.profitIndicator}/>
                                                            </h6>
                                                        </Badge>

                                                    </Col>
                                                    <Col className={'p-1'}>
                                                        <strong>Yüzde %</strong>
                                                        <Badge color={item.profitIndicator ? 'success' : 'danger'}>
                                                            <h6 className={'m-0'}>
                                                                {(item.percentage).toFixed(2)} %
                                                                <ArrowIcon className={'ml-2'}
                                                                       indicator={item.profitIndicator}/>
                                                            </h6>
                                                        </Badge>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })
                            }
                        </Row>
                    )
                })
                }
            </>
        )
    }
}

export default ListView;