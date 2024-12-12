import { ElementRef } from '@angular/core';
import { RangeProgressDirective } from './range-progress.directive';

describe('RangeProgressDirective', () => {
  it('should create an instance', () => {
    const elementRef = new ElementRef(document.createElement('input'));
    const directive = new RangeProgressDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
