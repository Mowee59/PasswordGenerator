import { Component } from '@angular/core';
import { PasswordDisplayComponent } from '../password-display/password-display.component';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [PasswordDisplayComponent],
  templateUrl: './password-generator.component.html',
  styleUrl: './password-generator.component.css',
})
export class PasswordGeneratorComponent {}
