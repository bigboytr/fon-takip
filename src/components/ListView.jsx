import React from "react";
import {Card, CardBody, CardHeader, Col, Row, Table} from "reactstrap";
import ArrowIcon from "./ArrowIcon";

class ListView extends React.Component {

    constructor(props) {
        super(props);

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

    render() {

        const {groupedPortfolio} = this.props
        let grandCost, grandProfitLoss = 0;

        return (
            <Row>
                <Col>

                    {groupedPortfolio.map((portfolio, index) => {
                        grandProfitLoss = 0;
                        grandCost = 0;
                        return (
                            <Card className={'mb-4'} key={`card${index}`}>
                                <CardHeader><h5 className={'m-0'}>{portfolio.title}</h5></CardHeader>
                                <CardBody className={'p-0'}>
                                    <Table size={'sm'} responsive className={'portfolio-list'}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Kod</th>
                                            <th width="25%">Fon Adı</th>
                                            <th>Alış Fiyatı</th>
                                            <th>Maliyet</th>
                                            <th>Fon Miktarı</th>
                                            <th>Fon Fiyatı</th>
                                            <th>Kar/Zarar</th>
                                            <th>Yüzde</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            portfolio.group.map((item, index) => {

                                                grandCost += item.totalCost
                                                grandProfitLoss += item.profitLoss

                                                return (
                                                    <tr key={item.code}>
                                                        <td>{++index}</td>
                                                        <td>
                                                            {item.code}
                                                            {/*<br/>
                                                                    <FontAwesomeIcon icon={['fas', 'question-circle']} title={item.fundTitle}/>*/}
                                                        </td>
                                                        <td width={'20%'}>
                                                                    <span className={'fundTitle'}
                                                                          title={item.fundTitle}>{item.fundTitle}</span>
                                                        </td>
                                                        <td>{Number(item.avgFundPrice.toFixed(6))} ₺</td>
                                                        <td>{Number(item.totalCost.toFixed(2)).toLocaleString('tr-TR')} ₺</td>
                                                        <td>{item.totalQuantity.toFixed(0)}</td>
                                                        <td>
                                                            {Number(item.price.toFixed(6))} ₺
                                                            <small><br/>{item.priceDate}</small>
                                                        </td>
                                                        <td className={item.profitIndicator ? 'text-success' : 'text-danger'}>
                                                                    <span className={'fixed-width'}>
                                                                        {Number(item.profitLoss).toLocaleString('tr-TR')} ₺
                                                                    </span>
                                                            <ArrowIcon indicator={item.profitIndicator}/>
                                                        </td>
                                                        <td className={item.profitIndicator ? 'text-success' : 'text-danger'}>
                                                                    <span className={'fixed-width'}>
                                                                        {(item.percentage).toFixed(2)} %
                                                                    </span>
                                                            <ArrowIcon indicator={item.profitIndicator} />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan={'3'}></td>
                                            <td colSpan={'2'}>
                                                <strong>Yatırım Miktarı:</strong>
                                                <br/>&nbsp;
                                                <h6>{Number(grandCost.toFixed(2)).toLocaleString('tr-TR')} ₺</h6>
                                            </td>
                                            <td colSpan={'2'}>
                                                <strong>Toplam Kar/Zarar:</strong><br/>
                                                {`${this.humanReadbleDate(this.props.selectedDate)} tarihi itibariyle;`}
                                                <Row>
                                                    <Col>
                                                        <h6 className={grandProfitLoss > 0 ? 'text-success' : 'text-danger'}>
                                                            {Number(grandProfitLoss.toFixed(2)).toLocaleString('tr-TR')} ₺
                                                        </h6>
                                                    </Col>
                                                    <Col>
                                                        <h6 className={grandProfitLoss > 0 ? 'text-success' : 'text-danger'}>
                                                            {((grandProfitLoss / grandCost) * 100).toFixed(2)} %
                                                        </h6>
                                                    </Col>
                                                </Row>
                                            </td>
                                            <td colSpan={'2'}>
                                                <strong>Kasa</strong>
                                                <br/>&nbsp;
                                                <h6 className={grandProfitLoss > 0 ? 'text-success' : 'text-danger'}>
                                                    {Number((grandCost + grandProfitLoss).toFixed(2)).toLocaleString('tr-TR')} ₺
                                                    <ArrowIcon className={'ml-2'} indicator={(grandProfitLoss > 0 )} />

                                                </h6>
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </CardBody>
                            </Card>
                        )
                    })

                    }

                </Col>
            </Row>
        )
    }
}

export default ListView;