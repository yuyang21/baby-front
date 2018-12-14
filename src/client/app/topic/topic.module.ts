import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicComponent } from './topic.component';
import { TopicRoutingModule } from './topic-routing.module';

@NgModule({
  imports: [CommonModule, TopicRoutingModule],
  declarations: [TopicComponent],
  exports: [TopicComponent]
})
export class TopicModule { }
