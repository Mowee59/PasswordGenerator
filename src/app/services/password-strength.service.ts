import { Injectable } from '@angular/core';
import { PasswordOptionsService } from './PasswordOptions/password-options.service';
import { combineLatest, map } from 'rxjs';
import {
  UPPERCASE_CHARS,
  LOWERCASE_CHARS,
  NUMBER_CHARS,
  SYMBOL_CHARS,
} from '../shared/constants/constants';

/**
 * Service responsible for evaluating password strength based on length and entropy.
 * Uses reactive streams to automatically recalculate strength when password options change.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordStrengthService {
  constructor(private passwordOptionsService: PasswordOptionsService) {}

  /** Character set containing uppercase letters A-Z */
  private readonly UPPERCASE_CHARS = UPPERCASE_CHARS;

  /** Character set containing lowercase letters a-z */
  private readonly LOWERCASE_CHARS = LOWERCASE_CHARS;

  /** Character set containing numbers 0-9 */
  private readonly NUMBER_CHARS = NUMBER_CHARS;

  /** Character set containing special symbols */
  private readonly SYMBOL_CHARS = SYMBOL_CHARS;

  /**
   * Observable stream that emits a password strength value (1-4) whenever password options change.
   * The strength is calculated based on password length and entropy.
   * 
   * Strength levels:
   * 1 - Very weak/Weak (length < 8 or entropy < 28 bits)
   * 2 - Weak (entropy < 36 bits)
   * 3 - Reasonable (entropy < 60 bits)
   * 4 - Strong (entropy >= 60 bits)
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
   * Evaluates the strength of a password based on its length and entropy.
   * The strength is calculated using the following criteria:
   * - Length < 8: Weak (1)
   * - Entropy < 28 bits: Very weak (1)
   * - Entropy < 36 bits: Weak (2)
   * - Entropy < 60 bits: Reasonable (3)
   * - Entropy >= 60 bits: Strong (4)
   *
   * These thresholds are based on common password security guidelines:
   * - 28 bits is considered the minimum for any security
   * - 36 bits can resist offline attacks for a short time
   * - 60 bits provides good security against most attack scenarios
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
    if (length < 8) return 1; // Weak

    // Calculate entropy
    const entropy = this.calculatePasswordEntropy(
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    );

    // Return strength based on entropy thresholds
    if (entropy < 28) return 1; // Very weak
    if (entropy < 36) return 2; // Weak
    if (entropy < 60) return 3; // Reasonable
    return 4; // Strong
  }

  /**
   * Calculates the entropy (in bits) of a password based on its length and character set size.
   * Entropy is calculated as: length * log2(charset_size)
   * Higher entropy indicates a more secure password.
   * 
   * The calculation considers the total possible characters available based on selected options:
   * - Uppercase adds 26 characters (A-Z)
   * - Lowercase adds 26 characters (a-z)
   * - Numbers add 10 characters (0-9)
   * - Symbols add special characters (!@#$%^&*()_+-=[]{}|;:,.<>?)
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

    // Calculate entropy using the formula: length * log2(charset_size)
    const entropy = length * Math.log2(charsetSize);
    return entropy;
  }
}
