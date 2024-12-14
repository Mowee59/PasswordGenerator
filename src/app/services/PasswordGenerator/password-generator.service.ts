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

  passwordStrength$ = combineLatest([
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
      ]) =>
        this.evaluatePasswordStrength(
          length,
          includeUppercase,
          includeLowercase,
          includeNumbers,
          includeSymbols,
        ),
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

  /**
   * Evaluates the strength of a password based on its length and character variety.
   * @param length - The length of the password
   * @param includeUppercase - Whether the password includes uppercase letters
   * @param includeLowercase - Whether the password includes lowercase letters
   * @param includeNumbers - Whether the password includes numbers
   * @param includeSymbols - Whether the password includes symbols
   * @returns A strength value from 1 (weak) to 4 (strong)
   */
  private evaluatePasswordStrength(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean,
  ): number {
    // Base score starts at 0
    let strength = 0;

    // If no options selected, force weak password
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      strength = 1;
      return strength;
    } else if (length < 8) {
      // Length-based scoring
      strength = 1; // Too short - automatically weak
    } else {
      // Add points based on length
      if (length >= 8) strength += 1;
      if (length >= 12) strength += 1;
      if (length >= 16) strength += 1;

      // Add points for character variety
      let varietyCount = 0;
      if (includeUppercase) varietyCount++;
      if (includeLowercase) varietyCount++;
      if (includeNumbers) varietyCount++;
      if (includeSymbols) varietyCount++;

      // Bonus points based on character variety
      if (varietyCount >= 2) strength += 1;
      if (varietyCount >= 3) strength += 1;
      if (varietyCount === 4) strength += 1;

      // Penalize if only one character type is used
      if (varietyCount === 1) {
        strength = Math.max(1, strength - 2);
      }
    }

    // Normalize to 1-4 range
    return Math.max(1, Math.min(4, strength));
  }

  // Inject the PasswordOptionsService to access password options
  constructor(private passwordOptionsService: PasswordOptionsService) {}
}
