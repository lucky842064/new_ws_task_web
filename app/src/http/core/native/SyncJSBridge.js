import Helper from "../../utils/helper";
/****
 * 同步获取参数类
 * ****/
export default class SyncJSBridge{
    _jsBridge = null;

    setup(){
        Logger.log("SyncJSBridge  初始化")
    }
    onInit(){
        if(Helper.openInWebview()){
            if(Helper.judgeClient() == "iOS"){
                this._excuteIosFunc("onInit")
            }else if(Helper.judgeClient() == "Android"){
                if (this._jsBridge && this._jsBridge.onInit){
                    this._jsBridge.onInit();
                }
            }
            
        }else{

        }
    }
    _excuteIosFunc(funcName,params){
        if (!prompt){
            return;
        }
        if (!funcName){
            return;
        }
        if (params == null || params == undefined){
            params = ""
        }
        var type = "JSbridge";
        var payload = {"type": type, "funcName": funcName, "params": params};
        var res = prompt(JSON.stringify(payload));
        return res;
    };
}