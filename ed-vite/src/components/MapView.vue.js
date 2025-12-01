import { defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { initMap } from '../map';
import 'leaflet/dist/leaflet.css';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    setup() {
        let map;
        onMounted(() => {
            map = initMap('map'); // Call your existing TypeScript map logic
        });
        onBeforeUnmount(() => {
            if (map)
                map.remove(); // clean up Leaflet map
        });
        return {};
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        let map;
        onMounted(() => {
            map = initMap('map'); // Call your existing TypeScript map logic
        });
        onBeforeUnmount(() => {
            if (map)
                map.remove(); // clean up Leaflet map
        });
        return {};
    }
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "map",
});
export default {};
