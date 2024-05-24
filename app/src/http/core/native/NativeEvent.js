import Global from "../Global";
import SyncJSBridge from "./SyncJSBridge";
export default class NativeEvent {
    _syncBridge = null; //同步原生交互桥

    /**
     * 原生模块初始化
     */
    setup() {
        this._syncBridge = new SyncJSBridge();
    }
    onInit() {
        this._syncBridge.onInit()

        // this.initZADunSDK("",(retObj)=>{
        //     if (retObj.result == 0 ){
        //         let port = this.getZADunPortByAddr("",8200)
        //         Logger.error("getZADunPortByAddr port " + port)
        //     }
        // })

    }
    localStorageClear(){
        this._syncBridge.localStorageClear();
    }
    
    /**
     * 原生storage存储Get
     */
    localStorageGetItem(key){
        return this._syncBridge.localStorageGetItem(key);
    }

    /**
     * 原生storage存储Set
     */
    localStorageSetItem(key ,value){
        this._syncBridge.localStorageSetItem(key,value);
    }

    /**
     * 原生storage删除key
     * @param {*} key 
     */
    localStorageRemoveItem(key){
        this._syncBridge.localStorageRemoveItem(key);
    }

}