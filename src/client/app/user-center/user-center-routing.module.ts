import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { userCenterComponent } from './user-center.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'user-center', component: userCenterComponent },
      { path: 'user-center/info', component: InfoComponent }
    ])
  ],
  exports: [RouterModule]
})
export class userCenterRoutingModule { }
