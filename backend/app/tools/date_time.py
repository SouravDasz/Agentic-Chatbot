
from datetime import datetime, date
from zoneinfo import ZoneInfo
from langchain_core.tools import tool


@tool
def get_current_datetime(timezone: str = "Asia/Kolkata") -> dict:
    """
    Get the current date, time, day and timezone.
    Accepts an IANA timezone such as Asia/Kolkata,
    Europe/London or America/New_York.
    """

    try:
        now = datetime.now(ZoneInfo(timezone))

        return {
            "date": now.strftime("%Y-%m-%d"),
            "time": now.strftime("%I:%M:%S %p"),
            "day": now.strftime("%A"),
            "timezone": timezone,
            "formatted_datetime": now.strftime(
                "%d %B %Y, %I:%M:%S %p"
            )
        }

    except Exception:
        return {"error": f"Invalid timezone: {timezone}"}


@tool
def get_date_difference(start_date: str, end_date: str) -> dict:
    """
    Calculate the number of days between two dates.
    Dates must use YYYY-MM-DD format.
    """

    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)

        difference = (end - start).days

        return {
            "start_date": start_date,
            "end_date": end_date,
            "difference_in_days": abs(difference),
            "direction": (
                "end_date is after start_date"
                if difference > 0
                else "end_date is before start_date"
                if difference < 0
                else "both dates are the same"
            )
        }

    except ValueError:
        return {
            "error": "Invalid date. Use YYYY-MM-DD format."
        }
