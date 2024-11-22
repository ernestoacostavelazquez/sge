import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadorasComponent } from './armadoras.component';

describe('ArmadorasComponent', () => {
  let component: ArmadorasComponent;
  let fixture: ComponentFixture<ArmadorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmadorasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArmadorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
