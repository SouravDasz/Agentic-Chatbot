
import requests
from langchain_core.tools import tool


@tool
def get_weather(city: str) -> dict:
    """Get current weather conditions for a given city."""

    try:
        # Step 1: Convert city name into coordinates
        geo_url = "https://geocoding-api.open-meteo.com/v1/search"

        geo_response = requests.get(
            geo_url,
            params={"name": city, "count": 1},
            timeout=10
        )
        geo_response.raise_for_status()

        locations = geo_response.json().get("results")

        if not locations:
            return {"error": f"City '{city}' not found"}

        location = locations[0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # Step 2: Get current weather
        weather_url = "https://api.open-meteo.com/v1/forecast"

        weather_response = requests.get(
            weather_url,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": (
                    "temperature_2m,"
                    "relative_humidity_2m,"
                    "apparent_temperature,"
                    "precipitation,"
                    "weather_code,"
                    "wind_speed_10m"
                )
            },
            timeout=10
        )

        weather_response.raise_for_status()

        weather = weather_response.json()["current"]

        return {
            "city": location["name"],
            "country": location.get("country"),
            "temperature": weather["temperature_2m"],
            "feels_like": weather["apparent_temperature"],
            "humidity": weather["relative_humidity_2m"],
            "precipitation": weather["precipitation"],
            "wind_speed": weather["wind_speed_10m"],
            "weather_code": weather["weather_code"],
            "time": weather["time"],
            "source": "Open-Meteo"
        }

    except requests.exceptions.RequestException as e:
        return {"error": f"Weather service error: {str(e)}"}
