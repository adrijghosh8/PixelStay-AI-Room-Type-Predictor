// The backend's /predict endpoint returns a plain probability array with no
// class names attached (see the FastAPI handler: `probability.tolist()[0]`).
//
// To label that array correctly we inspected the shipped Model_Pipeline.pkl
// directly rather than guessing an ordering:
//
//   pipeline.named_steps['model'].classes_
//   -> array(['Entire home/apt', 'Private room', 'Shared room'], dtype=object)
//
// scikit-learn's predict_proba() always returns columns in exactly this
// `classes_` order, so index 0 of the Probability array is "Entire home/apt",
// index 1 is "Private room", index 2 is "Shared room".
//
// This mapping is kept in one place and clearly labeled so that if the model
// is ever retrained with a different class set, updating this array (and
// nothing else) keeps the UI correct. If you retrain the pipeline, re-run
// `pipeline.named_steps['model'].classes_` and paste the new order here.
export const ROOM_TYPE_CLASSES = [
  {
    key: 'Entire home/apt',
    label: 'ENTIRE HOME/APT',
    short: 'Entire Home',
    color: 'var(--cyan-glow)',
  },
  {
    key: 'Private room',
    label: 'PRIVATE ROOM',
    short: 'Private Room',
    color: 'var(--window-warm)',
  },
  {
    key: 'Shared room',
    label: 'SHARED ROOM',
    short: 'Shared Room',
    color: 'var(--brick)',
  },
];

// Given a raw predicted_room_type string from the backend, find its display info.
// Falls back gracefully if the backend ever returns a class we don't recognise,
// rather than silently mislabeling it.
export function getClassDisplay(key) {
  const found = ROOM_TYPE_CLASSES.find((c) => c.key === key);
  if (found) return found;
  return {
    key: key ?? 'unknown',
    label: (key ?? 'UNKNOWN').toString().toUpperCase(),
    short: key ?? 'Unknown',
    color: 'var(--cream)',
  };
}

// Pairs a Probability[] array (assumed to be in classes_ order above) with
// their labels. If the array length doesn't match what we expect, we still
// render it defensively using generic labels instead of crashing.
export function zipProbabilities(probabilityArray) {
  if (!Array.isArray(probabilityArray)) return [];
  if (probabilityArray.length === ROOM_TYPE_CLASSES.length) {
    return ROOM_TYPE_CLASSES.map((cls, i) => ({
      ...cls,
      probability: probabilityArray[i],
    }));
  }
  // Defensive fallback: unexpected shape from the backend/model.
  return probabilityArray.map((p, i) => ({
    key: `class_${i}`,
    label: `CLASS ${i + 1}`,
    short: `Class ${i + 1}`,
    color: 'var(--cream)',
    probability: p,
  }));
}
