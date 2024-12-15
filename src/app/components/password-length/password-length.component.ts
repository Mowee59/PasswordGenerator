import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RangeProgressDirective } from '../../shared/directives/range-progress.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil, distinctUntilChanged, Observable } from 'rxjs';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { PasswordOptionsService } from '../../services/PasswordOptions/password-options.service';

/**
 * Component responsible for managing the password length selection.
 * Provides a range input control to adjust password length and syncs with PasswordOptionsService.
 */
@Component({
  selector: 'app-password-length',
  standalone: true,
  imports: [RangeProgressDirective, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-length.component.html',
  styleUrl: './password-length.component.css',
})
export class PasswordLengthComponent implements OnInit, OnDestroy {
  /** Initial password length value. Defaults to 10 characters. */
  public readonly initialLength = 10;

  /** Minimum allowed password length. Defaults to 0. */
  public readonly minLength = 0;

  /** Maximum allowed password length. Defaults to 20. */
  public readonly maxLength = 20;

  /** Observable stream of the current password length */
  public length$!: Observable<number>;

  /** Form control for the length input range */
  lengthControl = new FormControl(this.initialLength);

  /** Subject for handling component cleanup */
  private destroy$ = new Subject<void>();

  constructor(private passwordOptionsService: PasswordOptionsService) {}

  /**
   * Initializes the component by setting up the length observable and
   * subscribing to length control changes
   */
  ngOnInit(): void {
    this.length$ = this.passwordOptionsService.length$;

    // Subscribe to value changes and update service when length changes
    this.lengthControl.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setLength(value);
        }
      });
  }

  /**
   * Cleanup method to prevent memory leaks
   * Completes the destroy subject when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
