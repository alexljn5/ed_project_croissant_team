import { ref, onMounted } from 'vue';

function getBackendUrl(): string {
    const origin = window.location.origin;
    if (origin.includes('5173')) {
        return 'http://127.0.0.1:8000';
    }
    return origin;
}

export function useContent<T>(key: string, defaultValue: T) {
    const data = ref<T>(defaultValue);
    const loading = ref(true);

    const load = async () => {
        const backendUrl = getBackendUrl();
        const API_BASE = `${backendUrl}/api/content`;
        try {
            console.log(`[useContent] Attempting to fetch ${key} from ${backendUrl}/api/content/${key}`);
            const res = await fetch(`${API_BASE}/${key}`, {
                credentials: 'same-origin'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch`);
            const json = await res.json();
            console.log(`[useContent] Loaded ${key}:`, json);
            const value = json.value ?? defaultValue;
            // Just use the value directly - don't force it into any format
            data.value = value;
            console.log(`[useContent] Set data.value to:`, data.value);
        } catch (e) {
            console.error(`[useContent] Failed to load ${key}:`, e);
            console.error(`Make sure Laravel backend is running on http://127.0.0.1:8000`);
            data.value = defaultValue;
        } finally {
            loading.value = false;
        }
    };

    const save = async () => {
        const backendUrl = getBackendUrl();
        const API_BASE = `${backendUrl}/api/content`;
        try {
            // Convert reactive proxy to plain object/array before sending
            const plainData = JSON.parse(JSON.stringify(data.value));
            console.log(`[useContent] Saving ${key}:`, plainData);
            const res = await fetch(`${API_BASE}/${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: plainData }),
                credentials: 'same-origin'
            });
            if (!res.ok) {
                throw new Error(`Save failed with status ${res.status}`);
            }
            const result = await res.json();
            console.log(`[useContent] Save successful for ${key}:`, result);
        } catch (e) {
            console.error(`[useContent] Save failed for ${key}:`, e);
            throw e;
        }
    };

    onMounted(load);

    return { data, loading, save, reload: load };
}
