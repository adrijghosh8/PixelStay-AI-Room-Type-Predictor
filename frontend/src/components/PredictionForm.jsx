import { useState } from 'react';
import InputField from './InputField';
import NeighbourhoodCombobox from './NeighbourhoodCombobox';
import LocationScanner from './LocationScanner';
import PredictButton from './PredictButton';
import LoadingState from './LoadingState';
import PredictionResult from './PredictionResult';
import ErrorPanel from './ErrorPanel';
import { EMPTY_LISTING, SAMPLE_LISTING } from '../config/api';
import { validateListing, buildPayload } from '../config/validation';
import { requestPrediction, PredictionError } from '../config/predictApi';
import { NEIGHBOURHOOD_GROUPS, NEIGHBOURHOODS } from '../data/neighbourhoods';
import '../styles/predictionForm.css';

export default function PredictionForm() {
  const [values, setValues] = useState(EMPTY_LISTING);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [errorKind, setErrorKind] = useState(null);

  const setField = (key) => (eOrValue) => {
    const value = typeof eOrValue === 'object' && eOrValue?.target ? eOrValue.target.value : eOrValue;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleUseSample = () => {
    setValues(SAMPLE_LISTING);
    setErrors({});
    setStatus('idle');
    setResult(null);
  };

  const handleReset = () => {
    setValues(EMPTY_LISTING);
    setErrors({});
    setStatus('idle');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateListing(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('loading');
    setErrorKind(null);
    try {
      const payload = buildPayload(values);
      const data = await requestPrediction(payload);
      setResult(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorKind(err instanceof PredictionError ? err.kind : 'server');
    }
  };

  return (
    <section className="prediction" id="predict">
      <div className="container prediction__inner">
        <div className="prediction__intro">
          <p className="prediction__eyebrow pixel-heading">Listing Configuration</p>
          <p className="prediction__desc">
            Enter the property details to let the model determine the most likely room type.
          </p>
        </div>

        <form className="prediction__panel pixel-border" onSubmit={handleSubmit} noValidate>
          <div className="prediction__grid">
            <div className="prediction__col">
              <InputField
                id="latitude"
                label="Latitude"
                type="number"
                step="any"
                placeholder="40.7128"
                value={values.latitude}
                onChange={setField('latitude')}
                error={errors.latitude}
              />
              <InputField
                id="longitude"
                label="Longitude"
                type="number"
                step="any"
                placeholder="-74.0060"
                value={values.longitude}
                onChange={setField('longitude')}
                error={errors.longitude}
              />
              <LocationScanner latitude={values.latitude} longitude={values.longitude} />
            </div>

            <div className="prediction__col">
              <InputField
                id="price"
                label="Price / Night"
                unit="USD"
                type="number"
                step="0.01"
                min="0.01"
                prefix="$"
                placeholder="150"
                value={values.price}
                onChange={setField('price')}
                error={errors.price}
              />
              <InputField
                id="minimum_nights"
                label="Minimum Nights"
                type="number"
                step="1"
                min="1"
                max="365"
                placeholder="3"
                value={values.minimum_nights}
                onChange={setField('minimum_nights')}
                error={errors.minimum_nights}
              />
              <InputField
                id="number_of_reviews"
                label="Number of Reviews"
                type="number"
                step="1"
                min="0"
                placeholder="42"
                value={values.number_of_reviews}
                onChange={setField('number_of_reviews')}
                error={errors.number_of_reviews}
              />
              <InputField
                id="reviews_per_month"
                label="Reviews / Month"
                type="number"
                step="0.01"
                min="0"
                placeholder="1.8"
                value={values.reviews_per_month}
                onChange={setField('reviews_per_month')}
                error={errors.reviews_per_month}
              />
            </div>

            <div className="prediction__col">
              <InputField
                id="calculated_host_listings_count"
                label="Host Listings"
                type="number"
                step="1"
                min="0"
                placeholder="2"
                value={values.calculated_host_listings_count}
                onChange={setField('calculated_host_listings_count')}
                error={errors.calculated_host_listings_count}
              />

              <div className={`field ${errors.availability_365 ? 'field--error' : ''}`}>
                <label htmlFor="availability_365" className="field__label">
                  Availability <span className="field__unit">(days / year)</span>
                </label>
                <input
                  id="availability_365"
                  type="range"
                  min="0"
                  max="365"
                  step="1"
                  value={values.availability_365 === '' ? 0 : values.availability_365}
                  onChange={setField('availability_365')}
                  className="prediction__slider"
                />
                <p className="prediction__slider-value">{values.availability_365 || 0} / 365 days</p>
                {errors.availability_365 && (
                  <p className="field__error" role="alert">
                    {errors.availability_365}
                  </p>
                )}
              </div>

              <div className={`field ${errors.neighbourhood_group ? 'field--error' : ''}`}>
                <label htmlFor="neighbourhood_group" className="field__label">
                  Neighbourhood Group
                </label>
                <select
                  id="neighbourhood_group"
                  className="field__select"
                  value={values.neighbourhood_group}
                  onChange={setField('neighbourhood_group')}
                >
                  <option value="">Select a borough…</option>
                  {NEIGHBOURHOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.neighbourhood_group && (
                  <p className="field__error" role="alert">
                    {errors.neighbourhood_group}
                  </p>
                )}
              </div>

              <NeighbourhoodCombobox
                id="neighbourhood"
                value={values.neighbourhood}
                onChange={setField('neighbourhood')}
                options={NEIGHBOURHOODS}
                error={errors.neighbourhood}
              />
            </div>
          </div>

          <div className="prediction__actions">
            <button type="button" className="prediction__ghost-btn" onClick={handleUseSample}>
              Use Sample Listing
            </button>
            <button type="button" className="prediction__ghost-btn" onClick={handleReset}>
              Reset
            </button>
          </div>

          <PredictButton disabled={status === 'loading'} loading={status === 'loading'} />
        </form>

        <div className="prediction__result-slot">
          {status === 'loading' && <LoadingState />}
          {status === 'error' && (
            <ErrorPanel kind={errorKind} onRetry={() => setStatus('idle')} />
          )}
          {status === 'success' && result && <PredictionResult result={result} />}
        </div>
      </div>
    </section>
  );
}
