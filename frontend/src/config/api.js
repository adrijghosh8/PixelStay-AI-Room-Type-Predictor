// Central place for backend configuration. Never hardcode the API origin
// anywhere else in the app — import API_BASE_URL / PREDICT_ENDPOINT instead.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const PREDICT_ENDPOINT = `${API_BASE_URL}/predict`;

// Matches the FastAPI Pydantic `Features` model exactly.
export const FEATURE_CONSTRAINTS = {
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
  price: { min: 0.01 },
  minimum_nights: { min: 1, max: 365 },
  number_of_reviews: { min: 0 },
  reviews_per_month: { min: 0 },
  calculated_host_listings_count: { min: 0 },
  availability_365: { min: 0, max: 365 },
};

// A known-valid example listing (NYC-style values) used by "Use Sample Listing".
export const SAMPLE_LISTING = {
  latitude: 40.7128,
  longitude: -74.006,
  price: 150,
  minimum_nights: 3,
  number_of_reviews: 42,
  reviews_per_month: 1.8,
  calculated_host_listings_count: 2,
  availability_365: 180,
  neighbourhood_group: 'Manhattan',
  neighbourhood: 'Chelsea',
};

export const EMPTY_LISTING = {
  latitude: '',
  longitude: '',
  price: '',
  minimum_nights: '',
  number_of_reviews: '',
  reviews_per_month: '',
  calculated_host_listings_count: '',
  availability_365: '',
  neighbourhood_group: '',
  neighbourhood: '',
};
