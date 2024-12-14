import { Component, OnInit, OnDestroy } from '@angular/core';
import { PasswordGeneratorService } from '../../services/PasswordGenerator/password-generator.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgClass],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css',
})
export class PasswordStrengthComponent implements OnInit, OnDestroy {
  public readonly strengthText: string[] = [
    'Too Weak !',
    'Weak',
    'Medium',
    'Strong',
  ];

  get strengthLevel(): string {
    return this.strengthText[this.passwordStrength - 1] || 'Too Weak !';
  }

  public passwordStrength$!: Observable<number>;
  private passwordStrength!: number;
  private destroy$ = new Subject<void>();

  constructor(private passwordGeneratorService: PasswordGeneratorService) {}

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

  ngOnInit(): void {
    this.passwordStrength$ = this.passwordGeneratorService.passwordStrength$;
    this.passwordStrength$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => (this.passwordStrength = value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
