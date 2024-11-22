import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColoresInternosComponent } from './colores-internos.component';

describe('ColoresInternosComponent', () => {
  let component: ColoresInternosComponent;
  let fixture: ComponentFixture<ColoresInternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColoresInternosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColoresInternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
