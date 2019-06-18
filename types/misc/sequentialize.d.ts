/**
 * Use as a Decorator on async functions, it will prevent multiple 'active' calls as the same time
 *
 * If a promise was returned from a previous call to this function, that hasn't yet resolved it will
 * be returned, instead of calling the original function again
 *
 * Results are not cached, once the promise has returned, the next call will result in a fresh call
 *
 * Read more at https://github.com/bitwarden/jslib/pull/7
 */
export declare function sequentialize(cacheKey: (args: any[]) => string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    value: (...args: any[]) => Promise<any>;
};
