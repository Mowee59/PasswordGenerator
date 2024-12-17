import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service responsible for managing password generation options.
 * Uses BehaviorSubjects to maintain and broadcast the current state of each password option.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordOptionsService {
  // BehaviorSubjects to track the state of each password option
  private lengthSubject = new BehaviorSubject<number>(8);
  private includeNumbersSubject = new BehaviorSubject<boolean>(false);
  private includeUppercaseSubject = new BehaviorSubject<boolean>(false);
  private includeSymbolsSubject = new BehaviorSubject<boolean>(false);
  private includeLowercaseSubject = new BehaviorSubject<boolean>(false);
  
  // Observable streams of the password options that components can subscribe to
  length$ = this.lengthSubject.asObservable();
  includeNumbers$ = this.includeNumbersSubject.asObservable();
  includeUppercase$ = this.includeUppercaseSubject.asObservable();
  includeSymbols$ = this.includeSymbolsSubject.asObservable();
  includeLowercase$ = this.includeLowercaseSubject.asObservable();

  /**
   * Updates the desired password length
   * @param length - The new password length (number of characters)
   */
  setLength(length: number) {
    this.lengthSubject.next(length);
  }

  /**
   * Updates whether numbers should be included in the password
   * @param include - True to include numbers, false to exclude them
   */
  setIncludeNumbers(include: boolean) {
    this.includeNumbersSubject.next(include);
  }

  /**
   * Updates whether uppercase letters should be included in the password
   * @param include - True to include uppercase letters, false to exclude them
   */
  setIncludeUppercase(include: boolean) {
    this.includeUppercaseSubject.next(include);
  }

  /**
   * Updates whether symbols should be included in the password
   * @param include - True to include symbols, false to exclude them
   */
  setIncludeSymbols(include: boolean) {
    this.includeSymbolsSubject.next(include);
  }

  /**
   * Updates whether lowercase letters should be included in the password
   * @param include - True to include lowercase letters, false to exclude them
   */
  setIncludeLowercase(include: boolean) {
    this.includeLowercaseSubject.next(include);
  }
}
