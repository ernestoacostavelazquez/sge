import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombustiblesComponent } from './combustibles.component';

describe('CombustiblesComponent', () => {
  let component: CombustiblesComponent;
  let fixture: ComponentFixture<CombustiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombustiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombustiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
