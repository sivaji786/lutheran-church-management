// Type-safe localStorage helpers

export const storage = {
    /**
     * Get item from localStorage with type safety
     * @param key - Storage key
     * @param defaultValue - Default value if key doesn't exist
     * @returns Parsed value or default value
     */
    get<T>(key: string, defaultValue?: T): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : (defaultValue ?? null);
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue ?? null;
        }
    },

    /**
     * Set item in localStorage
     * @param key - Storage key
     * @param value - Value to store
     */
    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
        }
    },

    /**
     * Remove item from localStorage
     * @param key - Storage key
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    },

    /**
     * Clear all localStorage data
     */
    clearAll(): void {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },

    /**
     * Clear all keys with a specific prefix
     * @param prefix - Key prefix to match
     */
    clearPrefix(prefix: string): void {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(prefix))
                .forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error(`Error clearing localStorage prefix (${prefix}):`, error);
        }
    }
};

/**
 * Cache storage with expiration support
 */
export const cacheStorage = {
    /**
     * Set item in cache with TTL
     * @param key - Storage key
     * @param value - Value to store
     * @param ttlMinutes - Time to live in minutes (default: 60)
     */
    set<T>(key: string, value: T, ttlMinutes: number = 60): void {
        const item = {
            value,
            expiry: Date.now() + (ttlMinutes * 60 * 1000)
        };
        storage.set(key, item);
    },

    /**
     * Get item from cache, returns null if expired
     * @param key - Storage key
     * @returns Cached value or null if expired/not found
     */
    get<T>(key: string): T | null {
        const item = storage.get<{ value: T; expiry: number }>(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            storage.remove(key);
            return null;
        }

        return item.value;
    }
};
