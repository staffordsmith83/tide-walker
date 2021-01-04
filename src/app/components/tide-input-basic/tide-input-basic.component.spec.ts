import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TideInputBasicComponent } from './tide-input-basic.component';

describe('TideInputBasicComponent', () => {
  let component: TideInputBasicComponent;
  let fixture: ComponentFixture<TideInputBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TideInputBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TideInputBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
