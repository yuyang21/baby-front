import { Injectable } from '@angular/core';

/**
 * 浏览器相关工具类
 */
@Injectable()
export class BrowserUtils {


    constructor() {}


    /**
     * 是否在微信中
     */
    public isWeixin() {
        let isWeixin: boolean = false;

        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == null){
            return isWeixin;
        }
        
        ua.match(/MicroMessenger/i).forEach(s => {
            if(s == "micromessenger"){
                isWeixin = true;
            }
        })

        return isWeixin;
    }



}