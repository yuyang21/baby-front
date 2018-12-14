import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule }   from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { HomeModule } from './home/home.module';
//话题
import { TopicModule } from './topic/topic.module';
import { TopicDetailModule } from './topic/topic-detail/topic-detail.module';
import { AwardModule } from './topic/award/award.module';
import { AnswerModule } from './topic/answer/answer.module';
// footer
import { SharedModule } from './shared/shared.module';
// 个人中心
import { userCenterModule } from './user-center/user-center.module';
import { InfoModule } from './user-center/info/info.module';
@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, userCenterModule, HomeModule, InfoModule, TopicModule, TopicDetailModule, AwardModule, AnswerModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
