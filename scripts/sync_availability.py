#!/usr/bin/env python3
"""
Villa Caterina — availability sync.

Fetches the Booking.com iCal feed and writes availability.json with the list
of blocked dates. Mirrors the old client-side logic in js/booking.js:
  - every day in [DTSTART, DTEND) is blocked
  - turn-over rule: the DTEND (checkout) day itself is also blocked

Run by .github/workflows/availability.yml every 6 hours.
Exits 0 with "unchanged" if the blocked-date set didn't change,
so the workflow can skip the commit.
"""

import json
import re
import sys
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ICAL_URL = "https://ical.booking.com/v1/export?t=ed273647-2356-409c-a5c4-109b75e750b6"
OUT_FILE = Path(__file__).resolve().parent.parent / "availability.json"


def fetch_ical(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "VillaCaterina-availability-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        if resp.status != 200:
            raise RuntimeError(f"HTTP {resp.status} from iCal feed")
        return resp.read().decode("utf-8", errors="replace")


def parse_ical_date(line: str) -> date | None:
    value = line.split(":", 1)[-1]
    digits = re.sub(r"[^0-9]", "", value)[:8]
    if len(digits) < 8:
        return None
    return date(int(digits[:4]), int(digits[4:6]), int(digits[6:8]))


def blocked_dates(raw: str) -> list[str]:
    # Unfold continuation lines, then split
    lines = re.sub(r"\r?\n[ \t]", "", raw).split("\n")
    lines = [ln.rstrip("\r") for ln in lines]

    blocked: set[str] = set()
    in_event = False
    dt_start = dt_end = None

    for line in lines:
        if line == "BEGIN:VEVENT":
            in_event, dt_start, dt_end = True, None, None
        elif line == "END:VEVENT":
            in_event = False
            if dt_start and dt_end:
                cursor = dt_start
                while cursor < dt_end:
                    blocked.add(cursor.isoformat())
                    cursor += timedelta(days=1)
                # Turn-over rule: block the checkout day too
                blocked.add(dt_end.isoformat())
        elif in_event:
            if line.startswith("DTSTART"):
                dt_start = parse_ical_date(line)
            elif line.startswith("DTEND"):
                dt_end = parse_ical_date(line)

    return sorted(blocked)


def main() -> int:
    raw = fetch_ical(ICAL_URL)
    if "BEGIN:VCALENDAR" not in raw:
        print("ERROR: response does not look like an iCal feed", file=sys.stderr)
        return 1

    dates = blocked_dates(raw)

    if OUT_FILE.exists():
        try:
            old = json.loads(OUT_FILE.read_text())
            if old.get("dates") == dates:
                print(f"unchanged ({len(dates)} blocked days)")
                return 0
        except (json.JSONDecodeError, OSError):
            pass  # rewrite on any problem with existing file

    payload = {
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "booking.com-ical",
        "dates": dates,
    }
    OUT_FILE.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"updated ({len(dates)} blocked days)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
