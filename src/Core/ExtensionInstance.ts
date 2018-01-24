import {BrowserExtension} from 'Core/Declarations/BrowserExtension'

declare global {
    export interface Window {
        browser: any
    }
}

const browserApiList: string[] = [
    'alarms',
    'bookmarks',
    'browserAction',
    'commands',
    'contextMenus',
    'cookies',
    'downloads',
    'events',
    'extension',
    'extensionTypes',
    'history',
    'i18n',
    'idle',
    'notifications',
    'pageAction',
    'runtime',
    'storage',
    'tabs',
    'webNavigation',
    'webRequest',
    'windows',
];

class Extension implements BrowserExtension.ExtensionInterface {

    alarms?: any;
    bookmarks?: any;
    browserAction?: any;
    commands?: any;
    contextMenus?: any;
    cookies?: any;
    downloads?: any;
    events?: any;
    extension?: any;
    extensionTypes?: string[];
    history?: any;
    i18n?: any;
    idle?: any;
    notifications?: any;
    pageAction?: any;
    runtime?: any;
    storage?: any;
    tabs?: any;
    webNavigation?: any;
    webRequest?: any;
    windows?: any;
    api?: any;

    constructor() {
        this.initBaseApi();

        try {
            if (window.browser && window.browser.runtime) {
                this.runtime = window.browser.runtime
            }
        } catch (e) {
        }

        try {
            if (window.browser && window.browser.browserAction) {
                this.browserAction = window.browser.browserAction
            }
        } catch (e) {
        }
    }

    initBaseApi(): void {
        browserApiList.forEach((api) => {

            this[api] = null;

            try {
                if (chrome[api]) {
                    this[api] = chrome[api]
                }
            } catch (e) {
            }

            try {
                if (window[api]) {
                    this[api] = window[api]
                }
            } catch (e) {
            }

            try {
                if (window.browser[api]) {
                    this[api] = window.browser[api]
                }
            } catch (e) {
            }

            try {
                this.api = window.browser.extension[api]
            } catch (e) {
            }
        });
    }
}

export default Extension;