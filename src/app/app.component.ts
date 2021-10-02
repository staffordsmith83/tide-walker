import { Input, Output, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { MainActions } from './state/main.actions';
import { MainState, MainStateModel } from './state/main.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'Mapbox Application';
  tideHeight: string = '0.0';
  map: google.maps.Map | undefined; // important to declare the type of property map, so we can refer to it with this.map



  // Get access to the state:
  @Select(state => (state.main as MainStateModel).sideBarOpen) sideBarState$: Observable<boolean>;

  constructor(private store: Store) { }

  // dispatch the action to the store
  toggleSideBarState() {
    console.log("Attempting to Toggle Sidebar");
    this.store.dispatch(new MainActions.ToggleSideBar());
  }



}
