import {Component, EventEmitter, OnInit, Pipe, PipeTransform} from '@angular/core';
import { RouterModule, ActivatedRoute, RouterState, Router } from '@angular/router'
import { FormControl, FormArray, FormGroup } from '@angular/forms';
import { UsersService } from '../../shared/service/index';
import { User, Child } from '../../shared/models/index';

/**
 * This class represents the info component.
 */
declare  var $:any;
@Component({
  moduleId: module.id,
  selector: 'sd-user-info',
  templateUrl: 'info.component.html',
  styleUrls: ['info.component.css'],
})


 export class InfoComponent implements OnInit {
   errMsg: string ;  //错误信息
   succeedMsg: string = '';   //成功提示
   isMask: boolean;     //成功提示蒙层控制
   isToast: boolean; //错误提示
   showSexOption: boolean = false;//性别选项
   sendWord: any //发送验证码按钮文字
   name: string;
   mobile: number;
   mobileCaptcha: string;
   babyAge: number;
   honor: string; 
   user: User = new User();
   child: Child = new Child();
   sexMap:Map<string, string>;
   sexList:any[] = [];
   busy:boolean = false;
   sex: string='男孩';
   
   /**
   * 构造器
   * @param {_usersService} UsersService - 依赖注入的服务，需要在model中providers中声明.setUsersInfo
   */
  constructor(private route: ActivatedRoute, private router: Router, public _usersService: UsersService) {
    this.isToast = false;
    this.showSexOption = false;
    this.sendWord = '获取验证码';
    this.isMask = false;
    this.child.sex = '男孩';
  }
  
  /**
   * Get the names ngOnInit
   */
  ngOnInit() {
    let hasChild:string = sessionStorage.getItem('hasChild');
    // if(hasChild == '1'){
    //   this.router.navigate(['/topic']);
    // }
  }
  //转化年龄string to number
  transformSex(newVal:string){
    if(newVal == "女孩") {
      return 2;
    }else {
      return 1;
    }
  }
  /**
   * 校验手机号
   */ 
  mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
  checkMobile(newVal:any){
    if(newVal == undefined) {
      return;
    }
    if(newVal.toString().length >10 && !this.mobilePattern.test(newVal)){
      this.showMsg('手机号格式有误','');
    }
  }
  /**
   * 校验年龄
   */ 
  agePattern = /^-?[1-9]\d*$/;
  checkAge(newVal:any){
    console.log(newVal);
    if(newVal == undefined) {
      return;
    }
    if(newVal< 0 || newVal > 18 || !this.agePattern.test(newVal)){
      this.showMsg('请输入0-18的整数','');
    }
  }
   /**
   * 校验荣誉字数
   */ 
  checkHonor(newVal:any){
    if(newVal == undefined) {
      return;
    }
    if(newVal.length > 15){
      this.showMsg('请输入15字以内','');
    }
  }

  //提示显示公用方法 
  showMsg(errMsg: string, succeedMsg: string){
    if(errMsg){
      this.isToast = true;
      this.errMsg = errMsg;
    }else {
      this.succeedMsg = succeedMsg;
      this.isMask = true;
    } 
    setInterval(() => { 
      this.isToast = false;
      this.isMask = false;
      this.errMsg = '';
      this.succeedMsg = '';
    },3000);
  }
  
   /**
    * 获取验证码
    */
    sendCapcha(mobile:number){
      if(!this.user.mobile || this.user.mobile == undefined){
        this.showMsg('请输入手机号','');
        return;
      }
      if(this.user.mobile.toString().length < 11 || !this.mobilePattern.test(this.user.mobile)){
        this.showMsg('手机号格式有误','');
        return;
      }
      this._usersService.sendMobileCaptcha(mobile).subscribe(result => {
        if(result.ret == 1) {
          $('#capchaBtn').addClass('after-send-btn');
          this.sendWord = 60;
          let timer = setInterval(() => { 
            this.sendWord --;
            if(this.sendWord < 0){
              clearInterval(timer);
              this.sendWord = '重新发送';
              $('#capchaBtn').removeClass('after-send-btn');
            }
          },1000);
        }
      });
    }

   /**
   * 设置基本信息
   */
  setUsersInfo(mobileCaptcha:number,sex:number) {
    if(this.busy){
      return;
    }
    
    if(!this.user.name || this.user.name == undefined){
      this.showMsg('请输入姓名','');
      return;
    }
    if(!this.user.mobile || this.user.mobile == undefined){
      this.showMsg('请输入手机号','');
      return;
    }
    if(this.user.mobile.toString().length < 11 || !this.mobilePattern.test(this.user.mobile)){
      this.showMsg('手机号格式有误','');
      return;
    }
    if(!mobileCaptcha || mobileCaptcha == undefined){
      this.showMsg('请输入短信验证码','');
      return;
    }
    if(!this.child.honor || this.child.honor == undefined){
      this.showMsg('请输入宝贝荣誉','');
      return;
    }
    if(this.child.age < 0 || this.child.age > 18){
      this.showMsg('请输入0-18的整数','');
      return;
    }
     if(this.child.honor.length > 15){
      this.showMsg('请输入15字以内','');
      return;
    }
    this.busy = true;
    this._usersService.setUsersInfo(this.user, this.child, mobileCaptcha,sex).subscribe(result => {
      if(!result || result.ret == -1){
        this.showMsg(result.msg,'');
      }
      this.isMask = true;
      this.showMsg('','发布成功');
      this.router.navigate(['/topic']);
      sessionStorage.setItem('hasChild', '1');
      setTimeout(() => { 
        this.busy = false;
      },1500);
      
    }, error => {
       setTimeout(() => { 
        this.busy = false;
       },1500);   
       this.showMsg(JSON.parse(error._body).msg,'');
    });
  }
 

}