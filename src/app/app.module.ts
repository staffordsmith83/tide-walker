import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AttributeFormComponent } from './components/attribute-form/attribute-form.component';

@NgModule({
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDGzi-Na0fdl4bXG7zKhxSq2qIfdlUagUY',
      libraries: ['drawing']
    }),
    FlexLayoutModule,
  ],
  providers: [],
  declarations: [AppComponent, MapComponent, SidebarComponent, AttributeFormComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
