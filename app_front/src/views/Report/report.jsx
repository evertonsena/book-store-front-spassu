import React, { Component, Suspense } from 'react'

import {
    Card, CardBody,
    Button,
} from 'reactstrap'

const loading = () =>
    <div className="animated fadeIn pt-3 text-center">Loading...</div>
class ReportView extends Component {
    constructor(){
        super()
    }


    render() {
        return(
            <div className="animated fadeIn">
                <Suspense fallback={loading()}>
                    <Card>
                        <CardBody>
                            <a href="http://localhost:9999/report" target="_blank">
                                <Button color="primary">
                                    Visualizar o Relatório
                                </Button>
                            </a>
                            <br/>
                            <br/>
                            <a href="http://localhost:9999/report_download" target="_blank">
                                <Button color="danger">
                                    Baixar em formato PDF
                                </Button>
                            </a>
                        </CardBody>
                    </Card>
                </Suspense>
            </div>
        )
    }
}
export default ReportView