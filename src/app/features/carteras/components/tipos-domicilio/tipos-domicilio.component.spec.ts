import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDomicilioComponent } from './tipos-domicilio.component';

describe('TiposDomicilioComponent', () => {
  let component: TiposDomicilioComponent;
  let fixture: ComponentFixture<TiposDomicilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposDomicilioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
