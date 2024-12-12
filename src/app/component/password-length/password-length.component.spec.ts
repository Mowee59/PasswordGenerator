import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLengthComponent } from './password-length.component';

describe('PasswordLengthComponent', () => {
  let component: PasswordLengthComponent;
  let fixture: ComponentFixture<PasswordLengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordLengthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordLengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
