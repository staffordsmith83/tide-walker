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

  // onNewTideReceived(userTideHeight: string) {
  //   this.tideHeight = userTideHeight;
  //   console.log(
  //     'New tide height received by App Component: ' + this.tideHeight
  //   );
  // }


  // dispatch the action to the store
  toggleSideBarState() {
    console.log("Attempting to Toggle Sidebar");
    // this.store.dispatch(new MainActions.ToggleSideBar()).subscribe((val) => {
    //   this.sideBarState = val.main.sideBarOpen;
    //   console.log(this.sideBarState);
    //   if (this.sideBarState) {
    //     this.sidenav.open();
    //   } else if (!this.sideBarState) {
    //     this.sidenav.close();
    //   }
    // });
  }



}
