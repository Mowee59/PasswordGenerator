import { Component } from '@angular/core';
import { PasswordLengthComponent } from '../password-length/password-length.component';

@Component({
  selector: 'app-password-option',
  standalone: true,
  imports: [PasswordLengthComponent],
  templateUrl: './password-option.component.html',
  styleUrl: './password-option.component.css',
})
export class PasswordOptionComponent {}
