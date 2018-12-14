import { Component, NgZone } from '@angular/core';
import { TopicService, AsksService, UsersService, AnswersService, WechatService } from '../shared/service/index';
import { Topic, Asks, User } from '../shared/models/index';


/**
 * This class represents the lazy loaded TopicComponent.
 */
declare  var $:any;
@Component({
  providers: [ WechatService ],
  moduleId: module.id,
  selector: 'sd-topic',
  templateUrl: 'topic.component.html',
  styleUrls: ['topic.component.css']
})
export class TopicComponent {
  topicId: number;
  /**
   * 构造器
   * @param {_topicService} TopicService - 依赖注入的服务，需要在model中providers中声明.
   * @param {_wechatService} WechatService - 依赖注入的服务，需要在model中providers中声明.
   */
  constructor(public _topicService: TopicService,
      public _wechatService: WechatService, private zone: NgZone) {
    this.topicId = 1;
    this.secondId[0] = 0;
    
  }
  ngOnInit(){
    this._topicService.login("test","dfasdf", "oBBBjsxZS6jg8eXXvjDM4eX273Z4").subscribe(result => {});
    this.configJsApi();
  }

  errorRelease: number = 1;
  //语音发布
  release(content: string, uploadVoices: string){
    this._topicService.release(content, uploadVoices).subscribe(result => {
      this.showMask = true;
    }, error => {
       this.errorRelease = -1;
       this.errorMessage = '语音发布失败~';
       this.isToast = true;
        setInterval(() => { 
          this.isToast = false;
          this.errorMessage = '';
        },3000);
    })
  }


  // 发布成功蒙层
  showMask = false;
  isToast = false;
  showBtn = false;
  num: number;
  errorMessage: string;
  record_num(num: number){
    if(num <= this.index/2) {
      this.num = num;
      this.recordT = this.secondId[this.num];
      $('.progress'+num).siblings().removeClass('recording');
      $('.progress'+num).addClass('recording');
    }else {
      return;
    }
    
  }
  recorded = false;
  audition = false;
  step: number;
  angle: number;
  recordT: number;
  uploadedNum:number = 0; //已上传个数
  uploadVoiceCs:uploadVoiceC[] = [];


  
  // 切换试听、重录、发布按钮样式
  gotoRelease(className: any){
    $(className).addClass('active');
    $(className).siblings().removeClass('active');
    if (className == '.release') {  //发布
      if(this.Char_val != ''){
        let next:uploadVoiceC;
        this.uploadVoiceCs.forEach(u => {
          if(u.no ==  1){
            next = u;
          }
        })
        this.doUploadVoiceC(next);
        
      }else {
        this.isToast = true;
        this.errorMessage = '您还未填写文字内容介绍哦~';
        setInterval(() => { 
          this.isToast = false;
          this.errorMessage = '';
        },3000);
      }
    }else if(className == '.audition') {  //  试听
      this.audition = true;
      this.angle = 0;
      this.zone.run(() => {
        this.num = this.num ? this.num :this.index/2;
      })
      this.step = this.secondId[this.num-1];
      $('.progress'+this.num).addClass('recording');
      $('.progress'+this.num).text('试听中');
      $('.trigger').addClass('trigger_stop');
      this.timerId = setInterval(() => { 
        this.scaleCircle(this.angle); 
        this.showBtn = false; 
        this.step++;
        this.angle++;
        this.zone.run(() => {
          if(this.step >= this.secondId[this.num]){
            this.initRecord(this.num);
            this.audition = false;
          }
        })
      }, 100);
      alert('试听第'+ this.num +'段');
      this.zone.run(() => {
        wx.playVoice({localId: this.localId[this.num]});// 需要播放的音频的本地ID，由stopRecord接口获得
      })
    }else if(className == '.recorded') {    //重录
      this.recorded = true;
      this.num = this.num ? this.num : this.index/2;
      alert('重录第'+ this.num +'段');
      
      this.startRecord(this.num);
      this.index -= 1;
    }
  }

  //语音上传
  private doUploadVoiceC(uploadVoiceC: uploadVoiceC){
    wx.uploadVoice({
      localId: uploadVoiceC.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: res => this.zone.run(() => {
        this.serverId[uploadVoiceC.no] = res.serverId; // 返回音频的服务器端ID
        // alert(res.serverId);
        alert(this.serverId[uploadVoiceC.no]);
        this.uploadedNum ++;
        this.uploadVoiceCs.forEach(u => {
          if(u.localId == this.localId[uploadVoiceC.no]){
            u.serverId = res.serverId;
          }
        })

        if(this.uploadedNum == this.localId.length - 1){
          alert('开始要上传服务器啦');
          // console.log(this.uploadVoiceCs);
          let uploadVoices = JSON.stringify(this.uploadVoiceCs);
          this.release(this.Char_val, uploadVoices); //发布语言
          // if(this.errorRelease == -1){
          //   this.errorMessage = '语音发布失败~';
          // }else {
          //   this.showMask = true;
          // }
        } else {
          let next:uploadVoiceC;
          this.uploadVoiceCs.forEach(u => {
            if(u.no == uploadVoiceC.no + 1){
              next = u;
            }
          })

          this.doUploadVoiceC(next);
        }
      })
    })
  }

  // index 奇数：暂停 偶数：录音
  index = 0;
  second = 0;
  timerId : any;
  // 开始录音
  record_srart(){
    if(this.index <10){
      if(this.index%2 == 0){
        if(this.num){   //点击每段录音 后继续录音 移除 试听样式 
          $('.progress'+this.num).removeClass('recording');
        }
        if(this.step && !this.audition){  //试听自动暂停
          this.step = null;
          this.startRecord(this.index/2+1);
        }else if(this.step && this.audition){ //  试听手动暂停
          this.initRecord(this.audition? this.num: this.index/2);
          this.index--;
        }else {   //正常继续录音
          this.startRecord(this.index/2+1);
        }
        
      }else {
        //重录暂停
        this.secondId[this.recorded? this.num:(this.index+1)/2] = this.totalSecond;
        if(this.recorded && this.secondId[this.num] > this.rerecordTime){
          for(var i=this.num; i<= 5; i++){
            if(this.secondId[i+1]){
              this.secondId[i+1] += (this.secondId[this.num] - this.rerecordTime); 
            }
          }
          this.totalSecond = (Math.max.apply(null, this.secondId));//最大值
          
        }
        this.initRecord(this.recorded? this.num:(this.index+1)/2);
      }
      this.zone.run(() => {
        this.index ++;
      })
    }
  }
  localId: Array<any> = [];
  serverId: Array<any> = [];
  secondId: Array<any> = [];    //每一段录音时长 叠加的 包括上一段时间
  totalSecond: number = 0;  //总时长 累加的
  rerecordTime: number;   //重录段的原来时长
  //录音状态
  startRecord(num: number){
    // 在这里调用微信相关功能的 API
    wx.startRecord();
    if(this.recorded){  //点击重录
      this.totalSecond = this.secondId[this.num-1];
      this.rerecordTime = this.secondId[this.num];
      this.recordT = 0; //暂停置0
    }
    this.showBtn = false;
    this.second = 0; //暂停置0
    
    $('.trigger').addClass('trigger_stop');
    $('.progress'+num).addClass('recording');
    $('.progress'+num).text('录音中');
    this.timerId = setInterval(() => { 
      this.scaleCircle(this.second); 
      this.second++;
      this.recordT++;
      this.totalSecond ++;
      if(this.second%60 == 0){
        
        this.secondId[this.num ? this.num :num] = this.totalSecond;
        if(this.recorded && this.secondId[this.num ? this.num :num] > this.rerecordTime){
          for(var i=num; i<= 5; i++){
            if(this.secondId[i+1]){
              this.secondId[i+1] += (this.secondId[this.num ? this.num :num] - this.rerecordTime); 
            }
          }
          this.totalSecond = (Math.max.apply(null, this.secondId));//最大值
          
        }
        this.initRecord(this.num ? this.num :num);
        this.index ++;
      }
    }, 1000);
    // wx.onVoiceRecordEnd({
    //   // 录音时间超过一分钟没有停止的时候会执行 complete 回调
    //   complete: function (res) {
    //       alert(111111);
    //       // this.localId[num] = res.localId; 
    //       this.initRecord(this.num ? this.num :num);
    //       this.index ++;
    //   }
    // });
  }
  // 暂停录音状态
  initRecord(num: number){
    wx.stopRecord({
      success: (res) => this.zone.run(() => {
        this.localId[num] = res.localId;
        let uploadVoice = new uploadVoiceC();
        uploadVoice.no = num;
        uploadVoice.localId = res.localId;
        uploadVoice.duration = this.secondId[num] - this.secondId[num-1];
        this.uploadVoiceCs.push(uploadVoice);
      })
    })
    
    clearInterval(this.timerId);
    this.showBtn = true;
    this.num = null;
    // this.step = null;
    this.recorded = false;
    this.audition = false;
    $('.trigger').removeClass('trigger_stop').addClass('trigger');  //切换到暂停按钮
    $('.progress'+num).removeClass('recording').addClass('finish');   //  进度条背景色 变为深蓝色
    $('.progress'+num).text('录音'+num);    //文字 变为录音中
  }

  //记录textarea
  Char_length = 0;
  countChar(){
    this.Char_length = $('.textarea').val().length; 
  }

  txtCont = true;
  //保存介绍内容
  Char_val = '';
  saveVal(){
    this.Char_val = $('.textarea').val();
    if(this.Char_val){
      this.txtCont = false;
    }else {
      return;
    }
    
  }
  // 编辑内容
  editVal(){
    this.txtCont = true;
  }

  // 环形进度条
  scaleCircle(second: any){ 
    var rightcircle = document.getElementById('rightcircle');
    var leftcircle = document.getElementById('leftcircle');
    if(second<=30){
        rightcircle.style.cssText = "-webkit-transform: rotate("+ (-135+6*(second+1)) +"deg); -moz-transform: rotate("+ (-135+6*(second+1)) +"deg); -o-transform: rotate("+ (-135+6*(second+1)) +"deg); transform: rotate("+ (-135+6*(second+1)) +"deg)";
        leftcircle.style.cssText = "transform: rotate(-135deg)";
    }else{
        rightcircle.style.cssText = "-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg);";
        leftcircle.style.cssText = "-webkit-transform: rotate("+ (-135+6*((second+1)-30)) +"deg); -moz-transform: rotate("+ (-135+6*((second+1)-30)) +"deg); -o-transform: rotate("+ (-135+6*((second+1)-30)) +"deg); transform: rotate("+ (-135+6*((second+1)-30)) +"deg);";
    }
  }

  /**
   * 配置api
   */
  configJsApi() {
    this._wechatService.apiConfig();
  }



}

export class uploadVoiceC {
  public no:number;
  public localId:string;
  public serverId:string;
  public duration:number;
}
