import {
  Output,
  Component,
  OnDestroy,
  OnInit,
  AfterContentInit,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from 'src/app/_services/index';
import { MatButtonModule } from '@angular/material/button';
import { TidesService } from 'src/app/services/calculations.service';

@Component({
  selector: 'app-tide-input-basic',
  templateUrl: './tide-input-basic.component.html',
  styleUrls: ['./tide-input-basic.component.scss'],
})
export class TideInputBasicComponent implements OnInit {
  @Output() tideUpdated = new EventEmitter<string>(); //Maybe unecessary???? Or maybe newTideHeight updater method is unecessary?
  newTideHeight: string = '';
  newDateTime: number = 1612612330;
  hintLabelText: string = 'Enter a decimal value from -10.0 to 10.0';
  placeholderText: string = 'enter tide height';
  @Input() matDatepicker: Date | undefined;

  constructor(
    private messageService: MessageService,
    private tidesService: TidesService
  ) {}

  ngOnInit() {
    // subscribe to tideHeightObs Subject
    this.tidesService
      .getTideHeightObs()
      .subscribe((tideHeight) => (this.newTideHeight = tideHeight.toString()));
  }

  onTideUpdated(tideHeight: string) {
    // this.tideUpdated.emit(this.newTideHeight);
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
    this.messageService.sendMessage(this.newTideHeight);
  }

  clearMessages(): void {
    // clear messages
    this.messageService.clearMessages();
  }
}
