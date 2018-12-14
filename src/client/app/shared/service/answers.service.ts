import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, User, Asks, Answers, askAnswerInfo, Answer, Tape } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class AnswersService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'answers';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * 话题问答分页查询
     */
    public answersList(topicId: number, askStatus: number, answerStatus: number, page: number, pageSize: number): Observable<Answers<askAnswerInfo>> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());
        params.set('askStatus', askStatus.toString());
        params.set('answerStatus', answerStatus.toString());
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());

        return this._http.get(this.apiUrl, { search: params })
            .map((response: Response) => response.json() as Answers<askAnswerInfo>);
    }

    /**
     * 回答的赞
     */
    public getAnswerPraise(answerId: number): Observable<Answer> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('answerId', answerId.toString());

        return this._http.put(this.apiUrl + '/' + answerId + '/praise',{answerId: answerId})
            .map((response: Response) => response.json() as Answer);
    }

    /**
     * 回答的赏
     */
    public getAnswerAward(answerId: number,rewardAmount: number, requestNo: number): Observable<Answer> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('answerId', answerId.toString());
        params.set('rewardAmount', rewardAmount.toString());
        params.set('requestNo', requestNo.toString());

        return this._http.put(this.apiUrl + '/' + answerId + '/award',{answerId: answerId, rewardAmount: rewardAmount, requestNo: requestNo})
            .map((response: Response) => response.json() as Answer);
    }
    /**
     * 回答语音录入userId,askId,mediaId
     */
    public setTapes(askId: number, mediaId: string, duration:number): Observable<Answer> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('askId', askId.toString());
        params.set('mediaId', mediaId.toString());
        params.set('duration', duration.toString());

        return this._http.post(this.apiUrl + '/recording', {askId: askId, mediaId: mediaId}, { search: params })
            .map((response: Response) => response.json() as Answer);
    }

}