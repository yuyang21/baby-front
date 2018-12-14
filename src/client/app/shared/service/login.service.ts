import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, User } from '../models/index';
import { Config } from '../config/env.config';

/**
 * 登陆退出等
 */
@Injectable()
export class LoginService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'users';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * 校验是否登陆
     */
    public checkSession(): Observable<any> {
        return this._http.get(this.apiUrl + '/checkSession')
            .map((response: Response) => response.json());
    }



}