// import ReportKey from "../core/const/ReportKey";
// import Global from '../core/Global'
// axios.interceptors.request.use(
//     (config) => {
//         config.headers['Content-Type'] = 'text/plain'
//         config.url = config.url
//         return config;
//     }, (error) => {
//         return Promise.reject(error);
//     }
// );
// axios.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         try {
//             let config = error.config;
//             let reqUrl = config.url || "";
//             if (reqUrl.includes(Global.ReportTool.reportUrl)) {
//                 return Promise.reject(error);
//             }
//             let http = error.response;
//             let httpStatus = 0
//             let httpBody = config.data || JSON.stringify({});
//             let starttime = JSON.parse(httpBody).sendTime || 0
//             if(http){
//                 httpStatus = http.status
//             }
//             let arr = reqUrl.replace("//", "/").split("/")
//             let realHost = arr[1] || ""
//             let htime = new Date().getTime() - starttime;
//             if(!http){
//                 htime = config.timeout
//             }
//             let reportParam = {
//                 "error_code": httpStatus,
//                 "body": httpBody,
//                 "url": reqUrl,
//                 "htime": htime,
//                 "host": realHost,
//                 "addrHost": realHost
//             };
//             let reportKey = ReportKey.REPORT_TYPE_HTTP_ERROR;
//             //重定向
//             if (httpStatus == 308 || httpStatus == 307 || httpStatus == 302) {

//             } else {
//                 Global.ReportTool.ReportClientError(reportKey, reportParam);
//             }
//         } catch (err) {

//         }

//         return Promise.reject(error);
//     }
// );

// export default axios

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
