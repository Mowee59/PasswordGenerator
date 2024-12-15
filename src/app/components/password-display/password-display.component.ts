import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';

/**
 * Component responsible for displaying and managing the generated password.
 * Provides functionality to display the password and copy it to clipboard.
 */
@Component({
  selector: 'app-password-display',
  standalone: true,
  imports: [],
  templateUrl: './password-display.component.html',
  styleUrl: './password-display.component.css',
})
export class PasswordDisplayComponent {
  /** Observable stream of the generated password */
  public password$!: Observable<string>;
  
  /** Flag to control the visibility of "Copied" message */
  public showCopied = false;
  
  /** Signal containing the current password value */
  public password = this.passwordGeneratorService.passwordSignal;

  constructor(private passwordGeneratorService: PasswordGeneratorService) {}

  /**
   * Initializes the component by setting up the password observable
   */
  ngOnInit(): void {
    this.password$ = this.passwordGeneratorService.password$;
  }

  /**
   * Copies the current password to the clipboard
   * Supports both modern clipboard API and fallback for older browsers
   * Shows a "Copied" message for 2 seconds after successful copy
   * @returns Promise<void>
   */
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
