/**
 * Use as a Decorator on async functions, it will limit how many times the function can be
 * in-flight at a time.
 *
 * Calls beyond the limit will be queued, and run when one of the active calls finishes
 */
export declare function throttle(limit: number, throttleKey: (args: any[]) => string): <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>) => {
    value: (...args: any[]) => Promise<T>;
};
