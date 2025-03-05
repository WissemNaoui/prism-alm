import os
import pathlib
import json
import dotenv
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.alm.router import router as alm_router
from app.auth.router import router as auth_router

# Load environment variables from .env file
dotenv.load_dotenv()

from databutton_app.mw.auth_mw import AuthConfig, get_authorized_user


def get_router_config() -> dict:
    """
    Reads router configuration from routers.json.

    Returns:
        A dictionary containing router configurations, or False if the file is not found or an error occurs.
    """
    try:
        # Note: This file is not available to the agent
        cfg = json.loads(open("routers.json").read())
    except:
        return False
    return cfg


def is_auth_disabled(router_config: dict, name: str) -> bool:
    """
    Checks if authentication is disabled for a given router.

    Args:
        router_config: A dictionary containing router configurations.
        name: The name of the router.

    Returns:
        True if authentication is disabled, False otherwise.
    """
    return router_config["routers"][name]["disableAuth"]


def import_api_routers() -> APIRouter:
    """
    Imports and registers all API routers dynamically.

    This function iterates through the 'app/apis' directory, imports each API router,
    and includes it in the main routes object, applying authentication dependencies as needed.

    Returns:
        A FastAPI APIRouter object containing all registered API routes.
    """
    # Create a top-level router to hold all API routes
    routes = APIRouter(prefix="/routes")

    # Retrieve router configurations from the routers.json file
    router_config = get_router_config()

    # Get the path of the current file
    src_path = pathlib.Path(__file__).parent

    # Define the path to the API modules
    apis_path = src_path / "app" / "apis"

    # Get a list of API directories (each containing an __init__.py file)
    api_names = [
        p.relative_to(apis_path).parent.as_posix()
        for p in apis_path.glob("*/__init__.py")
    ]

    # Prefix for importing API modules
    api_module_prefix = "app.apis."

    # Iterate through each API directory and import the corresponding router
    for name in api_names:
        print(f"Importing API: {name}")
        try:
            # Dynamically import the API module
            api_module = __import__(api_module_prefix + name, fromlist=[name])
            # Get the router object from the imported module
            api_router = getattr(api_module, "router", None)
            # Check if the object is a valid APIRouter
            if isinstance(api_router, APIRouter):
                # Include the API router in the main routes, applying authentication if needed
                routes.include_router(
                    api_router,
                    dependencies=(
                        []
                        if is_auth_disabled(router_config, name)
                        else [Depends(get_authorized_user)]
                    ),
                )
        except Exception as e:
            print(e)
            continue

    print(routes.routes)

    return routes


def get_firebase_config() -> dict | None:
    """
    Retrieves Firebase configuration from environment variables.

    Searches for a "firebase-auth" extension in the DATABUTTON_EXTENSIONS environment variable
    and returns its configuration if found.

    Returns:
        A dictionary containing Firebase configuration, or None if not found.
    """
    extensions = os.environ.get("DATABUTTON_EXTENSIONS", "[]")
    extensions = json.loads(extensions)

    for ext in extensions:
        if ext["name"] == "firebase-auth":
            return ext["config"]["firebaseConfig"]

    return None


def create_app() -> FastAPI:
    """
    Creates and configures the FastAPI application.

    This function initializes the FastAPI app, registers routers, sets up CORS middleware,
    and configures Firebase authentication if available.

    Returns:
        A configured FastAPI application instance.
    """
    # Create a FastAPI application instance
    app = FastAPI(title="BTE ALM Solution", description="Asset Liability Management solution for Banque de Tunisie et des Emirats")
    # Include dynamically imported API routers
    app.include_router(import_api_routers())

    # Add CORS middleware to handle cross-origin requests
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register the authentication and ALM routers
    app.include_router(auth_router)
    app.include_router(alm_router)

    # Print a list of routes and their methods for debugging purposes
    for route in app.routes:
        if hasattr(route, "methods"):
            for method in route.methods:
                print(f"{method} {route.path}")

    # Retrieve Firebase configuration
    firebase_config = get_firebase_config()

    # Configure authentication based on the presence of Firebase config
    if firebase_config is None:
        print("No firebase config found")
        app.state.auth_config = None
    else:
        print("Firebase config found")
        auth_config = {
            "jwks_url": "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
            "audience": firebase_config["projectId"],
            "header": "authorization",
        }

        app.state.auth_config = AuthConfig(**auth_config)

    return app


# Create the FastAPI app using the factory function
app = create_app()

# Define the root endpoint for health check
@app.get("/", tags=["Health Check"])
async def root():
    """
    Health check endpoint.

    Returns a JSON response indicating the API's status and version.
    """
    return {
        "status": "online",
        "message": "BTE ALM Solution API is running",
        "version": "1.0.0"
    }