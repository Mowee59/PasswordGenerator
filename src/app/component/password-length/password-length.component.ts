import { Component } from '@angular/core';
import { RangeProgressDirective } from '../../shared/directives/range-progress.directive';
@Component({
  selector: 'app-password-length',
  standalone: true,
  imports: [RangeProgressDirective],
  templateUrl: './password-length.component.html',
  styleUrl: './password-length.component.css'
})
export class PasswordLengthComponent {

}
