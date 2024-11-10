import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoCuentasComponent } from './catalogo-cuentas.component';

describe('CatalogoCuentasComponent', () => {
  let component: CatalogoCuentasComponent;
  let fixture: ComponentFixture<CatalogoCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
