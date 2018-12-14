import {Component, NgZone} from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TopicService, AsksService, UsersService, AnswersService, WechatService } from '../../shared/service/index';
import { Topic, Asks, User, Tape } from '../../shared/models/index';
import { Config } from '../../shared/config/env.config';


/**
 * This class represents the info component.
 */
declare  var $:any;
@Component({
  providers: [ WechatService ],
  moduleId: module.id,
  selector: 'sd-topic-detail',
  templateUrl: 'topic-detail.component.html',
  styleUrls: ['topic-detail.component.css','../topic.component.css'],
})

 export class TopicDetailComponent {
   errorMessage: string ;  //错误信息
   succeedMsg: string = '';   //成功提示
   Topic: Topic;    //话题
   question: string;    //问题
   topicId:number;    //话题ID
   topic_userId:number;    //话题者ID
   userId:number;    //用户ID
   rewardAmount:number;   //赏金
   requestNo:number;    //流水号
   Topic_content:string;  //话题者文字内容
   isMask: boolean;     //成功提示蒙层控制
   isToast: boolean;
   page: number;
   pageSize: number;
   AnswersList: any;
   params: string;
   user:any;
   answerId: number;
   issupportRecords1: any;
   issupportRecords2: any;
   issupportRecords3: any;
   allTapes: any;
   tape1:string;
   tape: Tape; // 话题录音
   busy:boolean = false;
   audio:any;


   /**
   * 构造器
   * @param {_topicService} TopicService - 依赖注入的服务，需要在model中providers中声明.
   * @param {_asksService} AsksService - 依赖注入的服务，需要在model中providers中声明.
   * @param {_usersService} UsersService - 依赖注入的服务，需要在model中providers中声明.
   * @param {_answersService} AnswersService - 依赖注入的服务，需要在model中providers中声明.
   */
  constructor(private route: ActivatedRoute, private router: Router , 
      public _topicService: TopicService, public _asksService: AsksService, 
      public _usersService: UsersService, public _answersService: AnswersService,
      public _wechatService: WechatService, private zone: NgZone) {
    this.rewardAmount = 1;
    this.requestNo = 1;
    this.page = 1;
    this.pageSize = 3;
    
  }
  

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    // this._topicService.login("test","dfasdf", "oBBBjsxZS6jg8eXXvjDM4eX273Z4").subscribe(result => {});
    //通过路由获取topicId
    this.route.params.subscribe(params => {
        this.topicId = params['topicId'];
    });

    
    
    this.getTopicsContent(this.topicId); //获取话题内容
    this.getTape(this.topicId);  //获取话题的所有语音

    this.answersList(this.topicId, 1, 1, this.page, this.pageSize);   //获取话题回答列表
    this.configJsApi();

    // wx.ready(() => {
    //   this.zone.run(() =>{
    //     this.audio = new Audio();
    //   })
    // })
    
  }

  //语音播放开始动画 index 偶数 播放 奇数 暂停
  index = 0;
  timerId: any;
  

  isAudioPlaying:boolean = false;
  //播放自我介绍语言
  playInfor(event:any){
    if(!this.isAudioPlaying){
      this.isAudioPlaying = true;
      this.startAnimation(event);
      this.audio.play();
    } else {
      this.isAudioPlaying = false;
      this.stopAnimation(event);
      this.audio.pause();
    }

 
    // if(this.audio.paused){ 
    //   this.audio.play(); //使用play pause方法 要将进去对象转成DOM
    //   this.startAnimation(event);
    //   setTimeout(() => this.zone.run(() => {
    //     this.stopAnimation(event);
    //   }),this.tape? this.tape.duration : 1000)
    // } else { 
    //   this.audio.pause();
    //   this.stopAnimation(event);
    // } 

  }

  //播放、停止音频动画
  public startAnimation(event:any){
    let target = event.target || event.srcElement || event.currentTarget; 
    let classNa = $(target).context.classList[0];
    if(classNa == 'large'||classNa == 'middle'|| classNa=='small'){
      $(target).addClass('startAnimat3');
      $(target).siblings('.middle').addClass('startAnimat2');
    }else{
      $(target).find('.large').addClass('startAnimat3');    
      $(target).find('.middle').addClass('startAnimat2');
    }
    
  }

  public stopAnimation(event:any){
    let target = event.target || event.srcElement || event.currentTarget; 
    let classNa = $(target).context.classList[0];
    if(classNa == 'large'||classNa == 'middle'|| classNa=='small'){
      $(target).removeClass('startAnimat3');
      $(target).siblings('.middle').removeClass('startAnimat2');
    }else{
      $(target).find('.large').removeClass('startAnimat3');    
      $(target).find('.middle').removeClass('startAnimat2');
    }
  }
  
  //播放回答语音
  playPause(index:number,event:any,duration:any){
    let target = event.target || event.srcElement || event.currentTarget;
    let music = $(target).siblings('audio');
    alert(music[0].paused);
    if(music[0].paused){ 
        music[0].play(); //使用play pause方法 要将进去对象转成DOM
        this.startAnimation(event);
        
        setTimeout(() => this.zone.run(() => {
          this.stopAnimation(event);
        }),duration*1000 || 1000)
    }else{ 
        music[0].pause(); 
        this.stopAnimation(event);
    } 
    
  }
 
  //跳转到回答页
  toAnswer(ask:Asks){
    this.router.navigate(['/topic/' + this.topicId + '/ask/' +  ask.id + '/' + ask.userId + '/answer']);
  }

  //话题的点赞、赏
  topicPraise(){
    if(this.busy){
      return;
    }
    this._topicService.getPraise(this.topicId).subscribe(result => {
      this.succeedMsg = '已赞';
      this.showMsg(this.errorMessage, this.succeedMsg);
      this.changeBusy();
    }, error => {
       this.errorMessage = '您已经赞过了';
       this.showMsg(this.errorMessage, this.succeedMsg);
       this.changeBusy();
    })
  }
  

  /**
   * 跳转去赏
   */
  topicAward(){
    this.router.navigate(['/topic/' + this.topicId + '/award']);
  }

  //回答的点赞、赏
  answerPraise(answerId: number){
    if(this.busy){
      return;
    }
    this.busy = true;
    this._answersService.getAnswerPraise(answerId).subscribe(result => {
      this.succeedMsg = '已赞';
      this.showMsg(this.errorMessage, this.succeedMsg);
      this.changeBusy();
    }, error => {
       this.errorMessage = '您已经赞过了';
       this.showMsg(this.errorMessage, this.succeedMsg);
       this.changeBusy();
    })
  }
  answerAward(answerId: number){
    if(this.busy){
      return;
    }
    this.busy = true;
    this._answersService.getAnswerAward(answerId, this.rewardAmount, this.requestNo).subscribe(result => {
     this.succeedMsg = '已赏';
      this.showMsg(this.errorMessage, this.succeedMsg);
      this.changeBusy();
    }, error => {
       this.errorMessage = '您已经赏过了';
       this.showMsg(this.errorMessage, this.succeedMsg);
       this.changeBusy();
    })
  }
  

  public changeBusy(){
    setTimeout(() => { 
      this.busy = false;
    },3000);
  }
    
  //提问
  goToAsk(){
    var question = $('.textarea').val();
    if(!question){
      return;
    }else {
      this.ask_question(this.topicId, question);
      this.succeedMsg = '提问成功';
      this.isMask = true;
      $('.textarea').val('');
      this.countChar();
      setInterval(() => { 
        this.isMask = false;
        this.succeedMsg = '';
      },3000);
    }
  }

  //记录textarea
  Char_length = 0;
  countChar(){
    this.Char_length = $('.textarea').val().length; 
  }

  /**
   * 话题详情
   */
  portraitUrl: string;
  public getTopicsContent(topicId:number) {
    this._topicService.getTopicsDetail(topicId).subscribe(result => {
      this.Topic = result;
      this.Topic_content = result.content;
      this.topic_userId = result.userId; 
      if(this.topic_userId){
        this.getUsersInfor(this.topic_userId);   //获取话题录音者/问答者用户信息
      } 
    });
  }

  //提示显示公用方法
  showMsg(errorMessage: string, succeedMsg: string){
    if(errorMessage){
      this.isToast = true;
      this.errorMessage = errorMessage;
    }else {
      this.succeedMsg = succeedMsg;
      this.isMask = true;
    } 
    setInterval(() => { 
      this.isToast = false;
      this.isMask = false;
      this.errorMessage = '';
      this.succeedMsg = '';
    },3000);
  }


  /**
   * 话题的所有语音
   */
  public getTape(topicId:number){
    this._topicService.getTape(topicId).subscribe(result => {
      this.tape = result;
      if(result){
        this.tape.durationMin = Math.floor(this.tape.duration / 60);
      }
     
     this.audio =  document.createElement('audio');
     this.audio.src = Config.FILE_PATH + this.tape.path + '?t=' + new Date().getTime();
     this.audio.load();
    });
  }
  
  /**
   * 话题录音者/问答者用户信息
   */
  public getUsersInfor(topic_userId: number){
    this._usersService.getUsersInfor(topic_userId).subscribe(result => {
        this.userId = result.id;
        this.user = result;
        this.portraitUrl = result.portraitUrl;
    })
  }

  /**
   * 提问
   */
  public ask_question(topicId: number, question: string){
    this._asksService.ask_question(topicId, question).subscribe(result => {

    })
  }

  /**
   * 话题问答分页查询
   */
  public answersList(topicId: number, askStatus: number, answerStatus: number, page: number, pageSize: number){
    this._answersService.answersList(topicId, askStatus, answerStatus, page, pageSize).subscribe(result => {
      this.AnswersList = result.data;
      if(result.index != 0){
        //话题详情页，获取登录用户对答的听赞赏记录 type 1：听 2： 赞 3：赏
        this._topicService.supportRecords(this.topicId, 1).subscribe(result => {
          this.issupportRecords1 = result;
        })
        this._topicService.supportRecords(this.topicId, 2).subscribe(result => {
          this.issupportRecords2 = result;
        })
        this._topicService.supportRecords(this.topicId, 3).subscribe(result => {
          this.issupportRecords3 = result;
        })
      }
    })
  }

  /**
   * 配置api
   */
  configJsApi() {
    this._wechatService.apiConfig();
  }



  


}
