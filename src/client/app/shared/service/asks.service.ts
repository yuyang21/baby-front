import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { PagingData, TopicInfo, Topic, User, Asks } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class AsksService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'asks';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    /**
     * 提问
     */
    public ask_question(topicId: number, question: string): Observable<Asks> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('topicId', topicId.toString());

        return this._http.post(this.apiUrl, {topicId: topicId, question: question}, { search: params })
            .map((response: Response) => response.json() as Asks);
    }

     /**
     * 回答 问题的详情
     */
    public getAnswerQuestion(AskId: number): Observable<Asks> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('AskId', AskId.toString());

        return this._http.get(this.apiUrl + '/' + AskId , { search: params })
            .map((response: Response) => response.json() as Asks); 
    }

}