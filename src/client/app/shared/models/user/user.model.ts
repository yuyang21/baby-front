
/**
 * 用户数据模型
 */
export class User {

    /**
     * 用户名
     */
    public name:string;

    /**
     * 性别，0 未知， 1男生 2女生
     */
    public sex:number;

    /**
     * 昵称
     */
    public nickName:string;

    public id: number;
     /**
     * 年龄
     */
    public babyAge:number;
     /**
     * 荣誉
     */
    public honor:string;
     /**
     * 手机验证码
     */
    public mobileCapcha:string;
    /**
     * 手机号
     */
    public mobile:string;
    public ret: number;
    public msg: string;
    public receivedCapital: number; //收到的奖金总额

    public portraitUrl: string;
}