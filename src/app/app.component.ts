import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component } from '@angular/core';
import { Farm } from './models/Farm';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'Mapbox Application';

  map: google.maps.Map | undefined; // important to declare the type of property map, so we can refer to it with this.map

  farms: Farm[] = [];
  
  // When farms changes, update the self.farms property
  onFarmsChanged(importedFarms: Farm[]) {
    this.farms = importedFarms
  }


}
