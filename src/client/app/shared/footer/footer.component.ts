import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute, RouterState, Router } from '@angular/router';
import { UsersService } from '../../shared/service/index';
import { User } from '../../shared/models/index';

/**
 * This class represents the toolbar component.
 */
declare  var $:any;
@Component({
  moduleId: module.id,
  selector: 'sd-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent { 
    whichFooter: number;
    /**
    * 构造器
    * @param {_usersService} UsersService - 依赖注入的服务，需要在model中providers中声明.
    */
    
    constructor(private router: Router, public _usersService: UsersService ){

    }
    showFooter(index:number){
      this.whichFooter = index;
    }
    ngOnInit() {
      let hasChild:string = sessionStorage.getItem('hasChild');
      this.router.events.subscribe(() => {
        if(window.location.href.split('/')[3] == ''){
          this.whichFooter = 1;
        }else if(window.location.href.split('/')[3] == 'topic' || window.location.href.split('/')[4] == 'info' && hasChild !== '1'){
          this.whichFooter = 2;
        }else if(window.location.href.split('/')[3] == 'user-center' || window.location.href.split('/')[4] !== 'info') {
          this.whichFooter = 3;
        }
      });
    }

    //跳转到 说 / 信息录入页面
    gotoTopic(){
      let hasChild:string = sessionStorage.getItem('hasChild');

      if(hasChild === '1') {
        this.router.navigate(['/topic']);
        
      } else {
        this.router.navigate(['/user-center/info']);
      }
    }
    
}
