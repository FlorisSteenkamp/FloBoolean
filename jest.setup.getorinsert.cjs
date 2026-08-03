// Polyfill for the TC39 `Map.prototype.getOrInsert` / `getOrInsertComputed`
// proposal, which is not yet available in the Node runtime Jest runs on.
// See: https://github.com/tc39/proposal-upsert

if (typeof Map.prototype.getOrInsert !== 'function') {
    Object.defineProperty(Map.prototype, 'getOrInsert', {
        value: function getOrInsert(key, defaultValue) {
            if (this.has(key)) {
                return this.get(key);
            }
            this.set(key, defaultValue);
            return defaultValue;
        },
        writable: true,
        configurable: true,
        enumerable: false,
    });
}

if (typeof Map.prototype.getOrInsertComputed !== 'function') {
    Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
        value: function getOrInsertComputed(key, callbackFn) {
            if (this.has(key)) {
                return this.get(key);
            }
            const value = callbackFn(key);
            this.set(key, value);
            return value;
        },
        writable: true,
        configurable: true,
        enumerable: false,
    });
}
