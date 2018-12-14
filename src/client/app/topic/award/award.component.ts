import { Component } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { RouterModule, ActivatedRoute, RouterState, Router } from '@angular/router';


/**
 * This class represents the info component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-award',
  templateUrl: 'award.component.html',
  styleUrls: ['award.component.css','../../user-center/info/info.component.css'],
})

export class AwardComponent  {

  public topicId:number;

  constructor(private route: ActivatedRoute){
    this.route.params.subscribe(params => {
        this.topicId = params['topicId'];
    });
  }

}