import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NgFor, NgClass } from '@angular/common';

/**
 * Component responsible for displaying and managing the password strength indicator.
 * Shows both a text description and visual bars representing password strength levels.
 */
@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [ NgFor, NgClass],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css',
})
export class PasswordStrengthComponent implements OnInit, OnDestroy {
  /** Array of text descriptions for different password strength levels */
  public readonly strengthText: string[] = [
    'Too Weak !',
    'Weak',
    'Medium',
    'Strong',
  ];

  /**
   * Gets the text description for the current password strength level
   * @returns The strength description text based on current passwordStrength value
   */
  get strengthLevel(): string {
    return this.strengthText[this.passwordStrength - 1] || 'Too Weak !';
  }

  /** Observable stream of password strength values */
  public passwordStrength$!: Observable<number>;
  
  /** Current password strength value (1-4) */
  private passwordStrength!: number;
  
  /** Subject for handling component cleanup */
  private destroy$ = new Subject<void>();

  constructor(private passwordGeneratorService: PasswordGeneratorService) {}

  /**
   * Gets the CSS classes for the strength indicator bars
   * @returns Array of CSS class strings for each strength bar
   */
  get strengthBars() {
    const bars = Array(4).fill('w-2.5 border-2 border-text-light h-7');
    let barColor = '';

    switch (this.passwordStrength) {
      case 1:
        barColor = 'w-2.5 h-7  bg-error';
        break;
      case 2:
        barColor = 'w-2.5 h-7  bg-warning';
        break;
      case 3:
        barColor = 'w-2.5 h-7  bg-caution';
        break;
      case 4:
        barColor = 'w-2.5 h-7  bg-accent';
        break;
      default:
        return bars;
    }

    // Fill only the number of bars corresponding to the strength
    for (let i = 0; i < this.passwordStrength; i++) {
      bars[i] = barColor;
    }

    return bars;
  }

  /**
   * Initializes the component by setting up the password strength observable
   * and subscribing to strength changes
   */
  ngOnInit(): void {
    this.passwordStrength$ = this.passwordGeneratorService.passwordStrength$;
    this.passwordStrength$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => (this.passwordStrength = value));
  }

  /**
   * Cleanup method to prevent memory leaks
   * Completes the destroy subject to unsubscribe from observables
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
