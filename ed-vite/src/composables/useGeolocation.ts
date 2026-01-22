// src/composables/useGeolocation.ts
import { ref, Ref, computed } from 'vue'

interface GeolocationCoords {
    latitude: number
    longitude: number
    accuracy: number
}

interface GeoLocationState {
    coords: Ref<GeolocationCoords | null>
    isTracking: Ref<boolean>
    error: Ref<string | null>
    isMobile: Ref<boolean>
}

const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const useGeolocation = (): GeoLocationState & {
    startTracking: () => void
    stopTracking: () => void
    requestPermission: () => Promise<boolean>
    calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number
    shareCurrentLocation: () => Promise<GeolocationCoords | null> // NEW: one-time share
} => {
    const coords = ref<GeolocationCoords | null>(null)
    const isTracking = ref(false)
    const error = ref<string | null>(null)
    const isMobile = ref(isMobileDevice())
    let watchId: number | null = null

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371 // km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const requestPermission = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                error.value = 'Geolocation not supported'
                resolve(false)
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    coords.value = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }
                    error.value = null
                    resolve(true)
                },
                (err) => {
                    error.value = `Error: ${err.message}`
                    resolve(false)
                },
                { enableHighAccuracy: true, timeout: 10000 }
            )
        })
    }

    const startTracking = (): void => {
        if (!navigator.geolocation) {
            error.value = 'Geolocation not supported'
            return
        }

        isTracking.value = true
        error.value = null

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                coords.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                }
                error.value = null
            },
            (err) => {
                error.value = `Error: ${err.message}`
                isTracking.value = false
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        )
    }

    const stopTracking = (): void => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId)
            watchId = null
        }
        isTracking.value = false
    }

    // NEW: One-time share current location (for debug button)
    const shareCurrentLocation = (): Promise<GeolocationCoords | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                error.value = 'Geolocation not supported'
                resolve(null)
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }
                    console.log('Shared current location:', currentCoords)
                    resolve(currentCoords)
                },
                (err) => {
                    error.value = `Error sharing location: ${err.message}`
                    resolve(null)
                },
                { enableHighAccuracy: true, timeout: 5000 }
            )
        })
    }

    return {
        coords,
        isTracking,
        error,
        isMobile,
        startTracking,
        stopTracking,
        requestPermission,
        calculateDistance,
        shareCurrentLocation // NEW export
    }
}