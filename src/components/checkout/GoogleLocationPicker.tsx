import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { LocateFixed, LoaderCircle, MapPin, Search, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { DELIVERY_RADIUS_METERS, distanceInMeters, getDrivingDistanceMeters, getGoogleMapsCoordinates, OUTLET_LOCATION } from '@/lib/deliveryArea'

type Coordinates = [number, number]
type MapProvider = 'google' | 'leaflet'

declare global {
  interface Window {
    gm_authFailure?: () => void
  }
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ''
let googleMapsLoadPromise: Promise<void> | null = null

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof google !== 'undefined' && google.maps?.Map) return Promise.resolve()
  if (!googleMapsLoadPromise) {
    setOptions({ key: apiKey, v: 'weekly' })
    googleMapsLoadPromise = importLibrary('maps').then(() => undefined)
  }
  return googleMapsLoadPromise
}

interface PhotonPlaceSearchResult {
  id: string
  label: string
  coordinates: Coordinates
  provider: 'photon'
}

interface GooglePlaceSearchResult {
  id: string
  label: string
  prediction: google.maps.places.PlacePrediction
  provider: 'google'
}

type PlaceSearchResult = PhotonPlaceSearchResult | GooglePlaceSearchResult

interface PhotonResponse {
  features: {
    geometry: { coordinates: [number, number] }
    properties: {
      osm_id?: number
      name?: string
      street?: string
      suburb?: string
      district?: string
      city?: string
      county?: string
      state?: string
      country?: string
    }
  }[]
}

async function searchWithPhoton(query: string, signal: AbortSignal): Promise<PhotonPlaceSearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    limit: '10',
    lat: String(OUTLET_LOCATION[0]),
    lon: String(OUTLET_LOCATION[1]),
    zoom: '10',
  })
  const response = await fetch(`https://photon.komoot.io/api/?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) throw new Error('Location search is temporarily unavailable.')

  const payload = await response.json() as PhotonResponse
  return payload.features.map((feature, index) => {
    const place = feature.properties
    const label = [place.name, place.street, place.suburb, place.city ?? place.district ?? place.county, place.state, place.country]
      .filter((part, partIndex, parts): part is string => !!part && parts.indexOf(part) === partIndex)
      .join(', ')
    const [longitude, latitude] = feature.geometry.coordinates
    return {
      id: String(place.osm_id ?? `${latitude},${longitude},${index}`),
      label,
      coordinates: [latitude, longitude] as Coordinates,
      provider: 'photon' as const,
    }
  }).filter((result) => result.label
    && distanceInMeters(OUTLET_LOCATION, result.coordinates) <= DELIVERY_RADIUS_METERS)
}

const selectedMarker = L.divIcon({
  className: 'selected-location-marker',
  html: '<span style="display:block;width:18px;height:18px;border:3px solid white;border-radius:50%;background:#c26e58;box-shadow:0 1px 5px rgba(0,0,0,.5)"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function MapClickHandler({ onSelect }: { onSelect: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click: (event) => onSelect([event.latlng.lat, event.latlng.lng]),
  })
  return null
}

function RecenterMap({ center, zoom }: { center: Coordinates; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, map, zoom])
  return null
}

interface GoogleMapViewProps {
  center: Coordinates
  selected: Coordinates | null
  onSelect: (coordinates: Coordinates) => void
  onReady: () => void
  onError: () => void
}

function GoogleMapView({ center, selected, onSelect, onReady, onError }: GoogleMapViewProps) {
  const mapElement = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const marker = useRef<google.maps.Marker | null>(null)
  const centerRef = useRef(center)
  const selectedRef = useRef(selected)
  const onSelectRef = useRef(onSelect)
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)

  centerRef.current = center
  selectedRef.current = selected
  onSelectRef.current = onSelect
  onReadyRef.current = onReady
  onErrorRef.current = onError

  useEffect(() => {
    const element = mapElement.current
    if (!element) return

    let active = true
    let clickListener: google.maps.MapsEventListener | null = null
    let outletMarker: google.maps.Marker | null = null
    let deliveryArea: google.maps.Circle | null = null
    const previousAuthFailure = window.gm_authFailure
    window.gm_authFailure = () => {
      previousAuthFailure?.()
      if (active) onErrorRef.current()
    }

    void loadGoogleMaps(googleMapsApiKey).then(() => {
      if (!active) return
      const initialCenter = centerRef.current
      const initialSelected = selectedRef.current

      const googleMap = new google.maps.Map(element, {
        center: { lat: initialCenter[0], lng: initialCenter[1] },
        zoom: initialSelected ? 15 : 12,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
      })
      map.current = googleMap
      outletMarker = new google.maps.Marker({
        map: googleMap,
        position: { lat: OUTLET_LOCATION[0], lng: OUTLET_LOCATION[1] },
        title: 'Udupi Garden outlet',
      })
      deliveryArea = new google.maps.Circle({
        map: googleMap,
        center: { lat: OUTLET_LOCATION[0], lng: OUTLET_LOCATION[1] },
        radius: DELIVERY_RADIUS_METERS,
        strokeColor: '#c26e58',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#d98a76',
        fillOpacity: 0.12,
      })
      clickListener = googleMap.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) onSelectRef.current([event.latLng.lat(), event.latLng.lng()])
      })
      if (initialSelected) {
        marker.current = new google.maps.Marker({
          map: googleMap,
          position: { lat: initialSelected[0], lng: initialSelected[1] },
          title: 'Selected delivery location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#c26e58',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        })
      }
      onReadyRef.current()
    }).catch(() => {
      if (active) onErrorRef.current()
    })

    return () => {
      active = false
      window.gm_authFailure = previousAuthFailure
      clickListener?.remove()
      outletMarker?.setMap(null)
      deliveryArea?.setMap(null)
      marker.current?.setMap(null)
      marker.current = null
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.setCenter({ lat: center[0], lng: center[1] })
    map.current.setZoom(selected ? 15 : 12)

    if (selected) {
      marker.current ??= new google.maps.Marker({
        map: map.current,
        title: 'Selected delivery location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#c26e58',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      })
      marker.current.setPosition({ lat: selected[0], lng: selected[1] })
    } else {
      marker.current?.setMap(null)
      marker.current = null
    }
  }, [center, selected])

  return <div ref={mapElement} className="h-full w-full" aria-label="Google Maps delivery location picker" />
}

interface GoogleLocationPickerProps {
  value: string
  drivingDistanceMeters: number | null
  onSelect: (location: string, drivingDistanceMeters: number) => void
  onClose: () => void
}

export function GoogleLocationPicker({ value, drivingDistanceMeters, onSelect, onClose }: GoogleLocationPickerProps) {
  const [mapProvider, setMapProvider] = useState<MapProvider>(googleMapsApiKey ? 'google' : 'leaflet')
  const [googleMapLoading, setGoogleMapLoading] = useState(!!googleMapsApiKey)
  const [mapFallbackMessage, setMapFallbackMessage] = useState(
    googleMapsApiKey ? '' : 'Google Maps API key is not configured; showing OpenStreetMap instead.',
  )
  const savedCoordinates = getGoogleMapsCoordinates(value)
  const savedLocationIsInArea = savedCoordinates !== null
    && drivingDistanceMeters !== null
    && drivingDistanceMeters <= DELIVERY_RADIUS_METERS
  const [selected, setSelected] = useState<Coordinates | null>(savedLocationIsInArea ? savedCoordinates : null)
  const [center, setCenter] = useState<Coordinates>(savedLocationIsInArea && savedCoordinates ? savedCoordinates : OUTLET_LOCATION)
  const [selectedDistance, setSelectedDistance] = useState<number | null>(savedLocationIsInArea ? drivingDistanceMeters : null)
  const [locationError, setLocationError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([])
  const [selectedLabel, setSelectedLabel] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isCheckingRoute, setIsCheckingRoute] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const searchController = useRef<AbortController | null>(null)
  const autocompleteSessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const routeCheckId = useRef(0)

  useEffect(() => () => {
    routeCheckId.current += 1
  }, [])

  useEffect(() => {
    const query = searchQuery.trim()
    searchController.current?.abort()
    setSearchResults([])
    setLocationError('')

    if (query.length < 3) {
      if (query.length === 0) autocompleteSessionToken.current = null
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    searchController.current = controller

    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        let results: PlaceSearchResult[]
        if (mapProvider === 'google') {
          const placesLibrary = await importLibrary('places')
          if (controller.signal.aborted) return

          const sessionToken = autocompleteSessionToken.current
            ?? (autocompleteSessionToken.current = new placesLibrary.AutocompleteSessionToken())
          const { suggestions } = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
            locationBias: {
              center: { lat: OUTLET_LOCATION[0], lng: OUTLET_LOCATION[1] },
              radius: DELIVERY_RADIUS_METERS,
            },
            origin: { lat: OUTLET_LOCATION[0], lng: OUTLET_LOCATION[1] },
            includedRegionCodes: ['in'],
            language: 'en',
            region: 'in',
            sessionToken,
          })
          results = suggestions.flatMap(({ placePrediction }) => {
            if (!placePrediction) return []
            if (placePrediction.distanceMeters !== null
              && placePrediction.distanceMeters > DELIVERY_RADIUS_METERS) return []
            return [{
              id: placePrediction.placeId,
              label: placePrediction.text.toString(),
              prediction: placePrediction,
              provider: 'google',
            }]
          })
        } else {
          results = await searchWithPhoton(query, controller.signal)
        }

        if (!controller.signal.aborted) {
          setSearchResults(results)
          if (results.length === 0) {
            setLocationError(mapProvider === 'google'
              ? 'No Google Maps places found within 15 km of Udupi Garden. Try a nearby street or landmark.'
              : 'No matching places found within 15 km of Udupi Garden. Try a nearby area or landmark.')
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (controller.signal.aborted) return
        if (mapProvider === 'google') {
          try {
            const fallbackResults = await searchWithPhoton(query, controller.signal)
            if (controller.signal.aborted) return
            setSearchResults(fallbackResults)
            setLocationError(fallbackResults.length > 0
              ? 'Google Places is unavailable; showing OpenStreetMap results. Enable Places API (New) for Google search.'
              : 'Google Places is unavailable and no nearby OpenStreetMap places matched. Enable Places API (New) or try a nearby street.')
          } catch (fallbackError) {
            if (fallbackError instanceof DOMException && fallbackError.name === 'AbortError') return
            setLocationError(fallbackError instanceof Error
              ? `Google Places failed and ${fallbackError.message.toLowerCase()}`
              : 'Google Places and OpenStreetMap search are unavailable. Please try again later.')
          }
        } else {
          setLocationError(error instanceof Error ? error.message : 'Could not search for that location.')
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [mapProvider, searchQuery])

  const checkAndSelectLocation = async (coordinates: Coordinates, label: string) => {
    if (distanceInMeters(OUTLET_LOCATION, coordinates) > DELIVERY_RADIUS_METERS) {
      setLocationError('This location is beyond the 15 km outer boundary from Udupi Garden.')
      return
    }

    const requestId = ++routeCheckId.current
    setIsCheckingRoute(true)
    setLocationError('Checking driving distance from Udupi Garden...')
    const distance = await getDrivingDistanceMeters(coordinates)
    if (requestId !== routeCheckId.current) return
    setIsCheckingRoute(false)

    if (distance === null) {
      setLocationError('Could not verify the driving route. Please try selecting the location again.')
      return
    }
    if (distance > DELIVERY_RADIUS_METERS) {
      setLocationError(`This location is ${ (distance / 1000).toFixed(1) } km by road, outside the 15 km delivery limit.`)
      return
    }

    setSelected(coordinates)
    setSelectedDistance(distance)
    setCenter(coordinates)
    setSelectedLabel(label)
    setSearchResults([])
    setLocationError('')
  }

  const useCurrentLocation = () => {
    setLocationError('')
    if (!window.isSecureContext) {
      setLocationError('Current location requires HTTPS or localhost.')
      return
    }
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support location access.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates: Coordinates = [coords.latitude, coords.longitude]
        setIsLocating(false)
        setSearchResults([])
        setSelected(null)
        setSelectedDistance(null)
        setSelectedLabel('')
        setCenter(coordinates)
        void checkAndSelectLocation(coordinates, 'Current location')
      },
      (error) => {
        setIsLocating(false)
        if (error.code === 1) {
          setLocationError('Location permission was denied. Allow location access in your browser settings, then try again.')
        } else if (error.code === 2) {
          setLocationError('Your location is unavailable. Check your device location services and try again.')
        } else if (error.code === 3) {
          setLocationError('Getting your location timed out. Please try again.')
        } else {
          setLocationError('Could not get your current location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    )
  }

  const selectSearchResult = async (result: PlaceSearchResult) => {
    setSearchResults([])
    if (result.provider === 'photon') {
      void checkAndSelectLocation(result.coordinates, result.label)
      return
    }

    setIsSearching(true)
    try {
      const place = result.prediction.toPlace()
      await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] })
      if (!place.location) {
        setLocationError('Google Maps did not return a location for this place. Try another result.')
        return
      }

      const coordinates: Coordinates = [place.location.lat(), place.location.lng()]
      const label = place.formattedAddress ?? place.displayName ?? result.label
      setCenter(coordinates)
      void checkAndSelectLocation(coordinates, label)
    } catch {
      setLocationError('Could not load this Google Maps place. Try another result.')
    } finally {
      autocompleteSessionToken.current = null
      setIsSearching(false)
    }
  }

  const selectMapLocation = (coordinates: Coordinates) => {
    void checkAndSelectLocation(coordinates, 'Selected delivery location')
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/60 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="flex max-h-[calc(100dvh-24px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-paper shadow-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-3 sm:px-6">
          <div>
            <h2 id="location-picker-title" className="font-serif text-xl font-bold text-ink">Choose your delivery location</h2>
            <p className="mt-1 text-sm text-ink-soft">Every selection is checked for a driving route within 15 km of Udupi Garden, BTM 1st Stage.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close map" className="rounded-full p-2 text-ink-soft hover:bg-ink/5">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="relative z-10 border-b border-ink/10 px-4 py-3 sm:px-6">
          <label className="sr-only" htmlFor="location-search">Search for a place</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              id="location-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search within Udupi Garden delivery area"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={searchResults.length > 0}
              aria-controls="location-search-results"
              className="h-11 w-full rounded-md border border-ink/20 bg-white py-2 pl-10 pr-10 text-sm text-ink outline-none focus:border-coral-deep focus:ring-2 focus:ring-coral/20"
            />
            {isSearching && <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-soft" aria-label="Searching locations" />}
          </div>
        </div>

        {searchResults.length > 0 && (
          <ul id="location-search-results" role="listbox" aria-label="Location search results" className="max-h-36 shrink-0 divide-y divide-ink/10 overflow-y-auto border-b border-ink/10">
            {searchResults.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => selectSearchResult(result)}
                  className="w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-lavender sm:px-6"
                >
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="relative h-[40vh] min-h-52 shrink-0 sm:h-[min(50vh,460px)]">
          {mapProvider === 'google' ? (
            <>
              <GoogleMapView
                center={center}
                selected={selected}
                onSelect={selectMapLocation}
                onReady={() => setGoogleMapLoading(false)}
                onError={() => {
                  setMapProvider('leaflet')
                  setGoogleMapLoading(false)
                  setMapFallbackMessage('Google Maps could not be loaded; showing OpenStreetMap instead.')
                }}
              />
              {googleMapLoading && (
                <div className="absolute inset-0 z-[400] flex items-center justify-center gap-2 bg-paper/80 text-sm text-ink-soft">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Loading Google Maps...
                </div>
              )}
            </>
          ) : (
            <MapContainer center={center} zoom={selected ? 15 : 12} className="h-full w-full" scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onSelect={selectMapLocation} />
              <Circle center={OUTLET_LOCATION} radius={DELIVERY_RADIUS_METERS} pathOptions={{ color: '#c26e58', fillColor: '#d98a76', fillOpacity: 0.12, weight: 2 }} />
              <Marker position={OUTLET_LOCATION} />
              {selected && <Marker position={selected} icon={selectedMarker} />}
              <RecenterMap center={center} zoom={selected ? 15 : 12} />
            </MapContainer>
          )}
          <div className="absolute right-3 top-3 z-[500] flex gap-2">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={isLocating || isCheckingRoute}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-paper px-3 text-xs font-semibold text-ink shadow-md hover:bg-cream disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Use my current location"
              title="Use my current location"
            >
              {isLocating || isCheckingRoute ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              {isLocating ? 'Locating...' : isCheckingRoute ? 'Checking...' : 'Use my location'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCenter(OUTLET_LOCATION)
                setLocationError('')
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-paper text-ink shadow-md hover:bg-cream"
              aria-label="Center map on Udupi Garden outlet"
              title="Center map on Udupi Garden outlet"
            >
              <LocateFixed className="h-5 w-5" />
            </button>
          </div>
        </div>

        <footer className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0 text-sm text-ink-soft" aria-live="polite">
            {mapFallbackMessage && <p className="mb-1 text-xs text-coral-deep">{mapFallbackMessage}</p>}
            {isCheckingRoute ? (
              <span className="inline-flex items-center gap-1.5"><LoaderCircle className="h-4 w-4 animate-spin" /> Checking road distance...</span>
            ) : locationError ? (
              <span className="text-coral-deep">{locationError}</span>
            ) : selected ? (
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0 text-coral-deep" /> {selectedLabel || 'Pin selected'} · {((selectedDistance ?? 0) / 1000).toFixed(1)} km by road</span>
            ) : (
              'No location selected'
            )}
          </div>
          <button
            type="button"
            disabled={!selected || selectedDistance === null || selectedDistance > DELIVERY_RADIUS_METERS || isCheckingRoute}
            onClick={() => {
              if (!selected || selectedDistance === null) return
              onSelect(`https://www.google.com/maps?q=${selected[0]},${selected[1]}`, selectedDistance)
            }}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-bold text-paper hover:bg-coral-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MapPin className="h-4 w-4" />
            Use this location
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  )
}