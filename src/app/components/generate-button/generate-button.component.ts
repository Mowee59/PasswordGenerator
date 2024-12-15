import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';

@Component({
  selector: 'app-generate-button',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './generate-button.component.html',
  styleUrl: './generate-button.component.css',
})
export class GenerateButtonComponent {
  regeneratePassword() {
    this.passwordGeneratorService.regeneratePassword();
    console.log('regeneratePassword');
  }

  constructor(private passwordGeneratorService: PasswordGeneratorService) {}
}
