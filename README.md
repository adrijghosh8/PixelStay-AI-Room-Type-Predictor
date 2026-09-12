# 🏙️ PixelStay — AI-Powered NYC Airbnb Room Type Predictor

PixelStay is a full-stack machine learning web application that predicts the **Airbnb room type** for a listing based on its location, pricing, availability, reviews, and neighbourhood information.

The application combines a **React + Vite frontend**, a **FastAPI backend**, and a trained **scikit-learn machine learning pipeline** to provide real-time predictions through a clean pixel-art inspired interface.

---

## ✨ Features

* 🤖 **Machine Learning Predictions** — Predicts the Airbnb room type using a trained scikit-learn pipeline.
* 📍 **NYC Location Inputs** — Supports latitude, longitude, borough, and neighbourhood information.
* 💰 **Listing Analysis** — Uses price, minimum nights, reviews, host listings, and availability.
* 📊 **Prediction Probabilities** — Displays the model's probability for each predicted room type.
* ⚡ **Real-Time API Communication** — React communicates directly with the FastAPI prediction endpoint.
* 🛡️ **Client & Server Validation** — Input constraints are validated on both the frontend and backend.
* 🔌 **Backend Status Detection** — The frontend checks whether the FastAPI backend is online.
* 🎮 **Pixel-Art UI** — NYC-inspired pixel/voxel visual design.
* ♿ **Reduced Motion Support** — Animations respect the user's `prefers-reduced-motion` setting.
* 🚨 **Friendly Error Handling** — Network, timeout, validation, server, and malformed-response errors are handled separately.

---

## 🧠 Machine Learning

PixelStay uses a pre-trained scikit-learn pipeline stored in:

```text
Model_Pipeline.pkl
```

The model receives the following features:

```text
latitude
longitude
price
minimum_nights
number_of_reviews
reviews_per_month
calculated_host_listings_count
availability_365
neighbourhood_group
neighbourhood
```

The backend returns:

```json
{
  "predicted_room_type": "Private room",
  "Probability": [
    0.25,
    0.70,
    0.05
  ]
}
```

The probability array follows the model's `classes_` ordering:

```text
Entire home/apt
Private room
Shared room
```

The frontend maps these probabilities to their corresponding labels.

### Model compatibility

The trained model was created using:

```text
scikit-learn 1.6.1
```

The backend therefore pins scikit-learn to the same version in `requirements.txt` to avoid model deserialization compatibility problems.

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      PixelStay       │
                    │     Full Stack App   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ React + Vite    │        │ FastAPI         │
        │ Frontend        │───────▶│ Backend         │
        │                 │  POST  │                 │
        │ Prediction UI   │ /predict│ ML Pipeline    │
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ▼
                                  ┌──────────────────┐
                                  │ Model_Pipeline   │
                                  │ scikit-learn     │
                                  └──────────────────┘
```

---

## 📁 Project Structure

```text
PixelStay/
│
├── Model_Pipeline.pkl
├── main.py
├── requirements.txt
├── README.md
├── .gitignore
│
└── frontend/
    │
    ├── public/
    │   └── favicon.png
    │
    ├── src/
    │   ├── components/
    │   │   ├── AboutSection.jsx
    │   │   ├── ErrorPanel.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── InputField.jsx
    │   │   ├── LoadingState.jsx
    │   │   ├── LocationScanner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── NeighbourhoodCombobox.jsx
    │   │   ├── PixelCityBackground.jsx
    │   │   ├── PredictButton.jsx
    │   │   ├── PredictionForm.jsx
    │   │   ├── PredictionResult.jsx
    │   │   └── ProbabilityChart.jsx
    │   │
    │   ├── config/
    │   │   ├── api.js
    │   │   ├── predictApi.js
    │   │   └── validation.js
    │   │
    │   ├── data/
    │   │   ├── classLabels.js
    │   │   └── neighbourhoods.js
    │   │
    │   ├── hooks/
    │   │   ├── useBackendStatus.js
    │   │   ├── useParallax.js
    │   │   └── useSeededRandom.js
    │   │
    │   ├── styles/
    │   │   └── ...
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Fetch API

### Backend

* Python
* FastAPI
* Pydantic
* Uvicorn
* Pandas

### Machine Learning

* scikit-learn
* joblib
* Pre-trained classification pipeline

---

# 🚀 Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pixelstay.git
cd pixelstay
```

---

## 2. Set up the backend

Create a virtual environment:

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

# 💻 Running the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

### Windows

```bash
copy .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

The default configuration is:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# 🔌 API

## Health Check

### `GET /`

Returns a simple response to confirm that the backend is reachable.

Example:

```json
{
  "Hello": "World"
}
```

---

## Prediction

### `POST /predict`

Accepts listing information and returns the predicted Airbnb room type and class probabilities.

### Request

```json
{
  "latitude": 40.7128,
  "longitude": -74.006,
  "price": 150,
  "minimum_nights": 3,
  "number_of_reviews": 42,
  "reviews_per_month": 1.8,
  "calculated_host_listings_count": 2,
  "availability_365": 180,
  "neighbourhood_group": "Manhattan",
  "neighbourhood": "Chelsea"
}
```

### Response

```json
{
  "predicted_room_type": "Private room",
  "Probability": [
    0.25,
    0.70,
    0.05
  ]
}
```

---

# 🌐 Deployment

PixelStay is designed to use separate hosting for the frontend and backend.

### Frontend

The React/Vite application can be deployed using a static hosting platform such as:

* GitHub Pages
* Vercel
* Netlify

### Backend

The FastAPI application requires a Python-capable server such as:

* Render
* Railway
* Fly.io
* Another FastAPI-compatible hosting provider

The deployed frontend should use the backend URL through:

```env
VITE_API_URL=https://your-backend-url.example.com
```

Do not hardcode the production backend URL throughout the React application.

---

# 🔐 Environment Variables

The frontend uses:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://your-api-domain.example.com
```

The actual `.env` file is intentionally excluded from Git.

Only `.env.example` should be committed.

---

# ⚠️ Model File

`Model_Pipeline.pkl` is required by the FastAPI backend:

```python
model = joblib.load("Model_Pipeline.pkl")
```

Therefore, the model file is intentionally tracked by Git and is **not ignored** in `.gitignore`.

If the model becomes too large for normal Git hosting, use Git LFS or external model storage instead.

---

# 🧪 Validation & Error Handling

The backend validates incoming data using Pydantic.

Examples include:

* Latitude between `-90` and `90`
* Longitude between `-180` and `180`
* Positive listing price
* Minimum nights between `1` and `365`
* Availability between `0` and `365`
* Non-negative review counts
* Required neighbourhood fields

The frontend mirrors these constraints to provide faster client-side validation before making an API request.

Prediction requests also distinguish between:

```text
network
timeout
validation
server
malformed response
```

and display appropriate messages to the user.

---

# 🗺️ Neighbourhood Data

The frontend contains the neighbourhood categories used by the trained model.

The model was trained using:

```text
neighbourhood_group
neighbourhood
```

The application preserves the model's original categorical inputs rather than inventing additional mappings.

---

# 🎨 Design

PixelStay uses a pixel-art / voxel-inspired visual language based around New York City.

The interface includes:

* Pixel-art NYC background
* Animated city elements
* Listing prediction form
* Prediction result card
* Probability visualization
* Backend status indicator
* Responsive layout
* Reduced-motion support

---

# 📌 Future Improvements

Potential future improvements include:

* [ ] Deploy the FastAPI backend
* [ ] Deploy the React frontend
* [ ] Add a production domain
* [ ] Add automated testing
* [ ] Add model performance metrics
* [ ] Add prediction history
* [ ] Add interactive NYC map visualization
* [ ] Add model versioning
* [ ] Add CI/CD with GitHub Actions

---

## 👨‍💻 Author

**Adrij Ghosh**

Computer Science Student | AI/ML | Python | SQL | Machine Learning | DSA | Backend Development

---

## 📄 License

This project is intended for educational and portfolio purposes.
#   P i x e l S t a y - A I - R o o m - T y p e - P r e d i c t o r  
 