import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-generate-button',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './generate-button.component.html',
  styleUrl: './generate-button.component.css'
})
export class GenerateButtonComponent {

}
