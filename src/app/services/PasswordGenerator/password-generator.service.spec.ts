import { TestBed } from '@angular/core/testing';
import { PasswordGeneratorService } from './password-generator.service';
import { PasswordOptionsService } from '../PasswordOptions/password-options.service';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
describe('PasswordGeneratorService', () => {
  let service: PasswordGeneratorService;
  let passwordOptionsService: jasmine.SpyObj<PasswordOptionsService>;

  beforeEach(() => {
    // Arrange
    passwordOptionsService = jasmine.createSpyObj('PasswordOptionsService', [], {
      length$: new BehaviorSubject(12),
      includeUppercase$: new BehaviorSubject(true),
      includeLowercase$: new BehaviorSubject(true),
      includeNumbers$: new BehaviorSubject(true),
      includeSymbols$: new BehaviorSubject(true),
    });

    TestBed.configureTestingModule({
      providers: [
        PasswordGeneratorService,
        { provide: PasswordOptionsService, useValue: passwordOptionsService },
      ],
    });
    service = TestBed.inject(PasswordGeneratorService);
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  describe('Password Generation', () => {
    it('should generate password with correct length', (done) => {
      // Arrange - default setup in beforeEach
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password.length).toBe(12);
        done();
      });
    });

    it('should generate empty password when no character types are selected', (done) => {
      // Arrange
      (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(false);
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password).toBe('');
        done();
      });
    });

    it('should generate new password when regeneratePassword is called', (done) => {
      // Arrange
      let firstPassword = '';
      
      // Act & Assert
      service.password$.subscribe((password) => {
        if (!firstPassword) {
          // First emission
          firstPassword = password;
          // Act - trigger regeneration
          service.regeneratePassword();
        } else {
          // Assert - second emission
          expect(password).not.toBe(firstPassword);
          done();
        }
      });
    });
  });

  describe('Character Type Selection', () => {
    it('should only include uppercase letters when only uppercase is selected', (done) => {
      // Arrange
      (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(true);
      (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(false);
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password).toMatch(/^[A-Z]+$/);
        done();
      });
    });
  
    it('should only include lowercase letters when only lowercase is selected', (done) => {
      // Arrange
      (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(true);
      (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(false);
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password).toMatch(/^[a-z]+$/);
        done();
      });
    });
  
    it('should only include numbers when only numbers are selected', (done) => {
      // Arrange
      (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(true);
      (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(false);
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password).toMatch(/^[0-9]+$/);
        done();
      });
    });

    it('should only include symbols when only symbols are selected', (done) => {
      // Arrange
      (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(false);
      (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(true);
  
      // Act & Assert
      service.password$.subscribe((password) => {
        expect(password).toMatch(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/);
        done();
      });
    });

    // it('should include at least one character from each selected type', (done) => {
    //   // Arrange - default setup includes all types
    //   (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(true);
    //   (passwordOptionsService.includeLowercase$ as BehaviorSubject<boolean>).next(true); 
    //   (passwordOptionsService.includeNumbers$ as BehaviorSubject<boolean>).next(true);
    //   (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(true);
  
    //   // Act & Assert
    //   service.password$.subscribe((password) => {
    //     // With uppercase enabled
    //     expect(password).toMatch(/[A-Z]/); // At least one uppercase
        
    //     // With lowercase enabled
    //     expect(password).toMatch(/[a-z]/); // At least one lowercase
        
    //     // With numbers enabled
    //     expect(password).toMatch(/[0-9]/); // At least one number
        
    //     // With symbols enabled
    //     expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/); // At least one symbol
    //     done();
    //   });
    // });
  });

  describe('Option Changes', () => {
    it('should generate new password when length changes', (done) => {
      // Arrange
      let firstPassword = '';
      
      // Act & Assert
      service.password$.subscribe((password) => {
        if (!firstPassword) {
          // First emission
          firstPassword = password;
          // Act - change length
          (passwordOptionsService.length$ as BehaviorSubject<number>).next(16);
        } else {
          // Assert - second emission
          expect(password.length).toBe(16);
          expect(password).not.toBe(firstPassword);
          done();
        }
      });
    });

    it('should generate correct password when multiple options change', (done) => {
      // Arrange
      const passwords: string[] = [];
      
      // Act & Assert
      service.password$.pipe(
        take(4) // We expect 4 emissions
      ).subscribe({
        next: (password) => {
          passwords.push(password);
          
          // Change options sequentially after each emission
          if (passwords.length === 1) {
            (passwordOptionsService.includeUppercase$ as BehaviorSubject<boolean>).next(false);
          } else if (passwords.length === 2) {
            (passwordOptionsService.includeSymbols$ as BehaviorSubject<boolean>).next(false);
          } else if (passwords.length === 3) {
            (passwordOptionsService.length$ as BehaviorSubject<number>).next(8);
          }
        },
        complete: () => {
          // Assert all password changes
          expect(passwords[1]).not.toMatch(/[A-Z]/); // No uppercase after first change
          expect(passwords[2]).not.toMatch(/[A-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/); // No uppercase or symbols after second change
          expect(passwords[3].length).toBe(8); // Length 8 after third change
          expect(passwords[3]).toMatch(/^[a-z0-9]+$/); // Only lowercase and numbers in final password
          
          // Verify all passwords are different
          const uniquePasswords = new Set(passwords);
          expect(uniquePasswords.size).toBe(4);
          
          done();
        }
      });
    });
    
  });
});
