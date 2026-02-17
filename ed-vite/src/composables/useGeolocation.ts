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
} => {
    const coords = ref<GeolocationCoords | null>(null)
    const isTracking = ref(false)
    const error = ref<string | null>(null)
    const isMobile = ref(isMobileDevice())
    let watchId: number | null = null

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371 // Aardstraal in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c // Afstand in km
    }

    const requestPermission = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                error.value = 'Geolocation is niet ondersteund op dit apparaat'
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
                    error.value = `Fout: ${err.message}`
                    resolve(false)
                },
                { enableHighAccuracy: true, timeout: 10000 }
            )
        })
    }

    const startTracking = (): void => {
        if (!navigator.geolocation) {
            error.value = 'Geolocation is niet ondersteund'
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
                error.value = `Fout: ${err.message}`
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

    return {
        coords,
        isTracking,
        error,
        isMobile,
        startTracking,
        stopTracking,
        requestPermission,
        calculateDistance
    }
}
