import {Url} from "url";
import {HYPESTAT_URL} from "./Constant";

export function isHostValid(url: Url): boolean {
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
}