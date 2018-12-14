import {Component, OnInit, NgZone} from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule, ActivatedRoute, RouterState, Router } from '@angular/router';
import { TopicService, AsksService, UsersService, AnswersService, WechatService } from '../../shared/service/index';
import {Asks,User, Answer} from '../../shared/models/index';


/**
 * This class represents the answer component.
 */
declare  var $:any;
@Component({
  providers: [WechatService],
  moduleId: module.id,
  selector: 'sd-answer',
  templateUrl: 'answer.component.html',
  styleUrls: ['answer.component.css','../topic.component.css', '../topic-detail/topic-detail.component.css'],
})

 export class AnswerComponent implements OnInit {
   succeedMsg: string = '';   //成功提示
   question: string;    //问题
   question_name: string;   //提问者姓名
   askId:number;    //问题ID
   userId:number; 
   user: User;   //用户ID
   Topic_duration:any; //话题总时长
   duration_minute:any; //话题总时长
   isMask: boolean;     //成功提示蒙层控制
   isToast: boolean;
   AnswersList: any;
   ask_userId: number; //提问者userId
   portraitUrl:string;
   topicId:number;


   /**
 * 构造器
 * @param {_asksService} AsksService - 依赖注入的服务，需要在model中providers中声明.
 * @param {_usersService} UsersService - 依赖注入的服务，需要在model中providers中声明.                                                                                                                                                                                                                                        
 */
 constructor(private route: ActivatedRoute,public _asksService: AsksService, 
    public _topicService: TopicService, public _usersService: UsersService,
    public _answersService: AnswersService, private _wechatService:WechatService,
    private ngZone:NgZone, private router: Router) {
     this._topicService.login("test","dfasdf", "oBBBjsxZS6jg8eXXvjDM4eX273Z4").subscribe(result => {});
    //通过路由获取askId
    this.route.params.subscribe(params => {
        this.askId = params['askId'];
        this.ask_userId = params['userId'];
        this.topicId = params['topicId'];
    });

    if(sessionStorage.getItem('isLogged') == '1'){
      _wechatService.apiConfig();
    } else {

    }

  }


   /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getTopicQuestion(this.askId);
    this.getAskUsersInfor(this.ask_userId);
  }

  /**
   * 问题
   */
  getTopicQuestion(askId:number) {
    this._asksService.getAnswerQuestion(askId).subscribe(result => {
      this.question = result.question; 
    });
  }
  /**
   * 提问者信息
   */
  getAskUsersInfor(userId:number) {
    this._usersService.getUsersInfor(userId).subscribe(result => {
      this.question_name = result.nickName;
      this.portraitUrl = result.portraitUrl;
    });
  }

  // 停止录音状态
  initRecord(){
    $('.trigger').removeClass('trigger_stop').addClass('trigger');  //切换到暂停按钮
  }
  // 环形进度条
  scaleCircle(){ 
    var rightcircle = document.getElementById('circle_r');
    var leftcircle = document.getElementById('circle_l');
    if(this.second<=30){
        rightcircle.style.cssText = "-webkit-transform: rotate("+ (-135+6*this.second) +"deg); -moz-transform: rotate("+ (-135+6*this.second) +"deg); -o-transform: rotate("+ (-135+6*this.second) +"deg); transform: rotate("+ (-135+6*this.second) +"deg)";
        leftcircle.style.cssText = "transform: rotate(-135deg)";
    }else{
        rightcircle.style.cssText = "-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg);";
        leftcircle.style.cssText = "-webkit-transform: rotate("+ (-135+6*(this.second-30)) +"deg); -moz-transform: rotate("+ (-135+6*(this.second-30)) +"deg); -o-transform: rotate("+ (-135+6*(this.second-30)) +"deg); transform: rotate("+ (-135+6*(this.second-30)) +"deg);";
    }
  }
  // 发布成功蒙层
  showMask = false;
  
  // 切换试听、重录、发布按钮样式
  release(className: any){
    // var showMask = false;
    $(className).addClass('active');
    $(className).siblings().removeClass('active');
  }
  // index 奇数：暂停 偶数：录音
  
  index = 0;
  timerId : any;
  localId:string;
  isRecording:boolean = false;
  second = 0;
  showMenu = false; // 操作按钮显示
  /**
   * 开始录音或者停止录音或者重录
   */
  public record_srart(){
    this.index++;
    if(this.index > 2){
      return;
    }
    if(!this.isRecording){
      this.second = 0;
      this.showMenu = false;
      wx.startRecord();
      this.isRecording = true;
      $('.trigger').addClass('trigger_stop');
      this.timerId = setInterval(() => { 
        this.scaleCircle(); 
        this.second++;
        if(this.second > 60){
          this.showMenu = true;
          clearInterval(this.timerId);
          this.initRecord();
        }
      }, 1000);
    } else {  // 暂停录音
      this.isRecording = false;
      this.index = 3;
      wx.stopRecord({
        success: (res) => this.ngZone.run(() =>{
          this.localId = res.localId;
          this.showMenu = true;
          this.initRecord();
          clearInterval(this.timerId);
        })
      });
    } 
  }


  /**
   * 试听
   */
  public listen(){
    alert(this.localId);
    wx.playVoice({
      localId: this.localId
    })
    this.release('.audition');
  }

  mediaId:string;
  /**
   * 回答发布
   */
  answer(){
    this.release('.release');

    wx.uploadVoice({
      localId: this.localId,
      success: (res) => this.ngZone.run(() => {
        this.mediaId = res.serverId;
        this._answersService.setTapes(this.askId, this.mediaId, this.second).subscribe(result => {
          if(result && result.ret !== -1) {
            this.showMask = true;
          }
        });
      })
    })


  }
  /**
   * 语音重录
   */
  recorded(){
    this.index = 0;
    this.release('.recorded');
    this.second = 0;
    this.record_srart();
  }
  /** 
   * 发布成功关闭弹窗
   * 
   */
  public close(){
    this.showMask = false;
    this.router.navigate(['/topic/detail/'+this.topicId]);
  }
}