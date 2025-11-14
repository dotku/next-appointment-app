"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@nextui-org/react";

/**
 * AddressAutocomplete Component
 * Uses Google Places API (New) - HTTP REST API
 * Provides dropdown suggestions as user types (with 500ms debounce)
 * 
 * @param {string} value - Current address value
 * @param {function} onChange - Callback when address text changes
 * @param {function} onPlaceSelect - Callback when a place is selected (receives {address, lat, lng})
 * @param {string} placeholder - Input placeholder
 * @param {boolean} isRequired - Whether the field is required
 */
export default function AddressAutocomplete({ 
  value, 
  onChange, 
  onPlaceSelect,
  placeholder = "Start typing address...",
  isRequired = false 
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const debounceTimerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const sessionTokenRef = useRef(null);

  // Sync external value to internal state
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Generate a unique session token (for billing optimization)
  useEffect(() => {
    // Generate a random session token
    sessionTokenRef.current = Math.random().toString(36).substring(2, 15);
    console.log("🎫 Session token generated:", sessionTokenRef.current);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch address suggestions using Places API (New) - Autocomplete
  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found");
      setError("Google Maps API key not configured");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔍 Fetching suggestions for:", input);

      // Use Places API (New) - Autocomplete
      const response = await fetch(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey
          },
          body: JSON.stringify({
            input: input,
            includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
            sessionToken: sessionTokenRef.current
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Places API error:", response.status, errorText);
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.suggestions && data.suggestions.length > 0) {
        console.log(`✅ Found ${data.suggestions.length} suggestions`);
        setSuggestions(data.suggestions);
        setShowDropdown(true);
      } else {
        console.log("⚠️ No suggestions found");
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("❌ Error fetching suggestions:", error);
      setSuggestions([]);
      setShowDropdown(false);
      
      // Show user-friendly error
      if (error.message.includes('403')) {
        setError("Places API (New) not enabled. Please enable it in Google Cloud Console.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    setError(null);

    if (onChange) {
      onChange(newValue);
    }

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer (500ms)
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 500);
  }, [onChange, fetchSuggestions]);

  // Get place details using Places API (New) - Place Details
  const getPlaceDetails = useCallback(async (placeId, displayText) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("❌ API key not found");
      return;
    }

    console.log("🌍 Getting place details for:", displayText);

    try {
      // Use Places API (New) - Place Details
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'formattedAddress,location'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Place Details error:", response.status, errorText);
        throw new Error(`Place Details error: ${response.status}`);
      }

      const data = await response.json();

      if (data.formattedAddress && data.location) {
        const address = data.formattedAddress;
        const lat = data.location.latitude;
        const lng = data.location.longitude;

        console.log("✅ Place details retrieved:", { address, lat, lng });

        // Update input
        setInputValue(address);
        if (onChange) {
          onChange(address);
        }

        // Call parent callback
        if (onPlaceSelect) {
          onPlaceSelect({
            address: address,
            lat: lat,
            lng: lng,
            placeDetails: data
          });
        }

        // Generate new session token for next search
        sessionTokenRef.current = Math.random().toString(36).substring(2, 15);
      } else {
        console.error("❌ Incomplete place details");
      }
    } catch (error) {
      console.error("❌ Error getting place details:", error);
    }
  }, [onChange, onPlaceSelect]);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion) => {
    setShowDropdown(false);
    setSuggestions([]);
    
    // Get place details
    if (suggestion.placePrediction?.placeId) {
      getPlaceDetails(
        suggestion.placePrediction.placeId,
        suggestion.placePrediction.text.text
      );
    }
  }, [getPlaceDetails]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSuggestions([]);
        break;
    }
  }, [showDropdown, suggestions, selectedIndex, handleSelectSuggestion]);

  if (error) {
    return (
      <div>
        <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">⚠️ {error}</p>
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          isRequired={isRequired}
          variant="bordered"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div ref={inputRef}>
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          isRequired={isRequired}
          variant="bordered"
          classNames={{
            input: "text-sm",
            inputWrapper: "h-10"
          }}
          endContent={
            isLoading && (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )
          }
        />
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;
            const mainText = prediction?.structuredFormat?.mainText?.text || prediction?.text?.text || '';
            const secondaryText = prediction?.structuredFormat?.secondaryText?.text || '';
            
            return (
              <div
                key={prediction?.placeId || index}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-blue-50 ${
                  index === selectedIndex ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium text-gray-900">
                  {mainText}
                </div>
                {secondaryText && (
                  <div className="text-xs text-gray-500">
                    {secondaryText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500">
        💡 Start typing address (min 3 characters) - Using Places API (New)
      </p>
    </div>
  );
}

