import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, User, Asks } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class WechatService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'wechat';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * apiConfig 信息获取
     */
    public apiConfig() {
        let url:string = location.href.split('#')[0];

        let params: URLSearchParams = new URLSearchParams();
        params.append("url", url);

        this._http.get(this.apiUrl + '/jsApiConfig', { search: params })
            .map((response: Response) => response.json())
            .subscribe((apiConfig) => {
                let bodyConfig:any = {};
                bodyConfig.debug = true;
                bodyConfig.appId = Config.WECHAT_APPID;
                bodyConfig.nonceStr = apiConfig.nonceStr;
                bodyConfig.signature = apiConfig.signature;
                bodyConfig.timestamp = apiConfig.timestamp;
                bodyConfig.jsApiList = ['onMenuShareAppMessage', 'hideMenuItems', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 
                    'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'];
                wx.config(bodyConfig);
            });
    }

}