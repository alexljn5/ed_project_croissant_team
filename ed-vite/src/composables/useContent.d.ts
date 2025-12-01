export declare function useContent<T>(key: string, defaultValue: T): {
    data: any;
    loading: any;
    save: () => Promise<void>;
    reload: () => Promise<void>;
};
