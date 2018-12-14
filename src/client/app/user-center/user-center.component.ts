import { Component } from '@angular/core';
import { UsersService } from '../shared/service/index';
import { User } from '../shared/models/index';

/**
 * This class represents the lazy loaded userCenterComponent.
 */
declare  var $:any;
@Component({
  moduleId: module.id,
  selector: 'sd-userCenter',
  templateUrl: 'user-center.component.html',
  styleUrls: ['user-center.component.css']
})

export class userCenterComponent {
  receivedCapital: number;
   /**
   * 构造器
   * @param {_usersService} UsersService - 依赖注入的服务，需要在model中providers中声明.
   */
  constructor(public _usersService: UsersService) {
    this.receivedCapital = 0;
  }
  
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this._usersService.getUserbonus().subscribe(result => {
      this.receivedCapital = result.receivedCapital;
    })
    $('.user-center').css('min-height', $(window).height() - 50);
  }
}
