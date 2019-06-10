import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import {
    Card,
    CardBody,
    Button
} from '@patternfly/react-core';
import {
    Spinner
} from '@redhat-cloud-services/frontend-components';
import { ReportListPage } from '../../PresentationalComponents/ReportListPage/ReportListPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import { fetchReport } from '../../actions/ReportActions';
import { formatValue } from '../../Utilities/formatValue';
import { GlobalProps } from '../../models/GlobalProps';
import { Report } from '../../models/Report';
import { GlobalState } from '../../models/GlobalState';

interface Props extends GlobalProps {
    report: Report;
    loading: boolean;
    fetchReport: (reportId: number) => void;
};

interface State {
    reportId: number;
};

class ReportView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            reportId: props.match.params.reportId
        };
    }

    componentDidMount(): void {
        this.fetchData();
    }

    fetchData(): void {
        const id: number = this.state.reportId;
        if (id) {
            this.props.fetchReport(id);
        }
    }

    render() {
        const { report } = this.props;
        let action = this.props.match.params.reportId && report ? report.id : 'Unknown report';

        if (report && !this.props.match.params.reportId) {
            return <Redirect to={ `/reports/${ report.id }` } />;
        }

        return (
            <ReportListPage title={ `Report ${action}` } showBreadcrumb={ false }>
                <LoadingState
                    loading={ this.props.loading }
                    placeholder={ <Spinner centered/> }>
                    <Card>
                        <CardBody>
                            {
                                report ? <div className="pf-c-content">
                                    <dl>
                                        <dt>Customer id:</dt>
                                        <dd>{ report.customerId }</dd>
                                        <dt>File name:</dt>
                                        <dd>{ report.fileName }</dd>
                                        <dt>Number of hosts:</dt>
                                        <dd>{ report.numberOfHosts.toLocaleString() }</dd>
                                        <dt>Total disk space:</dt>
                                        <dd>{ report.totalDiskSpace.toLocaleString() } B</dd>
                                        <dt>Total price:</dt>
                                        <dd>{ formatValue(report.totalPrice, 'usd') }</dd>
                                        <dt>Creation date:</dt>
                                        <dd>{ new Date(report.creationDate).toString() }</dd>
                                    </dl>
                                    <Button variant="secondary" component= { Link } to="/reports">Back</Button>
                                </div>
                                    : ''
                            }
                        </CardBody>
                    </Card>
                </LoadingState>
            </ReportListPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let { report, loading } = state.reports;
    return {
        report,
        loading
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReport
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportView));