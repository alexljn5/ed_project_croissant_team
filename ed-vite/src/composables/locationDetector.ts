// src/composables/useLocationDetector.ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGeolocation } from './useGeolocation'

interface POI {
    id: string | number
    name: string
    description?: string
    image?: string
    location: {
        latitude: number
        longitude: number
    }
    distance?: number
}

interface HardcodedTarget {
    id: string
    name: string
    latitude: number
    longitude: number
    threshold: number // km
}

const mockPOIs: POI[] = [
    // your mock data...
]

export function useLocationDetector() {
    const { coords, isTracking, error, isMobile, startTracking, stopTracking, requestPermission, calculateDistance, shareCurrentLocation } = useGeolocation()

    const allPOIs = ref<POI[]>([])
    const selectedPOI = ref<POI | null>(null)
    const proximityNotification = ref<POI | null>(null)
    const proximityDistance = ref(0.02)

    const testLatitude = ref<number>(52.0907)
    const testLongitude = ref<number>(5.1214)
    const testProximityDistance = ref<number>(0.5)

    const hardcodedTargets = ref<HardcodedTarget[]>([
        { id: 'test1', name: 'Test Location 1', latitude: 52.09070000, longitude: 5.12140000, threshold: 0.0001 },
        { id: 'test2', name: 'Test Location 2', latitude: 52.09080000, longitude: 5.12150000, threshold: 0.0001 }
    ])

    const nearbyPOIs = computed(() => {
        if (!coords.value) return []

        const distanceThreshold = isTracking.value && !isMobile.value
            ? testProximityDistance.value
            : proximityDistance.value * 2

        return allPOIs.value
            .map(poi => ({
                ...poi,
                distance: calculateDistance(
                    coords.value!.latitude,
                    coords.value!.longitude,
                    poi.location.latitude,
                    poi.location.longitude
                )
            }))
            .filter(poi => poi.distance < distanceThreshold)
            .sort((a, b) => a.distance - b.distance)
    })

    watch(nearbyPOIs, (newPOIs) => {
        const proximityThreshold = isTracking.value && !isMobile.value
            ? testProximityDistance.value / 2
            : proximityDistance.value

        const closeByPOI = newPOIs.find(poi => poi.distance < proximityThreshold)

        if (closeByPOI && (!proximityNotification.value || proximityNotification.value.id !== closeByPOI.id)) {
            proximityNotification.value = closeByPOI
            console.log('POI Proximity Alert:', closeByPOI.name, closeByPOI.distance?.toFixed(4), 'km')
        }
    }, { deep: true })

    watch(coords, (newCoords) => {
        if (!newCoords || !isTracking.value) return

        for (const target of hardcodedTargets.value) {
            const dist = calculateDistance(
                newCoords.latitude,
                newCoords.longitude,
                target.latitude,
                target.longitude
            )

            if (dist < target.threshold) {
                console.log(`HARDCODED MATCH! At: ${target.name} (dist: ${dist.toFixed(6)} km)`)
                // Optional: prevent repeat
                // hardcodedTargets.value = hardcodedTargets.value.filter(t => t.id !== target.id)
            }
        }
    }, { deep: true })

    // NEW: Debug button to force-check current location against hardcoded
    const debugCheckLocation = async () => {
        const current = await shareCurrentLocation()
        if (!current) return

        for (const target of hardcodedTargets.value) {
            const dist = calculateDistance(
                current.latitude,
                current.longitude,
                target.latitude,
                target.longitude
            )

            if (dist < target.threshold) {
                console.log(`DEBUG MATCH! Current location matches: ${target.name} (dist: ${dist.toFixed(6)} km)`)
            } else {
                console.log(`DEBUG: No match for ${target.name} (dist: ${dist.toFixed(6)} km)`)
            }
        }
    }

    const handleStartTracking = async () => {
        const hasPermission = await requestPermission()
        if (hasPermission) {
            startTracking()
            await loadPOIs()
        }
    }

    const handleStopTracking = () => {
        stopTracking()
        proximityNotification.value = null
    }

    const loadPOIs = async () => {
        try {
            allPOIs.value = mockPOIs
        } catch (err) {
            console.error('Error loading POIs:', err)
        }
    }

    const useTestCoordinates = () => {
        coords.value = {
            latitude: testLatitude.value,
            longitude: testLongitude.value,
            accuracy: 10
        }
        isTracking.value = true
        error.value = null
        loadPOIs()
    }

    const dismissNotification = () => {
        proximityNotification.value = null
    }

    const handleNotificationClick = (poi: POI) => {
        selectedPOI.value = poi
        dismissNotification()
    }

    const viewPOIDetails = (poi: POI) => {
        selectedPOI.value = poi
    }

    const closePOIDetails = () => {
        selectedPOI.value = null
    }

    onMounted(() => {
        console.log('LocationDetector mounted')
        console.log('isMobile:', isMobile.value)
    })

    onUnmounted(() => {
        if (isTracking.value) stopTracking()
    })

    return {
        coords,
        isTracking,
        error,
        isMobile,
        startTracking,
        stopTracking,
        requestPermission,
        calculateDistance,
        allPOIs,
        selectedPOI,
        proximityNotification,
        proximityDistance,
        testLatitude,
        testLongitude,
        testProximityDistance,
        nearbyPOIs,
        handleStartTracking,
        handleStopTracking,
        loadPOIs,
        useTestCoordinates,
        dismissNotification,
        handleNotificationClick,
        viewPOIDetails,
        closePOIDetails,
        debugCheckLocation // NEW: expose for button
    }
}