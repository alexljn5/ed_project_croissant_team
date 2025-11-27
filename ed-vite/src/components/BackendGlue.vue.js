import { ref, onMounted } from 'vue';
const msg = ref('connecting...');
onMounted(async () => {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/hello');
        const data = await res.json();
        msg.value = data.message || 'DIRECT CONNECT SUCCESS!';
    }
    catch (e) {
        msg.value = 'still offline :(';
        console.error(e);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "fixed bottom-4 right-4 z-50" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "bg-white rounded-full shadow-2xl px-6 py-4 border-4 border-purple-300" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-sm font-bold text-purple-800 whitespace-nowrap" },
});
(__VLS_ctx.msg);
// @ts-ignore
[msg,];
/** @type {__VLS_StyleScopedClasses['fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-4']} */ ;
/** @type {__VLS_StyleScopedClasses['right-4']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-purple-300']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-800']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
