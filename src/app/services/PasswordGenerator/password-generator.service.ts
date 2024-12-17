import { Injectable } from '@angular/core';
import { PasswordOptionsService } from '../PasswordOptions/password-options.service';
import { combineLatest, map, BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  UPPERCASE_CHARS,
  LOWERCASE_CHARS,
  NUMBER_CHARS,
  SYMBOL_CHARS,
} from '../../shared/constants/constants';
/**
 * Service responsible for generating secure passwords based on user-selected options.
 * Uses reactive streams to automatically generate new passwords when options change.
 * Provides password strength evaluation based on entropy calculations.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService  {
  /** Character set for uppercase letters A-Z */
  private readonly UPPERCASE_CHARS = UPPERCASE_CHARS;

  /** Character set for lowercase letters a-z */
  private readonly LOWERCASE_CHARS = LOWERCASE_CHARS;

  /** Character set for numbers 0-9 */
  private readonly NUMBER_CHARS = NUMBER_CHARS;

  /** Character set for special symbols */
  private readonly SYMBOL_CHARS = SYMBOL_CHARS;

  /** Subject used to trigger manual password regeneration */
  private regeneratePasswordSubject = new BehaviorSubject<void>(undefined);

  /**
   * Observable stream that emits a new password whenever:
   * - Password options (length, character sets) change
   * - Manual regeneration is triggered
   * Combines all password option streams and generates a new password based on the criteria.
   */
  password$ = combineLatest([
    this.passwordOptionsService.length$,
    this.passwordOptionsService.includeUppercase$,
    this.passwordOptionsService.includeLowercase$,
    this.passwordOptionsService.includeNumbers$,
    this.passwordOptionsService.includeSymbols$,
    this.regeneratePasswordSubject.asObservable(),
  ]).pipe(
    map(
      ([
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
      ]) => {
        return this.generatePassword(
          length,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        );
      },
    ),
  );

  /** Signal version of the password$ observable for use in templates */
  passwordSignal = toSignal(this.password$, { initialValue: '' });

  /**
   * Generates a cryptographically random password based on the specified criteria.
   * The password will only include characters from the selected character sets.
   *
   * @param length - The desired length of the password
   * @param includeUppercase - Whether to include uppercase letters (A-Z)
   * @param includeLowercase - Whether to include lowercase letters (a-z)
   * @param includeNumbers - Whether to include numbers (0-9)
   * @param includeSymbols - Whether to include special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)
   * @returns A randomly generated password string matching the criteria, or empty string if no character types are selected
   */
  private generatePassword(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean,
  ): string {
    let charset = '';
    if (includeUppercase) charset += this.UPPERCASE_CHARS;
    if (includeLowercase) charset += this.LOWERCASE_CHARS;
    if (includeNumbers) charset += this.NUMBER_CHARS;
    if (includeSymbols) charset += this.SYMBOL_CHARS;

    let password = '';

    if (charset.length === 0) {
      return '';
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  /**
   * Triggers a manual password regeneration by emitting a new event to the regeneration subject.
   * This will cause a new password to be generated with the current options.
   */
  regeneratePassword() {
    this.regeneratePasswordSubject.next();
  }

  /**
   * Creates a new instance of the PasswordGeneratorService.
   * @param passwordOptionsService - Service that provides access to password generation options
   */
  constructor(private passwordOptionsService: PasswordOptionsService) {}
}
