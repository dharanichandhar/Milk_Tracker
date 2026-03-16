from math import sqrt, radians, sin, cos, asin

def cartesian(point1, point2):
    x1 = point1[0]
    y1 = point1[1]
    x2 = point2[0]
    y2 = point2[1]
    delta_x = x2 - x1
    delta_y = y2 - y1
    return sqrt(delta_x ** 2 + delta_y ** 2)

EARTH_RADIUS = 6371

def hav(angle):
    return sin(angle/2) ** 2

def haversine(latlon1, latlon2):
    lat1 = latlon1[0]
    lon1 = latlon1[1]
    lat2 = latlon2[0]
    lon2 = latlon2[1]
    lat1_radian = radians(lat1)
    lon1_radian = radians(lon1)
    lat2_radian = radians(lat2)
    lon2_radian = radians(lon2)
    delta_lat = lat2_radian - lat1_radian
    delta_lon = lon2_radian - lon1_radian
    h = hav(delta_lat) + hav(delta_lon) * cos(lat1_radian) * cos(lat2_radian)
    return 2 * EARTH_RADIUS * asin(sqrt(h))


