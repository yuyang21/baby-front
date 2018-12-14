

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerComponent } from './answer.component';
import { SharedModule } from '../../shared/shared.module';
import { AsksService, UsersService, AnswersService } from '../../shared/service/index'


@NgModule({
  imports: [CommonModule],
  declarations: [AnswerComponent],
  exports: [AnswerComponent],
  providers: [ AsksService, UsersService, AnswersService]
})
export class AnswerModule { 
  
}