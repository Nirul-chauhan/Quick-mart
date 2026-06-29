from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, roles, country, state, city, store, category

# Create FastAPI application
app = FastAPI(
    title="Blinkit Backend API",
    description="Authentication & Role-based access with PostgreSQL",
    version="1.0.0",
)

# CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(country.router)
app.include_router(state.router)
app.include_router(city.router)
app.include_router(store.router)
app.include_router(category.router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Blinkit Backend is running 🚀"
    }