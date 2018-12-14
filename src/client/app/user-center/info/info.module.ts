import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { infoRoutingModule } from './info-routing.module';
import { InfoComponent } from './info.component';
import { FormsModule }   from '@angular/forms';

// import { infoRoutingModule} from './info/info-routing.module';


@NgModule({
  imports: [CommonModule, infoRoutingModule, FormsModule],
  declarations: [InfoComponent],
  exports: [InfoComponent]
})
export class InfoModule { 
  
}