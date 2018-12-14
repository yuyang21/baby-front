import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, Tape, User, askAnswerInfo } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class TopicService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'topics';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public getAll(page: number, pageSize: number): Observable<PagingData<TopicInfo>> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());

        return this._http.get(this.apiUrl, { search: params })
            .map((response: Response) => response.json() as PagingData<TopicInfo>);
    }

    /**
     * 话题详情
     */
    public getTopicsDetail(topicId: number): Observable<Topic> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());

        return this._http.get(this.apiUrl + '/' + topicId, { search: params })
            .map((response: Response) => response.json() as Topic);
    }

    /**
     * 话题赞
     */
    public getPraise(topicId: number): Observable<Topic> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());

        return this._http.put(this.apiUrl + '/' + topicId + '/praise',{topicId: topicId}, { search: params })
            .map((response: Response) => response.json() as Topic);
    }

    /**
     * 话题赏
     */
    public getAward(topicId: number,rewardAmount: number, requestNo: number): Observable<Topic> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());
        params.set('rewardAmount', rewardAmount.toString());
        params.set('requestNo', requestNo.toString());

        return this._http.put(this.apiUrl + '/' + topicId + '/award',{topicId: topicId, rewardAmount: rewardAmount, requestNo: requestNo}, { search: params })
            .map((response: Response) => response.json() as Topic);
    }


    /**
     * 话题的所有语音:
     */
    public getTape(topicId: number): Observable<Tape> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());

        return this._http.get(this.apiUrl + '/' + topicId + '/tape', { search: params })
            .map((response: Response) => response.json() as Tape); 
    }


    /**
     * 语音发布
     */
    public release(content: string, uploadVoices: string): Observable<Topic> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.post(this.apiUrl , {content: content, uploadVoices: uploadVoices })
            .map((response: Response) => response.json() as Topic); 
    }
    
    /**
     * 话题详情页，获取登录用户对答的听赞赏记录
     */
    public supportRecords(topicId: number, type: number): Observable<askAnswerInfo> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());
        params.set('type', type.toString());
        return this._http.get(this.apiUrl + '/' + topicId + '/supportRecords' ,{search: params })
            .map((response: Response) => response.json() as askAnswerInfo); 
    }

    /**
     * 手动登录
     */
    public login(account: String, password: String, openId: String): Observable<User> {
        let params: URLSearchParams = new URLSearchParams();
        return this._http.post(Config.API + 'users/login',{account: account, password: password,openId: openId}, { search: params })
            .map((response: Response) => response.json() as User);
    }

    

}