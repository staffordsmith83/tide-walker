import {
  Output,
  Component,
  OnDestroy,
  OnInit,
  AfterContentInit,
  EventEmitter,
} from '@angular/core';
import { FileDetector } from 'protractor';
import { DataService } from 'src/app/services/data.service';
import { Subscription, Observable, Observer } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from 'src/app/_services/index';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss'],
})
export class TideInputBasicComponent implements OnInit {
  //set the custom event
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  newTideHeight = '';

  hintLabelText: string = 'Enter a decimal value from -10.0 to 10.0';
  placeholderText: string = 'enter tide height';


  constructor(private messageService: MessageService) { }

  onTideUpdated() {
    this.tideUpdated.emit(this.newTideHeight);
  }

  ngOnInit() {
    // Create observable
    const tideHeight = new Observable<number>(getTideHeightFromDateTime);

    // Execute the Observable and print the
    // result of each notification
    // next() is a call to countOnetoTen method
    // to get the next value from the observable
    tideHeight.subscribe({
      next(num) {
        console.log(num);
      },
    });
    
    // This function runs when subscribe()
    // is called
    function getTideHeightFromDateTime(observer: Observer<number>) {
      [-4, -3, -2, 1, 0, 1, 2, 3, 4].forEach((tide, i) => {
        setTimeout(() => {
          observer.next(tide);
        }, i * 1000);
      });



      // // Unsubscribe after completing
      // // the sequence
      // return { unsubscribe() {} };
    }
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
