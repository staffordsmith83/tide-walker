import { Output, Component, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { FileDetector } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss']
})
export class TideInputBasicComponent {
  //set the custom event
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  newTideHeight = '';
  

  hintLabelText: string = "Enter a decimal value from -10.0 to 10.0";
  placeholderText: string = "enter tide height";
  

  constructor(private data: DataService) { }

  onTideUpdated() {
    this.tideUpdated.emit(this.newTideHeight);
  }

  // ngOnInit() {
  //   this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
  // }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

  // newMessage() {
  //   this.data.changeMessage("Hello from Sibling")
  // }
}