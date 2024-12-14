import { Component } from '@angular/core';
import { PasswordDisplayComponent } from '../password-display/password-display.component';
import { PasswordOptionComponent } from '../password-option/password-option.component';
import { PasswordStrengthComponent } from '../password-strength/password-strength.component';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [
    PasswordDisplayComponent,
    PasswordOptionComponent,
    PasswordStrengthComponent,
  ],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.css',
})
export class PasswordGeneratorComponent {}
