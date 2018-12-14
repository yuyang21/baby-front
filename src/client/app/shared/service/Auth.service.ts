import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PagingData, TopicInfo, Topic, User, Asks } from '../models/index';
import { Config } from '../config/env.config';
import { LoginService } from '../../shared/service/index';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';

@Injectable()
export class AuthService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'users';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
     }

    public checkLogin(event:NavigationStart){
        let loginTime = sessionStorage.getItem("loginTime");
        let currentTime = new Date().getTime();

        if(!loginTime || (currentTime - parseInt(loginTime)) >= 20 * 60 * 1000){
          sessionStorage.setItem('isLogged', '0');
          this.checkSession().subscribe((result) => {
            sessionStorage.setItem('hasChild', result.hasChild);
            if(result.isLogged == 1){
              sessionStorage.setItem('loginTime', (new Date().getTime()).toString());
              sessionStorage.setItem('isLogged', '1');
            } else {

              // if(browserUtils.isWeixin()){
                this.redirectToWechatAuth(event.url);
              // }
            }
          });      
        }

    }


     /**
     * 校验是否登陆
     */
    public checkSession(): Observable<any> {
        return this._http.get(this.apiUrl + '/checkSession')
            .map((response: Response) => response.json());
    }

    /**
     * 跳转到微信授权页
     */
    private redirectToWechatAuth(forwardUrl:string){
        let redirect_uri = Config.DOMAIN + Config.API + 'users/wechatLogin?forward=' +  encodeURIComponent(forwardUrl);
                let wechatAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Config.WECHAT_APPID + '&redirect_uri=' + 
                  encodeURIComponent(redirect_uri) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
                window.location.href = wechatAuthUrl;
    }



}