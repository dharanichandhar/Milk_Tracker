from gps import Position
import json
import csv

with open('gps_events.nmea', newline='') as csvfile:
    reader = csv.reader(csvfile)
    events = ((event, lat + lat_heading, long + long_heading) for event, _, lat, lat_heading, long, long_heading, *_ in reader)
    position_events = ((lat, long) for event, lat, long in events if event == '$GPGGA')
    positions = (Position.from_nmea(lat, long) for lat, long in position_events)
    latlong = ({'lat': pos.lat, 'long': pos.long} for pos in positions)
    
    with open('events.json', 'w') as outfile:
        json.dump(list(latlong), outfile)

