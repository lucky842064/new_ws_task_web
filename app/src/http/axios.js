axios.interceptors.request.use(
    (config) => { 
        // 解决 axios 多发送 Request Method: OPTIONS 请求问题
        config.headers['Content-Type'] = 'text/plain'
        config.url = config.url
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios
