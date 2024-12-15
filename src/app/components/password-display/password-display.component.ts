import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-password-display',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './password-display.component.html',
  styleUrl: './password-display.component.css',
})
export class PasswordDisplayComponent {
  public password$!: Observable<string>;
  public showCopied = false;
  public password = this.passwordGeneratorService.passwordSignal;
  constructor(private passwordGeneratorService: PasswordGeneratorService) {}

  ngOnInit(): void {
    this.password$ = this.passwordGeneratorService.password$;
  }

  async copyPassword(): Promise<void> {
    const password = document.querySelector('input')?.value;
    if (password) {
      try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(password);
        } else {
          // Fallback for older browsers/mobile
          const textArea = document.createElement('textarea');
          textArea.value = password;
          textArea.style.position = 'fixed'; // Avoid scrolling
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        this.showCopied = true;
        setTimeout(() => {
          this.showCopied = false;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  }
}
