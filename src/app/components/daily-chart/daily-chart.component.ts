import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
// import am5themes_Responsive from '@amcharts/amcharts5/themes/Animated';
import { TidesService } from 'src/app/services/tides.service';
import { isPlatformBrowser } from '@angular/common';
import { Chart } from '@amcharts/amcharts5/.internal/core/render/Chart';
import { Select, Store } from '@ngxs/store';
import { TideStateModel } from 'src/app/state/tide.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TideActions } from 'src/app/state/tide.actions';

@Component({
  selector: 'app-daily-chart',
  templateUrl: './daily-chart.component.html',
  styleUrls: ['./daily-chart.component.scss'],
})
export class DailyChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private root: am5.Root | undefined; // root amchart
  data: any;
  tideDataSeries: am5xy.LineSeries | undefined;

  selectedTime; // TODO add type when know
  selectedTide; // TODO add type when know

  @Select((state) => (state.tide as TideStateModel).unixTimestamp)
  unixTimeStamp$: Observable<number>;

  // An efficient way to unsubscribe to observables, used in conjunction with ngOnDestroy
  destroyed$ = new Subject<void>();

  constructor(
    private tidesService: TidesService,
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private store: Store
  ) {}

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
    this.unixTimeStamp$
      .pipe(
        tap((dateTime) => {
          this.refreshChartData();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  async ngAfterViewInit() {
    let data = await this.tidesService.getDailyTidesArray(); // get the tides array data
    this.tideDataSeries = this.setupChart(data);
  }

  setupChart(data): am5xy.LineSeries {
    // see https://www.amcharts.com/demos/xy-chart-date-based-axis/

    let root = am5.Root.new('chartdiv');

    //////////////////////////////////////////////////////////////
    // TODO Has to be a better way to do this...
    // Set the height
    // root.dom.style.height = 300 + "px";

    root.setThemes([
      // am5themes_Responsive.new(root),
      am5themes_Animated.new(root),
    ]);

    root.dateFormatter.setAll({
      dateFormat: 'yyyy-MM-dd',
      dateFields: ['date'],
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
        // height: new am5.Percent(100),
      })
    );

    chart.children.unshift(
      am5.Label.new(root, {
        text: 'Select a Tide Point',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
      })
    );

    chart.children.unshift(
      am5.Label.new(root, {
        text: 'meters',
        fontSize: 8,
        fontWeight: '500',
        textAlign: 'left',
        x: am5.percent(5),
        centerX: am5.percent(50),
        paddingTop: 0,
        paddingBottom: 0,
        // rotation: 90
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'minute', count: 30 },
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // xAxis.data.setAll(data);

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let tideSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        // calculateAggregates: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'height',
        valueXField: 'date',
        valueField: 'height',
        // curveFactory: curveLinear, // TODO SMOOTHING NOT WORKING - DUE TO data.processor maybe?
        tooltip: am5.Tooltip.new(root, {
          labelText: 'value: {value}',
        }),
        interactive: true,
      })
    );

    tideSeries.data.processor = am5.DataProcessor.new(root, {
      dateFields: ['date'],
      dateFormat: "yyyy-MM-dd'T'HH:mm'Z'",
    });

    // Define data
    tideSeries.data.setAll(data);

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'selectXY',
      })
    );

    // Create animating bullet by adding two circles in a bullet container and
    // animating radius and opacity of one of them.

    tideSeries.bullets.push((root, series, dataItem) => {
      let container = am5.Container.new(root, {});
      let circle0 = container.children.push(
        am5.Circle.new(root, {
          radius: 3,
          fill: am5.color(0x000000),
        })
      );
      circle0.events.on('click', (ev) => {
        console.log('Clicked on a bullet!', dataItem.get('valueY'));
        this.store.dispatch(
          new TideActions.UpdateTideHeight(dataItem.get('valueY')) // Start the chain of events to update the tide height and WMS TODO: change this if refactor the signal flow
        );

        // Bullet Animation Section -  add Animation still within this On Click block...
        let circle1 = container.children.push(
          am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xff0000),
          })
        );

        circle1.animate({
          key: 'radius',
          to: 20,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
          loops: Infinity,
        });
        circle1.animate({
          key: 'opacity',
          to: 0,
          from: 1,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
          loops: Infinity,
        });
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    tideSeries.appear(1000);

    chart.appear(3000, 100);
    // root.resize();

    this.root = root;
    return tideSeries;
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

export interface TidesChartEventContext {
  dt: number;
  date: number;
  height: number;
}
