import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationComponent } from './liquidation.component';

describe('LiquidationComponent', () => {
  let component: LiquidationComponent;
  let fixture: ComponentFixture<LiquidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
