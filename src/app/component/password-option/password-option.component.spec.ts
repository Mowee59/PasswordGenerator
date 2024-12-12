import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordOptionComponent } from './password-option.component';

describe('PasswordOptionComponent', () => {
  let component: PasswordOptionComponent;
  let fixture: ComponentFixture<PasswordOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
