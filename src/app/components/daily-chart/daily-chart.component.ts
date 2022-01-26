import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5themes_Responsive from '@amcharts/amcharts5/themes/Animated';
import { TidesService } from 'src/app/services/tides.service';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from '@amcharts/amcharts5/.internal/core/render/Chart';
import { Select } from '@ngxs/store';
import { TideStateModel } from 'src/app/state/tide.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-daily-chart',
  templateUrl: './daily-chart.component.html',
  styleUrls: ['./daily-chart.component.scss']
})
export class DailyChartComponent implements OnInit, AfterViewInit, OnDestroy {

  private root: am5.Root | undefined; // root amchart
  data: any;
  tideDataSeries: am5xy.LineSeries | undefined;

  @Select(state => (state.tide as TideStateModel).unixTimestamp) unixTimeStamp$: Observable<number>;

  // An efficient way to unsubscribe to observables, used in conjunction with ngOnDestroy
  destroyed$ = new Subject<void>();

  constructor(
    private tidesService: TidesService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone) { }


  // For Amcharts - why?
  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
    // this.data = await this.tidesService.getDailyTidesArray(); // get the tides array data 

    // Watch Tide Height - when it changes, update the wms.
    this.unixTimeStamp$.pipe(
      tap(dateTime => {
        this.refreshChartData();
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }


  async ngAfterViewInit() {
    let data = await this.tidesService.getDailyTidesArray(); // get the tides array data  
    this.tideDataSeries = this.setupChart(data);

  }

  setupChart(data): am5xy.LineSeries {

    // see https://www.amcharts.com/demos/xy-chart-date-based-axis/

    let root = am5.Root.new("chartdiv");

    //////////////////////////////////////////////////////////////
    // TODO Has to be a better way to do this...
    // Set the height
    // root.dom.style.height = 300 + "px";

    root.setThemes([
      am5themes_Responsive.new(root),
      // am5themes_Animated.new(root)
    ]);

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["date"]
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
        // height: new am5.Percent(100),
      })
    );




    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "hour", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    }));

    // xAxis.data.setAll(data);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series0 = chart.series.push(am5xy.LineSeries.new(root, {
      calculateAggregates: true,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "height",
      valueXField: "date",
      valueField: "height",
      tooltip: am5.Tooltip.new(root, {
        labelText: "value: {value}"
      })
    }));

    series0.data.processor = am5.DataProcessor.new(root, {
      dateFields: ["date"], dateFormat: "yyyy-MM-dd'T'HH:mm'Z'"
    });



    // Define data
    series0.data.setAll(data);

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series0.appear(1000);

    chart.appear(1000, 100);
    // root.resize();

    this.root = root;
    return series0;


  }


  async refreshChartData() {
    // Define data
    let data = await this.tidesService.getDailyTidesArray(); // get the tides array data  

    this.tideDataSeries.data.setAll(data);


  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

}
