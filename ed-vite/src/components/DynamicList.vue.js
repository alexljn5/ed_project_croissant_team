import { ref } from 'vue';
import { useContent } from '../composables/useContent';
const { data, loading, save } = useContent('dynamic-list', ['Item 1', 'Item 2']);
const newItem = ref('');
const addItem = () => {
    if (!newItem.value.trim())
        return;
    data.value.push(newItem.value.trim());
    newItem.value = '';
    save();
};
const removeItem = (index) => {
    data.value.splice(index, 1);
    save();
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
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-purple-500 font-bold" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "list-disc pl-6 mb-4" },
    });
    for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.data))) {
        // @ts-ignore
        [data,];
        __VLS_asFunctionalElement(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (index),
            ...{ class: "mb-2 flex items-center" },
        });
        (item);
        __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    __VLS_ctx.removeItem(index);
                    // @ts-ignore
                    [removeItem,];
                } },
            ...{ class: "ml-4 text-red-500 hover:text-red-700" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsics.input)({
    value: (__VLS_ctx.newItem),
    type: "text",
    ...{ class: "p-2 border-2 border-[var(--site-paars)] rounded mr-2" },
    placeholder: "Add a new item ♡",
});
// @ts-ignore
[newItem,];
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.addItem) },
    ...{ class: "px-6 py-2 bg-[var(--interactief)] text-white rounded hover:bg-yellow-500" },
});
// @ts-ignore
[addItem,];
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--achtergrond-primair)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--font-grootte2)]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[var(--site-paars)]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-purple-500']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-6']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-[var(--site-paars)]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-6']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-[var(--interactief)]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-yellow-500']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
