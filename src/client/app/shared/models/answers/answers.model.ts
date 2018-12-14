
/**
 * 回答数据模型
 */
export class Answers<T> {
    public data:T[];

    public index:number;

    public pageSize:string;

    public tail:number;

    public total:number;

    public totalPage: string;
}