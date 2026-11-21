export const OUTLET_LOCATION: [number, number] = [12.9181179, 77.6104988]
export const DELIVERY_RADIUS_METERS = 15_000
const drivingDistanceCache = new Map<string, number>()

export function getGoogleMapsCoordinates(location: string): [number, number] | null {
  const match = location.match(/(?:q=|@)(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/)
  if (!match) return null

  const latitude = Number(match[1])
  const longitude = Number(match[2])
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null
  return [latitude, longitude]
}

export function distanceInMeters(first: [number, number], second: [number, number]): number {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const [firstLatitude, firstLongitude] = first.map(radians)
  const [secondLatitude, secondLongitude] = second.map(radians)
  const latitudeDelta = secondLatitude - firstLatitude
  const longitudeDelta = secondLongitude - firstLongitude
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export async function getDrivingDistanceMeters(destination: [number, number]): Promise<number | null> {
  const cacheKey = `${destination[0].toFixed(6)},${destination[1].toFixed(6)}`
  const cachedDistance = drivingDistanceCache.get(cacheKey)
  if (cachedDistance !== undefined) return cachedDistance

  const [latitude, longitude] = destination
  const [outletLatitude, outletLongitude] = OUTLET_LOCATION
  const url = `https://router.project-osrm.org/route/v1/driving/${outletLongitude},${outletLatitude};${longitude},${latitude}?overview=false`

  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const route = await response.json() as { code?: string; routes?: { distance: number }[] }
    const distance = route.code === 'Ok' ? route.routes?.[0]?.distance : undefined
    if (typeof distance !== 'number' || !Number.isFinite(distance)) return null
    drivingDistanceCache.set(cacheKey, distance)
    return distance
  } catch {
    return null
  }
}

export function isWithinDeliveryArea(location: string, drivingDistanceMeters: number | null | undefined): boolean {
  return getGoogleMapsCoordinates(location) !== null
    && typeof drivingDistanceMeters === 'number'
    && drivingDistanceMeters <= DELIVERY_RADIUS_METERS
}