import {
  Output,
  Component,
  OnDestroy,
  OnInit,
  EventEmitter,
} from '@angular/core';

import { MessageService } from 'src/app/_services/index';
import { TidesService } from 'src/app/services/tides.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss'],
})
export class TideInputBasicComponent implements OnInit, OnDestroy {
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  tideHeight: string = '';
  newDateTime: number = 1612612330;
  private tidesSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private tidesService: TidesService
  ) {}

  ngOnInit() {
    // subscribe to tideHeightObs Subject
    this.tidesService
      .getTideHeightObs()
      .subscribe((tideHeight) => (this.tideHeight = tideHeight.toString()));
  }

  onTideUpdated(tideHeight: string) {
    // ANOTHER APPROACH - could call this.tidesService.tideHeightObs$.next(+tideHeight)
    // This is because with Subjects you can call next from outside. What approach is better? This way I am keeping the actual Subject attribute of the TidesService private... Dunno.
    this.tidesService.setTideHeightObs(+tideHeight); // + operator casts the string to a number
  }

  resetDateTime() {
    this.newDateTime = 0;
  }

  calculateTide(dateTime: number): void {
    // Prompt the tides service to recalculate the global tideHeight variable
    this.tidesService.getHeightFromDateTime(dateTime);
  }

  sendMessage(): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(this.tideHeight);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  }

  ngOnDestroy() {
    this.tidesSubscription.unsubscribe();
  }
}
