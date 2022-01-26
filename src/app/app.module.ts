import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TideInputBasicComponent } from './components/tide-input-basic/tide-input-basic.component'
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { TidesService } from './services/tides.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from "@angular/material/sidenav";
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { MainState } from './state/main.state';
import { TideState } from './state/tide.state';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { Sec2msPipe } from './pipes/sec2ms.pipe';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { DailyChartComponent } from './components/daily-chart/daily-chart.component';


@NgModule({
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatListModule,
    HttpClientModule,
    MatCardModule,
    MatSidenavModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    NgxsModule.forRoot([MainState, TideState], {
      developmentMode: !environment.production
    }),
    NgxsLoggerPluginModule.forRoot(),

  ],
  providers: [TidesService],
  declarations: [AppComponent, MapComponent, SidebarComponent, TideInputBasicComponent, TopBarComponent, Sec2msPipe, DailyChartComponent],
  bootstrap: [AppComponent],
})
export class AppModule {

}
