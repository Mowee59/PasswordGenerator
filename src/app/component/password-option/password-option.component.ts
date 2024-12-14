import { Component, OnDestroy, OnInit } from '@angular/core';
import { PasswordLengthComponent } from '../password-length/password-length.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordOptionsService } from '../../services/PasswordOptions/password-options.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Component responsible for managing password generation options through form controls.
 * Provides checkboxes for including different character types in the generated password.
 * Uses reactive forms to handle user input and updates the PasswordOptionsService accordingly.
 */
@Component({
  selector: 'app-password-option',
  standalone: true,
  imports: [PasswordLengthComponent, ReactiveFormsModule],
  templateUrl: './password-option.component.html',
  styleUrl: './password-option.component.css',
})
export class PasswordOptionComponent implements OnInit, OnDestroy {
  // Destroy subscription
  private destroy$ = new Subject<void>();

  /**
   * Injects the PasswordOptionsService to communicate password option changes
   * @param passwordOptionsService Service that manages password generation options
   */
  constructor(private passwordOptionsService: PasswordOptionsService) {}

  /**
   * Form control that manages the inclusion of uppercase letters (A-Z) in the password
   * Default value is false
   */
  includeUppercaseControl = new FormControl(false);

  /**
   * Form control that manages the inclusion of lowercase letters (a-z) in the password
   * Default value is false
   */
  includeLowercaseControl = new FormControl(false);

  /**
   * Form control that manages the inclusion of numbers (0-9) in the password
   * Default value is false
   */
  includeNumbersControl = new FormControl(false);

  /**
   * Form control that manages the inclusion of special symbols (!@#$%^&* etc.) in the password
   * Default value is false
   */
  includeSymbolsControl = new FormControl(false);

  /**
   * Lifecycle hook that initializes subscriptions to form control changes.
   * Sets up observers for each checkbox control that update the PasswordOptionsService
   * whenever the user changes a checkbox value.
   *
   * Each subscription includes a null check to ensure only valid boolean values
   * are passed to the service methods.
   */
  ngOnInit(): void {
    // Subscribe to uppercase checkbox changes
    this.includeUppercaseControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setIncludeUppercase(value);
        }
      });

    // Subscribe to numbers checkbox changes
    this.includeNumbersControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setIncludeNumbers(value);
        }
      });

    // Subscribe to symbols checkbox changes
    this.includeSymbolsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setIncludeSymbols(value);
        }
      });

    // Subscribe to lowercase checkbox changes
    this.includeLowercaseControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setIncludeLowercase(value);
        }
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
