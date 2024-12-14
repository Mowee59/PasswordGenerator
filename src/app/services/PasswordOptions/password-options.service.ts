import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PasswordOptionsService {
  private lengthSubject = new BehaviorSubject<number>(8);
  private includeNumbersSubject = new BehaviorSubject<boolean>(false);
  private includeUppercaseSubject = new BehaviorSubject<boolean>(false);

  length$ = this.lengthSubject.asObservable();
  includeNumbers$ = this.includeNumbersSubject.asObservable();
  includeUppercase$ = this.includeUppercaseSubject.asObservable();

  // length = toSignal(this.lengthSubject);

  setLength(length: number) {
    this.lengthSubject.next(length);
    console.log(this.lengthSubject.value);
  }

  setIncludeNumbers(include: boolean) {
    this.includeNumbersSubject.next(include);
  }

  setIncludeUppercase(include: boolean) {
    this.includeUppercaseSubject.next(include);
  }
}