import { ref, onMounted } from 'vue';

const API_BASE = 'http://127.0.0.1:8000/api/content';

export function useContent<T>(key: string, defaultValue: T) {
    const data = ref<T>(defaultValue);
    const loading = ref(true);

    const load = async () => {
        try {
            const res = await fetch(`${API_BASE}/${key}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            data.value = json.value ?? defaultValue;
        } catch (e) {
            console.warn(`Kon ${key} niet laden, fallback naar default ♡`, e);
            data.value = defaultValue;
        } finally {
            loading.value = false;
        }
    };

    const save = async () => {
        try {
            await fetch(`${API_BASE}/${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: data.value })
            });
        } catch (e) {
            console.error('Save failed', e);
        }
    };

    onMounted(load);

    return { data, loading, save, reload: load };
}
