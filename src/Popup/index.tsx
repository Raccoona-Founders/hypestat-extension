import React from 'react';
import {Url, parse} from 'url';
import Extberry from 'extberry';

import {isHostValid, generateReport, HypestateReport} from 'Core';
import {HYPESTAT_URL} from 'Core/Constant';

interface StateInterface {
    url?: string;
    urlChecked: boolean;
    report?: HypestateReport;
}

export default class PopupApplication extends React.Component<any, StateInterface> {
    state = {
        url: null,
        urlChecked: true,
        report: null
    };

    componentDidMount() {
        const query = {
            active: true,
            currentWindow: true
        };

        Extberry.tabs.query(query, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab) {
                this.setState(() => {
                    return {
                        url: currentTab.url
                    };
                });

                this.loadContent();
            }
        });
    }

    loadContent = () => {
        const url = this.getUrl();

        if (!url) return;

        if (!isHostValid(url)) {
            return;
        }

        const onSuccess = (report: HypestateReport) => {
            this.setState(() => {
                return {
                    report: report
                }
            });
        };

        const onError = () => {
            this.setState(() => {
                return {
                    urlChecked: false
                }
            })
        };

        generateReport(url).then(onSuccess).catch(onError);
    };

    getUrl = (): Url => {
        const {url} = this.state;
        if (!url) return null;

        return parse(url);
    };

    onClick = () => {
        const url = this.getUrl();

        Extberry.openTab({
            url: `http://${url.host}.${HYPESTAT_URL}`,
            active: true
        });
    };

    renderReport() {
        const url = this.getUrl();
        const {report, urlChecked} = this.state;

        if (!report) {
            return (
                <div className="report">
                    <div className="report-wait">Wait...</div>
                </div>
            );
        }

        if (urlChecked) {
            return (
                <div className="report">
                    <p className="report-visitors">
                        Daily: <b>{report.uniqVisitors.d.format('0,0')}</b> / {' '}
                        Monthly: <b>{report.uniqVisitors.m.format('0,0')}</b>
                    </p>
                    <p className="report-text" dangerouslySetInnerHTML={{__html: report.text}}/>
                </div>
            )
        }

        return (
            <div className="report -warning">
                This site is not found in HypeStat database.
            </div>
        );
    }

    render() {
        const url = this.getUrl();

        if (!url) {
            return <div className="application">Wait</div>
        }

        const isValid = isHostValid(url);
        if (!isValid) {
            return (
                <div className="application">
                    <div className="invalid-host-error">
                        <h1 className="invalid-host-error__title">Invalid host</h1>
                        <p className="invalid-host-error__desc">Current host <b>{url.host}</b> is not valid for check in Hypestat.</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="application">
                <div className="header">
                    <h1 className="title">{url.host}</h1>
                    <div className="button-container">
                        <button className="link -open-hypestate" onClick={this.onClick}>On Hypestat</button>
                    </div>
                </div>

                {this.renderReport()}
            </div>
        );
    }
}
