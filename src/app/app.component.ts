import { Input, Output, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'Mapbox Application';
  tideHeight: string = '0.0';

  map: google.maps.Map | undefined; // important to declare the type of property map, so we can refer to it with this.map

  onNewTideReceived(userTideHeight: string) {
    this.tideHeight = userTideHeight;
    console.log(
      'New tide height received by App Component: ' + this.tideHeight
    );
  }
}
