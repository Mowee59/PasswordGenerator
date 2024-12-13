import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RangeProgressDirective } from '../../shared/directives/range-progress.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-password-length',
  standalone: true,
  imports: [RangeProgressDirective, ReactiveFormsModule],
  templateUrl: './password-length.component.html',
  styleUrl: './password-length.component.css',
})
export class PasswordLengthComponent implements OnInit, OnDestroy {
  @Input() initialLength = 10;
  @Input() minLength = 0;
  @Input() maxLength = 20;
  @Output() lengthChange = new EventEmitter<number>();

  lengthControl = new FormControl(this.initialLength);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Subscribe to value changes with debounce
    this.lengthControl.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        if (value !== null) {
          this.lengthChange.emit(value);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
