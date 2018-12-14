

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { awardRoutingModule } from './award-routing.module';
import { AwardComponent } from './award.component';


@NgModule({
  imports: [CommonModule, awardRoutingModule],
  declarations: [AwardComponent],
  exports: [AwardComponent]
})
export class AwardModule { 
  
}