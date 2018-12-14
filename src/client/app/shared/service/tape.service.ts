import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Tape } from '../models/index';
import { Config } from '../config/env.config';

@Injectable()
export class TapeService {

    private apiUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {
        this.apiUrl = Config.API + 'tape';
        this.headers = new Headers();
        this.headers.append('Content-type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    
    /**
     * 回答语音重录tapeId,mediaId,duration
     */
    public setTapes(tapeId: number,mediaId: number, duration: number): Observable<Tape> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('tapeId', tapeId.toString());
        params.set('mediaId', mediaId.toString());
        params.set('duration', duration.toString());

        return this._http.put(this.apiUrl + '/' + tapeId ,{tapeId: tapeId})
            .map((response: Response) => response.json() as Tape);
    }

}