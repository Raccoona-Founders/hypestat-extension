export declare namespace BrowserExtension {

    export interface ExtensionInterface {
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

        initBaseApi(): void;
    }
}