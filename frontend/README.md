# PixelStay — AI Room Type Predictor

A pixel-art / voxel-inspired frontend for an existing Airbnb room-type
prediction model. It sends listing details to a FastAPI `/predict` endpoint
and renders the returned room type and class probabilities. No prediction
logic runs in the browser — every result comes from the real backend.

## Running it

1. Make sure your FastAPI backend (with `Model_Pipeline.pkl` alongside it) is
   running, e.g. on `http://localhost:8000`.
2. In this folder:

   ```bash
   npm install
   npm run dev
   ```

3. Open the printed local URL. The top-right status badge pings the
   backend's `GET /` route every few seconds and shows Online/Offline for
   real — it's not a hardcoded label.

If your backend runs somewhere other than `http://localhost:8000`, copy
`.env.example` to `.env` and set `VITE_API_URL` accordingly.

## About the class ordering

The backend's `/predict` response only returns a raw `Probability` array —
no class names attached. Rather than guess the order, the pipeline was
inspected directly:

```python
pipeline.named_steps['model'].classes_
# -> array(['Entire home/apt', 'Private room', 'Shared room'], dtype=object)
```

scikit-learn's `predict_proba()` always returns columns in this exact
`classes_` order, so that's the mapping used in
`src/data/classLabels.js`. If you ever retrain the model with a different
class set, re-run that line and update the array there — it's the only
place this mapping lives.

## About the neighbourhood fields

The trained `OneHotEncoder` was also inspected to get the real
`neighbourhood_group` (5 boroughs) and `neighbourhood` (218 values) categories
the model was fit on — see `src/data/neighbourhoods.js`. The encoder stores
these two columns independently, so there's no verified borough ↔
neighbourhood mapping inside the model itself. Rather than invent a
potentially wrong mapping, the two fields are presented as independent
selections, exactly as the backend/model pipeline expects them.

## Project structure

```
src/
  components/   UI components (form, background, result panel, etc.)
  config/       API base URL, validation, fetch client
  data/         Model-derived constants (class labels, neighbourhoods)
  hooks/        Small reusable hooks (parallax, backend status, PRNG)
  styles/       Per-component CSS + global design tokens
```

## Notes

- Validation mirrors the backend's Pydantic constraints
  (`src/config/validation.js`) so obviously invalid listings are caught
  before hitting the network.
- Errors are classified (network / timeout / validation / server /
  malformed) and shown as friendly in-universe messages instead of raw
  stack traces.
- Background animations respect `prefers-reduced-motion`.
