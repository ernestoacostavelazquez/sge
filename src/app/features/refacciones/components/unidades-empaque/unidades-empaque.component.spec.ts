import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesEmpaqueComponent } from './unidades-empaque.component';

describe('UnidadesEmpaqueComponent', () => {
  let component: UnidadesEmpaqueComponent;
  let fixture: ComponentFixture<UnidadesEmpaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadesEmpaqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesEmpaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
