import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * A directive that adds progress tracking functionality to range input elements.
 * It updates a CSS custom property (--range-progress) based on the current value of the range input.
 */
@Directive({
  selector: 'input[type="range"]', // Targets all range input elements
  standalone: true,
})
export class RangeProgressDirective {
  /**
   * Creates an instance of RangeProgressDirective.
   * @param el Reference to the host range input element
   */
  constructor(private el: ElementRef) {
    // Initialize the progress value when directive is created
    this.updateProgress();
  }

  /**
   * Listens for input events on the range element and updates the progress.
   */
  @HostListener('input')
  onInput() {
    this.updateProgress();
  }

  /**
   * Updates the progress value of the range input.
   * Calculates the percentage of the current value relative to the maximum value
   * and sets it as a CSS custom property (--range-progress).
   * @private
   */
  private updateProgress() {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = +input.value;
    const max = +input.max || 100; // Default to 100 if max is not set
    const progress = (value / max) * 100;
    input.style.setProperty('--range-progress', `${progress}%`);
  }
}
