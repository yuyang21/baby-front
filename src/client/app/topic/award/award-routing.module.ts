
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AwardComponent } from './award.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'award', component: AwardComponent }
    ])
  ],
  exports: [RouterModule]
})
export class awardRoutingModule { }