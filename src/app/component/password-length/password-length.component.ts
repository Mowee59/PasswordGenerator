import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RangeProgressDirective } from '../../shared/directives/range-progress.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntil, distinctUntilChanged, Observable } from 'rxjs';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { PasswordOptionsService } from '../../services/PasswordOptions/password-options.service';
@Component({
  selector: 'app-password-length',
  standalone: true,
  imports: [RangeProgressDirective, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-length.component.html',
  styleUrl: './password-length.component.css',
})
export class PasswordLengthComponent implements OnInit, OnDestroy {
  @Input() initialLength = 10;
  @Input() minLength = 0;
  @Input() maxLength = 20;
  public length$!: Observable<number>;
  @Output() lengthChange = new EventEmitter<number>();

  lengthControl = new FormControl(this.initialLength);
  private destroy$ = new Subject<void>();

  constructor(private passwordOptionsService: PasswordOptionsService) {}  

  ngOnInit(): void {

    this.length$ = this.passwordOptionsService.length$;


    
    // Subscribe to value changes with debounce
    this.lengthControl.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        if (value !== null) {
          this.passwordOptionsService.setLength(value);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
