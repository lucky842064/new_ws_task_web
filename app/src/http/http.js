var httpRequest;
class HttpRequestManager {
    constructor() {
        if (!httpRequest) {
            this.col = {};
            httpRequest = this;
        }
        return httpRequest
    }
}
export default new HttpRequestManager();