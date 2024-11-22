import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposCajasComponent } from './tipos-cajas.component';

describe('TiposCajasComponent', () => {
  let component: TiposCajasComponent;
  let fixture: ComponentFixture<TiposCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposCajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
