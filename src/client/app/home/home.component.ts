import { Component, OnInit } from '@angular/core';
import { RouterModule, Params,  ActivatedRoute, RouterState, Router} from '@angular/router';
import { TopicService } from '../shared/service/index'
import { PagingData, TopicInfo } from '../shared/models/index';
declare  var $:any;
import  '../../scripts/swipeSlide';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  // private router: Router;
  errorMessage: string = 'cuowu';
  pagingData: PagingData<TopicInfo>;
  topicInfos: TopicInfo[];
  page:number;
  pageSize:number;
  
  /**
   * 构造器
   * @param {_topicService} TopicService - 依赖注入的服务，需要在model中providers中声明.
   */
  constructor(public _topicService: TopicService, private route: ActivatedRoute, private router: Router,) {
    this.page = 1;
    this.pageSize = 5;
  }
  

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getTopics(this.page, this.pageSize);

    $('.slide').swipeSlide({
      continuousScroll:true,
      speed : 3000,
      transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
      firstCallback : function(i:any,sum:any,me:any){
          me.find('.dot').children().first().addClass('cur');
      },
      callback : function(i:any,sum:any,me:any){
          me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
      }
    });
  }


  getTopics(page:number, pageSize:number) {
    this._topicService.getAll(page, pageSize).subscribe(result => {
      this.pagingData = result;
      this.topicInfos = result.data;
    });
  }
  // 跳转页面
  href(url:string){
    this.router.navigate([url]);
  }

}

