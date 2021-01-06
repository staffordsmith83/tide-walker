import { Component, OnInit } from '@angular/core';
import { FileDetector } from 'protractor';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss']
})
export class TideInputBasicComponent implements OnInit {

  hintLabelText: string = "Enter a decimal value from -10.0 to 10.0";
  placeholderText: string = "enter tide height";
  userTideHeight = 0.0;

  constructor() { }

  ngOnInit(): void {
  }

  // onUserInput() {
  //   this.userTideHeight = mat-form-FileDetector.input;
  // }

}
