import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordDisplayComponentComponent } from './password-display-component.component';

describe('PasswordDisplayComponentComponent', () => {
  let component: PasswordDisplayComponentComponent;
  let fixture: ComponentFixture<PasswordDisplayComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordDisplayComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordDisplayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
