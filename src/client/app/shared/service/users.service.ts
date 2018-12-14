import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, User, Asks, Child } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class UsersService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'users';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json;charset=UTF-8');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * 话题录音者/问答者用户信息
     */
    public getUsersInfor(userId: number): Observable<User> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.get(this.apiUrl + '/' + userId, { search: params })
            .map((response: Response) => response.json() as User);
    }

    /**
     * 保存用户信息和孩子信息
     * 
     * user             用户信息
     * child            孩子信息
     * mobileCaptcha    短信验证码
     */
    public setUsersInfo(user:User, child: Child, mobileCaptcha: number,sex:number): Observable<User> {
        return this._http.post(this.apiUrl, { 
            name: user.name, mobile: user.mobile, mobileCaptcha: mobileCaptcha, sex: sex, age: child.age, honor: child.honor
        }, {headers: this.headers}).map((response: Response) => response.json() as User);
    }
    /**
     *   获取验证码
     */
    public sendMobileCaptcha(mobile: number): Observable<User> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.post(this.apiUrl + '/mobileCaptcha', {mobile: mobile}, { search: params })
        .map((response: Response) => response.json() as User);
    }
    /*
     * 个人中心-奖金总额
     */
    public getUserbonus(): Observable<User> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.get(Config.API + 'account', { search: params })
            .map((response: Response) => response.json() as User);
    }

    /**
     *  判断用户是否录入过话题:
     */
    public getUserTopic(): Observable<User> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.get(this.apiUrl + '/0/topicNum', { search: params })
            .map((response: Response) => response.json() as User);
    }

}