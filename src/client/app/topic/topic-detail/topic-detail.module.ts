
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicDetailComponent } from './topic-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { TopicService, AsksService, UsersService } from '../../shared/service/index'


@NgModule({
  imports: [CommonModule],
  declarations: [TopicDetailComponent],
  exports: [TopicDetailComponent],
  providers: [TopicService, AsksService, UsersService]
})
export class TopicDetailModule { 
  
}