import NativeEvent from "./native/NativeEvent"
import Setting from "./setting/Setting"
export default class Global{
    static NativeEvent = new NativeEvent();
    static Setting = new Setting();


    static setup(){
        Global.NativeEvent.setup();
        // Global.Setting.setup();
    }
}