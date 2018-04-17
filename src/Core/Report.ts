import Axios from "axios";
import {Url} from "url";
import Numeral from 'numeral';
import {HYPESTAT_URL} from "./Constant";
import {months} from "moment";


export interface HypestateReport {
    text: string;
    uniqVisitors: {
        d: Numeral;
        m: Numeral;
    };
}

export function generateReport(url: Url): Promise<HypestateReport> {
    const axiosRequest = {
        method: 'get',
        url: `http://${url.host}.${HYPESTAT_URL}`
    };

    const onSuccess = (response): HypestateReport => {

        if (!response.data) {
            throw new Error("Can not load URL");
        }

        const el = document.createElement('html');
        el.innerHTML = response.data;


        return extractReport(el);
    };


    return Axios(axiosRequest).then(onSuccess);
}

function extractNumber(str: string): Numeral {
    return Numeral(str);
}

function extractReport(el: HTMLElement): HypestateReport {
    const text = el.getElementsByClassName('website_report_text')[0];

    if (!text) {
        throw new Error("No data");
    }

    const hypeReport: HypestateReport = {
        text: text.innerHTML
    } as HypestateReport;

    const trafficReport = el.querySelector('.traffic_report');
    const reportListNumbers = trafficReport.getElementsByTagName('dd');

    const dUniqVisitors = reportListNumbers[0].innerHTML;
    const mUniqVisitors = reportListNumbers[1].innerHTML;

    hypeReport.uniqVisitors = {
        d: extractNumber(dUniqVisitors),
        m: extractNumber(mUniqVisitors)
    };

    return hypeReport;
}