import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposCarterasComponent } from './tipos-carteras.component';

describe('TiposCarterasComponent', () => {
  let component: TiposCarterasComponent;
  let fixture: ComponentFixture<TiposCarterasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposCarterasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposCarterasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
