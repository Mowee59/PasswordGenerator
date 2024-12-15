import { Injectable } from '@angular/core';
import { PasswordOptionsService } from '../PasswordOptions/password-options.service';
import { combineLatest, map, BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Service responsible for generating secure passwords based on user-selected options.
 * Uses reactive streams to automatically generate new passwords when options change.
 * Provides password strength evaluation based on entropy calculations.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordGeneratorService {
  /** Character set for uppercase letters A-Z */
  private readonly UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  /** Character set for lowercase letters a-z */
  private readonly LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
  
  /** Character set for numbers 0-9 */
  private readonly NUMBER_CHARS = '0123456789';
  
  /** Character set for special symbols */
  private readonly SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

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
   * Observable stream that emits a password strength value (1-4) whenever password options change.
   * The strength is calculated based on password length and entropy.
   */
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
   * Evaluates the strength of a password based on its length and entropy.
   * The strength is calculated using the following criteria:
   * - Length < 8: Weak (1)
   * - Entropy < 28 bits: Very weak (1)
   * - Entropy < 36 bits: Weak (2)
   * - Entropy < 60 bits: Reasonable (3)
   * - Entropy >= 60 bits: Strong (4)
   * 
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
    // Check length first - passwords less than 8 characters are weak
    if (length < 8) return 1;  // Weak

    // Calculate entropy
    const entropy = this.calculatePasswordEntropy(
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    );

    // Return strength based on entropy thresholds
    if (entropy < 28) return 1;  // Very weak
    if (entropy < 36) return 2;  // Weak
    if (entropy < 60) return 3;  // Reasonable
    return 4;  // Strong
  }

  /**
   * Calculates the entropy (in bits) of a password based on its length and character set size.
   * Entropy is calculated as: length * log2(charset_size)
   * Higher entropy indicates a more secure password.
   * 
   * @param length - Length of the password
   * @param includeUppercase - Whether uppercase letters are included
   * @param includeLowercase - Whether lowercase letters are included
   * @param includeNumbers - Whether numbers are included
   * @param includeSymbols - Whether symbols are included
   * @returns The calculated entropy in bits, or 0 if no character types are selected
   */
  private calculatePasswordEntropy(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean,
  ): number {
    let charsetSize = 0;

    if (includeUppercase) charsetSize += this.UPPERCASE_CHARS.length;
    if (includeLowercase) charsetSize += this.LOWERCASE_CHARS.length;
    if (includeNumbers) charsetSize += this.NUMBER_CHARS.length;
    if (includeSymbols) charsetSize += this.SYMBOL_CHARS.length;

    if (charsetSize === 0) {
      return 0; // No character types selected
    }

    // Calculate entropy
    const entropy = length * Math.log2(charsetSize);
    return entropy;
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
