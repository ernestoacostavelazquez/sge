import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodosContablesComponent } from './periodos-contables.component';

describe('PeriodosContablesComponent', () => {
  let component: PeriodosContablesComponent;
  let fixture: ComponentFixture<PeriodosContablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodosContablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodosContablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
