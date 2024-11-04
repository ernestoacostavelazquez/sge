import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposPersonaComponent } from './tipos-persona.component';

describe('TiposPersonaComponent', () => {
  let component: TiposPersonaComponent;
  let fixture: ComponentFixture<TiposPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposPersonaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
