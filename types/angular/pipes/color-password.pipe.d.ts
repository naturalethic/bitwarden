import { PipeTransform } from '@angular/core';
/**
 * A pipe that sanitizes HTML and highlights numbers and special characters (in different colors each).
 */
export declare class ColorPasswordPipe implements PipeTransform {
    transform(password: string): string;
}
