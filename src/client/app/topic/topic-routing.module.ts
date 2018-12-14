import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicComponent } from './topic.component';
import { TopicDetailComponent } from './topic-detail/topic-detail.component';
import { AnswerComponent } from './answer/answer.component';
import { AwardComponent } from './award/award.component';

const topicsRoutes: Routes = [
  { path: 'topic', component: TopicComponent },
  { path: 'topic/detail/:topicId', component: TopicDetailComponent },
  { path: 'topic/:topicId/award', component: AwardComponent },
  { path: 'topic/:topicId/ask/:askId/:userId/answer', component: AnswerComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(topicsRoutes)
  ],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
