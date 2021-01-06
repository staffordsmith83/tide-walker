import { Component, OnDestroy, OnInit } from '@angular/core';
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

  message:string | any;
  subscription: Subscription | any;

  hintLabelText: string = "Enter a decimal value from -10.0 to 10.0";
  placeholderText: string = "enter tide height";
  userTideHeight = '0.0'; //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?

  constructor(private data: DataService) { }

  newTideHeight() {
    this.userTideHeight = this.userTideHeight;
    console.log(this.userTideHeight);
    this.data.changeMessage(this.userTideHeight);
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