import Axios from 'axios';
import numeral from 'numeral';
import { HYPESTAT_URL } from './Constant';

export interface HypestateReport {
  text: string;
  uniqVisitors: {
    daily: numeral.Numeral;
    monthly: numeral.Numeral;
    perVisit: numeral.Numeral;
    pageViews: numeral.Numeral;
  };
}

export function generateReport(url: URL): Promise<HypestateReport> {
  const axiosRequest = {
    method: 'get',
    url: `https://${HYPESTAT_URL}/info/${url.host}`
  };

  const onSuccess = (response: any): HypestateReport => {
    if (!response.data) {
      throw new Error('Can not load URL');
    }

    const el = document.createElement('html');
    el.innerHTML = response.data;

    return extractReport(el);
  };


  return Axios(axiosRequest).then(onSuccess);
}

function extractNumber(str: string | number): numeral.Numeral {
  return numeral(str);
}

function extractReport(el: HTMLElement): HypestateReport {
  const textContainer = el.querySelector('#traffic span:nth-child(2)');

  const hypeReport: HypestateReport = {
    text: textContainer?.innerHTML || ''
  } as HypestateReport;

  hypeReport.uniqVisitors = {
    daily: extractNumber(0),
    monthly: extractNumber(0),
    perVisit: extractNumber(0),
    pageViews: extractNumber(0)
  };

  const trafficReport = el.querySelector('.traffic_report');
  if (trafficReport) {
    const elements = trafficReport?.querySelectorAll('dd');

    if (elements) {
      const dUniqVisitors = elements[0].innerHTML;
      const mUniqVisitors = elements[1].innerHTML;
      const pagesPerVisit = elements[2].innerHTML;
      const dailyPageViews = elements[3].innerHTML;

      hypeReport.uniqVisitors = {
        daily: extractNumber(dUniqVisitors),
        monthly: extractNumber(mUniqVisitors),
        perVisit: extractNumber(pagesPerVisit),
        pageViews: extractNumber(dailyPageViews),

      };
    }
  }

  return hypeReport;
}
