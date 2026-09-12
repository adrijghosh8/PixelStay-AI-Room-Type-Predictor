import { FEATURE_CONSTRAINTS } from './api';

// Mirrors the FastAPI Pydantic constraints so the user gets friendly,
// immediate feedback instead of a raw 422 error from the backend.
export function validateListing(values) {
  const errors = {};

  const num = (key) => {
    const v = values[key];
    if (v === '' || v === null || v === undefined) return NaN;
    return Number(v);
  };

  // latitude
  const lat = num('latitude');
  if (values.latitude === '') errors.latitude = 'Required';
  else if (Number.isNaN(lat)) errors.latitude = 'Must be a number';
  else if (lat < FEATURE_CONSTRAINTS.latitude.min || lat > FEATURE_CONSTRAINTS.latitude.max) {
    errors.latitude = `Must be between ${FEATURE_CONSTRAINTS.latitude.min} and ${FEATURE_CONSTRAINTS.latitude.max}`;
  }

  // longitude
  const lng = num('longitude');
  if (values.longitude === '') errors.longitude = 'Required';
  else if (Number.isNaN(lng)) errors.longitude = 'Must be a number';
  else if (lng < FEATURE_CONSTRAINTS.longitude.min || lng > FEATURE_CONSTRAINTS.longitude.max) {
    errors.longitude = `Must be between ${FEATURE_CONSTRAINTS.longitude.min} and ${FEATURE_CONSTRAINTS.longitude.max}`;
  }

  // price
  const price = num('price');
  if (values.price === '') errors.price = 'Required';
  else if (Number.isNaN(price)) errors.price = 'Must be a number';
  else if (price <= 0) errors.price = 'Must be greater than 0';

  // minimum_nights
  const minNights = num('minimum_nights');
  if (values.minimum_nights === '') errors.minimum_nights = 'Required';
  else if (!Number.isInteger(minNights)) errors.minimum_nights = 'Must be a whole number';
  else if (minNights < 1 || minNights > 365) errors.minimum_nights = 'Must be between 1 and 365';

  // number_of_reviews
  const reviews = num('number_of_reviews');
  if (values.number_of_reviews === '') errors.number_of_reviews = 'Required';
  else if (!Number.isInteger(reviews)) errors.number_of_reviews = 'Must be a whole number';
  else if (reviews < 0) errors.number_of_reviews = 'Cannot be negative';

  // reviews_per_month
  const rpm = num('reviews_per_month');
  if (values.reviews_per_month === '') errors.reviews_per_month = 'Required';
  else if (Number.isNaN(rpm)) errors.reviews_per_month = 'Must be a number';
  else if (rpm < 0) errors.reviews_per_month = 'Cannot be negative';

  // calculated_host_listings_count
  const hostListings = num('calculated_host_listings_count');
  if (values.calculated_host_listings_count === '') errors.calculated_host_listings_count = 'Required';
  else if (!Number.isInteger(hostListings)) errors.calculated_host_listings_count = 'Must be a whole number';
  else if (hostListings < 0) errors.calculated_host_listings_count = 'Cannot be negative';

  // availability_365
  const availability = num('availability_365');
  if (values.availability_365 === '') errors.availability_365 = 'Required';
  else if (!Number.isInteger(availability)) errors.availability_365 = 'Must be a whole number';
  else if (availability < 0 || availability > 365) errors.availability_365 = 'Must be between 0 and 365';

  // neighbourhood_group
  if (!values.neighbourhood_group) errors.neighbourhood_group = 'Required';

  // neighbourhood
  if (!values.neighbourhood || !values.neighbourhood.trim()) errors.neighbourhood = 'Required';

  return errors;
}

// Converts form-state strings into the exact numeric payload FastAPI expects.
export function buildPayload(values) {
  return {
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    price: Number(values.price),
    minimum_nights: Number(values.minimum_nights),
    number_of_reviews: Number(values.number_of_reviews),
    reviews_per_month: Number(values.reviews_per_month),
    calculated_host_listings_count: Number(values.calculated_host_listings_count),
    availability_365: Number(values.availability_365),
    neighbourhood_group: values.neighbourhood_group,
    neighbourhood: values.neighbourhood,
  };
}
