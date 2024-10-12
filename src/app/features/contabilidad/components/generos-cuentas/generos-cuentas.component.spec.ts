import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerosCuentasComponent } from './generos-cuentas.component';

describe('GenerosCuentasComponent', () => {
  let component: GenerosCuentasComponent;
  let fixture: ComponentFixture<GenerosCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerosCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerosCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
