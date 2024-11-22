import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoresExternosComponent } from './colores-externos.component';

describe('ColoresExternosComponent', () => {
  let component: ColoresExternosComponent;
  let fixture: ComponentFixture<ColoresExternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColoresExternosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColoresExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
