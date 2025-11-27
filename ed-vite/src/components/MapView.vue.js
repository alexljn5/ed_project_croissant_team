import { ref, onMounted, watch } from 'vue';
import { initMap } from '../leaflet/map';
import { useContent } from '../composables/useContent';
import L from 'leaflet';
let map;
const lat = ref(52.5186);
const lng = ref(5.4713);
const { data: markers, loading: markersLoading, save: saveMarkers } = useContent('map-markers', []);
onMounted(async () => {
    // get the map instance from your existing code
    map = initMap('leaflet-map');
    // Wait a bit for data to load from API
    await new Promise(resolve => setTimeout(resolve, 100));
    // Render existing markers on the map
    console.log('Rendering markers from DB:', markers.value);
    if (markers.value && Array.isArray(markers.value) && markers.value.length > 0) {
        markers.value.forEach((marker) => {
            console.log('Adding marker:', marker);
            L.marker([marker.lat, marker.lng]).addTo(map)
                .bindPopup(marker.label || `${marker.lat}, ${marker.lng}`);
        });
    }
});
// Track rendered markers to avoid duplicates
let renderedMarkerCount = 0;
// Watch for changes to markers and update map when new ones are added
watch(markers, (newMarkers) => {
    if (newMarkers && Array.isArray(newMarkers) && newMarkers.length > renderedMarkerCount && map) {
        console.log('New markers detected, updating map');
        // Add only new markers
        for (let i = renderedMarkerCount; i < newMarkers.length; i++) {
            const marker = newMarkers[i];
            console.log('Adding new marker to map:', marker);
            L.marker([marker.lat, marker.lng]).addTo(map)
                .bindPopup(marker.label || `${marker.lat}, ${marker.lng}`);
        }
        renderedMarkerCount = newMarkers.length;
    }
}, { deep: true });
async function addMarker() {
    if (!map)
        return;
    const label = `Marker ${(markers.value?.length || 0) + 1}`;
    // Add to state first
    if (!markers.value) {
        markers.value = [];
    }
    markers.value.push({
        lat: lat.value,
        lng: lng.value,
        label: label
    });
    // Save to database
    console.log('Saving markers to DB:', markers.value);
    await saveMarkers();
    console.log('Markers saved successfully');
    // Add to map (will be handled by watch)
    L.marker([lat.value, lng.value]).addTo(map)
        .bindPopup(`${label}:<br>${lat.value}, ${lng.value}`);
    // Reset inputs
    lat.value = 52.5186;
    lng.value = 5.4713;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "mb-8 p-6 bg-white rounded shadow-md" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-2xl font-bold text-purple-700 mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.input)({
    type: "number",
    placeholder: "Latitude",
    ...{ class: "p-2 border rounded w-40" },
});
(__VLS_ctx.lat);
// @ts-ignore
[lat,];
__VLS_asFunctionalElement(__VLS_intrinsics.input)({
    type: "number",
    placeholder: "Longitude",
    ...{ class: "p-2 border rounded w-40" },
});
(__VLS_ctx.lng);
// @ts-ignore
[lng,];
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.addMarker) },
    ...{ class: "px-4 py-2 bg-purple-600 text-white rounded" },
});
// @ts-ignore
[addMarker,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "leaflet-map",
    ...{ class: "mt-4" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-700']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['w-40']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['w-40']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-purple-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
