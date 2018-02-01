import React from 'react';
import ExtensionPlatform from 'Core/Extension';
import {Url, parse} from 'url';
import Axios from 'axios';

const HYPESTAT_URL = 'hypestat.com';

interface StateInterface {
    url?: string;
    urlChecked: boolean;
    text?: string;
}

export default class PopupApplication extends React.Component<any, StateInterface> {

    state = {
        url: null,
        urlChecked: true,
        text: null
    };

    componentDidMount() {
        const query = {
            active: true,
            currentWindow: true
        };

        ExtensionPlatform.getTabs().query(query, (tabs) => {
            const currentTab = tabs[0];
            if (currentTab) {
                this.setState(() => {
                    return {
                        url: currentTab.url
                    };
                });

                setTimeout(this.loadContent, 0);
            }
        });
    }

    loadContent = () => {
        const url = this.getUrl();

        if (!url) {
            return <div className="application">Wait</div>
        }

        if (!this.isHostValid(url)) {
            return;
        }

        const axiosRequest = {
            method: 'get',
            url: `http://${url.host}.${HYPESTAT_URL}`
        };

        const onSuccess = (response) => {

            if (!response.data) {
                return;
            }

            const el = document.createElement('html');
            el.innerHTML = response.data;

            const text = el.getElementsByClassName('website_report_text')[0];

            if (!text) {
                this.setState(() => {
                    return {urlChecked: false};
                });

                return;
            }

            this.setState(() => {
                return {text: text.innerHTML};
            })
        };


        Axios(axiosRequest).then(onSuccess);
    };

    isHostValid = (url: Url): boolean => {
        const segments = url.host.split('.');
        if (segments.length < 2) {
            return false;
        }

        if (false === ['http:', 'https:'].includes(url.protocol)) {
            return false;
        }

        if (url.host.includes(HYPESTAT_URL)) {
            return false;
        }

        return true;
    };

    getUrl = (): Url => {
        const {url} = this.state;

        if (!url) {
            return null;
        }

        return parse(url);
    };

    onClick = () => {
        const url = this.getUrl();

        ExtensionPlatform.getTabs().create({
            url: `http://${url.host}.${HYPESTAT_URL}`,
            active: true
        });
    };

    render() {
        const url = this.getUrl();

        if (!url) {
            return <div className="application">Wait</div>
        }

        const isValid = this.isHostValid(url);
        if (!isValid) {
            return <div className="application">Invalid host</div>
        }

        const {text, urlChecked} = this.state;

        return (
            <div className="application">
                <div className="header">
                    <h1 className="title">{url.host}</h1>

                    <div className="button-container">
                        <button className="link" onClick={this.onClick}>Open Hypestat</button>
                    </div>
                </div>

                {urlChecked ? (
                        <div className="report-text">
                            {text
                                ? <p dangerouslySetInnerHTML={{ __html: text }}/>
                                : <div className="report-text__wait">Wait...</div>}
                        </div>
                    ) : (
                        <div className="report-text -warning">This site is not found in HypeStat database.</div>
                    )
                }
            </div>
        );
    }
}
