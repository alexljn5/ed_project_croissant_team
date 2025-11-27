import { useContent } from '../composables/useContent';
import { ref } from 'vue';
const { data: content, save } = useContent('editable_section', 'Placeholder text! Edit me and watch the DOM change right away. ♡');
const saving = ref(false);
const saveChanges = async () => {
    saving.value = true;
    await save();
    saving.value = false;
    alert('Saved forever! ♡ Refresh the page — your text will still be here!');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "mb-8 p-6 bg-[var(--achtergrond-primair)] rounded-lg shadow-md" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "text-[var(--font-grootte2)] font-bold text-[var(--site-paars)] mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-[var(--font-grootte)] text-[var(--header-text)] mb-4" },
});
(__VLS_ctx.content);
// @ts-ignore
[content,];
__VLS_asFunctionalElement(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
    value: (__VLS_ctx.content),
    ...{ class: "w-full p-4 border-2 border-[var(--site-paars)] rounded" },
    rows: "5",
    placeholder: "Type here... changes save when you click the button ♡",
});
// @ts-ignore
[content,];
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.saveChanges) },
    disabled: (__VLS_ctx.saving),
    ...{ class: "mt-4 px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500 disabled:opacity-70" },
});
// @ts-ignore
[saveChanges, saving,];
(__VLS_ctx.saving ? 'Saving...' : 'Save to Laravel ♡');
// @ts-ignore
[saving,];
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--achtergrond-primair)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--font-grootte2)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--site-paars)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--font-grootte)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--header-text)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--site-paars)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--interactief)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-yellow-500']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-70']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
