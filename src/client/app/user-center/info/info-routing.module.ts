import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InfoComponent } from './info.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'info', component: InfoComponent }
    ])
  ],
  exports: [RouterModule]
})
export class infoRoutingModule { }