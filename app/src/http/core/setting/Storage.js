import Global from "../Global";
import StorageKey from "../const/StorageKey";
export default class Storage{
    //默认为string格式存储  包括数字
    set(key, value)
    {
        if(value == null){
            value = ""
        }
        let newKey = this.getFinalKey(key);
        localStorage.setItem(newKey,value);
       
    }

    setObject(key, value){
        if(value == null){
            return;
        } 
        let content = "";
        try {
            content = JSON.stringify(value)
            this.set(key, content);
        } catch (error) {
            Logger.error("Storage.setObject 出错", e && e.message)
            return;
        }
    }

    setBool(key,value){
        let content = value ? "1" : "0"
        this.set(key, content);
    }

    get(key){
        let newKey = this.getFinalKey(key);
        let value = null;
        value = localStorage.getItem(newKey);
        
        if(value == null || value == undefined){
            value = "";
        } 
        return value;
    }

    getNumber(key,defalut = 0){
        let content = this.get(key);
        if(content == ""){
            return defalut;
        } 
        let value = Number(content);
        if(!isNaN(value)){
            return value;
        }else{
            return defalut;
        }
    }

    getObject(key){
        let content = this.get(key);
        if(content == ""){
            return null;
        }
        let obj = null;
        try {
            obj = JSON.parse(content);
        } catch (error) {
            Logger.error("Storage.getObject 出错", error && error.message)
        }
        return obj;
    }

    getBool(key){
        let content = this.get(key);
        return content == "1";
    }

    removeKey(key){
        let newKey = this.getFinalKey(key); 
        localStorage.removeItem(newKey);
    }

    //对key做加工
    getFinalKey(key){
        return key;
    }

}