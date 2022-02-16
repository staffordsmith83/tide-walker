import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MainStateModel } from 'src/app/state/main.state';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Select(state => (state.main as MainStateModel).mapLayersLoaded) mapLayersLoaded$: Observable<boolean>;

  constructor() { }

  ngOnInit(): void {
  }

}
