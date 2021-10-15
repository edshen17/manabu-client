import axios from 'axios';
import urljoin from 'url-join';

const baseUrl = '/api/v1';
const isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use((config: any) => {
  if (!isAbsoluteURLRegex.test(config.url)) {
    config.url = urljoin(baseUrl, config.url);
  }
  return config;
});

axios.defaults.validateStatus = (status: number) => {
  return status >= 200 && status < 300;
};

export default axios.create({
  baseURL: baseUrl,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});
