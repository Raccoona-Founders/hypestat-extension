import CreateProperties = chrome.tabs.CreateProperties;
import ExtensionInstance from 'Core/ExtensionInstance';
import Manifest = chrome.runtime.Manifest;

const extension: ExtensionInstance = new ExtensionInstance();

interface RuntimeInterface {
    onMessage: chrome.runtime.ExtensionMessageEvent;
    onInstalled: chrome.runtime.ExtensionMessageEvent;

    connect(connectInfo?: chrome.runtime.ConnectInfo): chrome.runtime.Port;
}

interface TabsInterface {
    create(props?: chrome.tabs.CreateProperties): void;
    query(query: any, callback: any): void;
}

export default class ExtensionPlatform {

    static getExtension(): ExtensionInstance {
        return extension;
    }

    /**
     * Extract Tabs function
     */
    static getTabs(): TabsInterface {
        return extension.tabs;
    }

    /**
     * extract Runtime object function
     */
    static getRuntime(): RuntimeInterface {
        return extension.runtime;
    }

    static reload() {
        extension.runtime.reload();
    }

    static openWindow(createProperties: CreateProperties, callback: Function = null) {
        extension.tabs.create(createProperties, callback);
    }

    static getManifest(): Manifest {
        return extension.runtime.getManifest();
    }

    static getNotifications(): any {
        return extension.notifications;
    }
}
