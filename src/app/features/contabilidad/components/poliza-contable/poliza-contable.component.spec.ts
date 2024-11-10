import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizaContableComponent } from './poliza-contable.component';

describe('PolizaContableComponent', () => {
  let component: PolizaContableComponent;
  let fixture: ComponentFixture<PolizaContableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolizaContableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolizaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
