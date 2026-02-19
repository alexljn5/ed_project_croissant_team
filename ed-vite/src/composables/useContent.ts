import { ref, onMounted } from 'vue';

// Helper: detect backend URL (localhost:5173 -> localhost:8000)
function getBackendUrl() {
  return window.location.origin.includes('5173')
    ? 'http://localhost:8000'
    : window.location.origin
}

export function useContent<T>(key: string, defaultValue: T) {
    const data = ref<T>(defaultValue);
    const loading = ref(true);

    const load = async () => {
        try {
            const backendUrl = getBackendUrl()
            const url = `${backendUrl}/api/content/${key}`
            console.log(`[useContent] Attempting to fetch ${key} from ${url}`);
            const res = await fetch(url, {
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
        try {
            // Convert reactive proxy to plain object/array before sending
            const plainData = JSON.parse(JSON.stringify(data.value));
            const backendUrl = getBackendUrl()
            const url = `${backendUrl}/api/content/${key}`
            console.log(`[useContent] Saving ${key}:`, plainData);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ value: plainData })
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
