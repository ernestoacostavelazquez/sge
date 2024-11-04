import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPolizaComponent } from './tipos-poliza.component';

describe('TiposPolizaComponent', () => {
  let component: TiposPolizaComponent;
  let fixture: ComponentFixture<TiposPolizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPolizaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposPolizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
