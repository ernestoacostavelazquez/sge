import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalesVentaComponent } from './canales-venta.component';

describe('CanalesVentaComponent', () => {
  let component: CanalesVentaComponent;
  let fixture: ComponentFixture<CanalesVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanalesVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanalesVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
