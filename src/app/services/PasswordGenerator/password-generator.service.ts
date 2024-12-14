import { Injectable } from '@angular/core';
import { PasswordOptionsService } from '../PasswordOptions/password-options.service';
import { combineLatest, map } from 'rxjs';

/**
 * Service responsible for generating passwords based on user-selected options.
 * Uses reactive streams to automatically generate new passwords when options change.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService {
  /**
   * Observable stream that emits a new password whenever password options change.
   * Combines all password option streams and maps them to generate a new password.
   */
  password$ = combineLatest([
    this.passwordOptionsService.length$,
    this.passwordOptionsService.includeUppercase$,
    this.passwordOptionsService.includeLowercase$,
    this.passwordOptionsService.includeNumbers$,
    this.passwordOptionsService.includeSymbols$,
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

  /**
   * Generates a random password based on the specified criteria
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
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

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

  // Inject the PasswordOptionsService to access password options
  constructor(private passwordOptionsService: PasswordOptionsService) {}
}
