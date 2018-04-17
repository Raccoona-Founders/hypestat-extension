import React from 'react';
import {Url, parse} from 'url';
import {HYPESTAT_URL} from 'Core/Constant';
import ExtensionPlatform from 'Core/Extension';

interface StateInterface {
    url?: string
}

export default class PopupApplication extends React.Component<any, StateInterface> {
    state = {
        url: null
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
                })
            }
        });
    }

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

        return (
            <div className="application">
                <h1 className="title">{url.host}</h1>
                <div className="button-container">
                    <button className="btn" onClick={this.onClick}>Open Hypestat</button>
                </div>
            </div>
        );
    }
}
