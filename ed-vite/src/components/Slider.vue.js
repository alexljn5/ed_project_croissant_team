import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
const cards = [
    { image: '/src/assets/img/18c-glas-in-lood.webp', date: '18-11-25, 8:00', title: 'titel', description: 'description' },
    { image: '/src/assets/img/17a-gevelschilderingen.webp', date: '19-11-25, 14:30', title: 'titel', description: 'description' },
    { image: '/src/assets/img/buitenkant-bib-en-stadhuis.webp', date: '20-11-25, 10:00', title: 'titel', description: 'description' },
    { image: '/src/assets/img/agorahof.webp', date: '21-11-25, 19:00', title: 'titel', description: 'description' },
    { image: '/src/assets/img/20ab.webp', date: '22-11-25, 11:00', title: 'titel', description: 'description' }
];
const currentIndex = ref(0);
const trackRef = ref(null);
const cardEls = ref([]);
let autoSlideInterval = 0;
function updateSliderPosition() {
    const track = trackRef.value;
    const cardsCollection = cardEls.value;
    if (!track || cardsCollection.length === 0)
        return;
    const cardWidth = cardsCollection[0].offsetWidth + 30;
    const offset = (track.offsetWidth / 2) - (cardWidth / 2) - (currentIndex.value * cardWidth);
    track.style.transform = `translateX(${offset}px)`;
}
function goToSlide(i) {
    currentIndex.value = (i + cards.length) % cards.length;
    updateSliderPosition();
    resetAuto();
}
function nextSlide() {
    goToSlide(currentIndex.value + 1);
}
function prevSlide() {
    goToSlide(currentIndex.value - 1);
}
function startAuto() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = window.setInterval(nextSlide, 8000);
}
function resetAuto() {
    clearInterval(autoSlideInterval);
    startAuto();
}
function pauseAuto() {
    clearInterval(autoSlideInterval);
}
onMounted(async () => {
    // populate cardEls (refs)
    await nextTick();
    cardEls.value = Array.from(trackRef.value?.querySelectorAll('.slider-card') || []);
    updateSliderPosition();
    window.addEventListener('resize', updateSliderPosition);
    startAuto();
});
onBeforeUnmount(() => {
    clearInterval(autoSlideInterval);
    window.removeEventListener('resize', updateSliderPosition);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['slider-card']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-card']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({
    ...{ class: "content-slider" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "slider-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.prevSlide) },
    ...{ class: "slider-arrow prev" },
});
// @ts-ignore
[prevSlide,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMouseenter: (__VLS_ctx.pauseAuto) },
    ...{ onMouseleave: (__VLS_ctx.startAuto) },
    ...{ class: "slider-track" },
    ref: "trackRef",
});
/** @type {typeof __VLS_ctx.trackRef} */ ;
// @ts-ignore
[pauseAuto, startAuto, trackRef,];
for (const [card, index] of __VLS_getVForSourceType((__VLS_ctx.cards))) {
    // @ts-ignore
    [cards,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ class: "slider-card" },
        ...{ class: ({ active: index === __VLS_ctx.currentIndex }) },
        ref: "cardEls",
    });
    /** @type {typeof __VLS_ctx.cardEls} */ ;
    // @ts-ignore
    [currentIndex, cardEls,];
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-image" },
        ...{ style: ({ backgroundImage: `url('${card.image}')` }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "date-badge" },
    });
    (card.date);
    __VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (card.title);
    __VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (card.description);
}
__VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.nextSlide) },
    ...{ class: "slider-arrow next" },
});
// @ts-ignore
[nextSlide,];
/** @type {__VLS_StyleScopedClasses['content-slider']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-container']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['prev']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-track']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-card']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['date-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['next']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
