import {
  Output,
  Component,
  OnDestroy,
  OnInit,
  AfterContentInit,
  EventEmitter,
  Input,
} from '@angular/core';
import { FileDetector } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from 'src/app/_services/index';
import { MatButtonModule } from '@angular/material/button';
import { CalculationsService } from 'src/app/services/calculations.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss'],
})
export class TideInputBasicComponent implements OnInit {
  //set the custom event
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  newTideHeight = '';
  newDateTime: number = 1612612330;
  hintLabelText: string = 'Enter a decimal value from -10.0 to 10.0';
  placeholderText: string = 'enter tide height';
  @Input() matDatepicker: Date | undefined;

  constructor(
    private messageService: MessageService,
    private CalculationsService: CalculationsService
  ) {}

  onTideUpdated() {
    this.tideUpdated.emit(this.newTideHeight);
  }

  ngOnInit() {}

  calculateTide(dateTime: number ): void {
    console.log("Sending Epoch Time to Calculations Service: " + dateTime);    
    let tideCalculated = this.CalculationsService.getHeightFromDateTime(
      dateTime
    );
    // PROBLEM: Service gets the return value before the call has been finished in the service...
    // How can I make this calling component wait for the response from the Service before it shows the value?
    
    console.log("Received from Service: " + tideCalculated);
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(this.newTideHeight);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
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
