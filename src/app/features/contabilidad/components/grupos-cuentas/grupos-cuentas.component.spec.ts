import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposCuentasComponent } from './grupos-cuentas.component';

describe('GruposCuentasComponent', () => {
  let component: GruposCuentasComponent;
  let fixture: ComponentFixture<GruposCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GruposCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
