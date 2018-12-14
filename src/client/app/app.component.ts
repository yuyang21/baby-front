import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Config } from './shared/config/env.config';
import { HomeComponent } from './home/home.component';
import { userCenterComponent } from './user-center/user-center.component';
import { TopicComponent } from './topic/topic.component';
import { AuthService } from './shared/service/index'
import { BrowserUtils } from './shared/utils/browser-utils.utils'
import './operators';

/**
 * This class represents the main application component.
 */
@Component({
  providers: [AuthService, BrowserUtils],
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
})

export class AppComponent { 

  constructor(private router: Router, private authService: AuthService, private browserUtils: BrowserUtils){

    /**
     * 监控路由变化
     * 1. 是否在微信中
     * 2. 在微信中是否登陆，若未登录则跳转到授权页登陆
     */
    router.events.subscribe((event) => {
      
      if(event instanceof NavigationStart){
        authService.checkLogin(event);
      } 
   
    })

  }


}

