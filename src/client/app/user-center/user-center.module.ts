import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userCenterComponent } from './user-center.component';
import { userCenterRoutingModule } from './user-center-routing.module';



@NgModule({
  imports: [CommonModule, userCenterRoutingModule],
  declarations: [userCenterComponent],
  exports: [userCenterComponent]
})
export class userCenterModule { }
