
/**
 * 分页的数据模型
 */
export class PagingData<T> {

    /**
     * 总数据量
     */
    public total:number;

    /**
     * 总页数
     */
    public totalPage:number;

    /**
     * 每页多少条记录
     */
    public pageSize:number;

    /**
     * 当前页数
     */
    public index:number;

    /**
     * 每页的数据
     */
    public data:T[];
    
    
}