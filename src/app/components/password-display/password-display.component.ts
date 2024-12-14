import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-password-display',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './password-display.component.html',
  styleUrl: './password-display.component.css',
})
export class PasswordDisplayComponent {
  public password$!: Observable<string>;

  constructor(private passwordGeneratorService: PasswordGeneratorService) {}

  ngOnInit(): void {
    this.password$ = this.passwordGeneratorService.password$;
  }


}
