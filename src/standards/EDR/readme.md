#
Possibly use TIF images in Postgres to query parameters such as density, temperature, etc. However, this would require a lot of storage space and would be slow to query due to the dynamic nature of the data.

For population density. Include variables such as area of administrative division, calculate area of radius around point, etc & then calculate population density. The actual location coordinates of population statistics must therefore be available assuming that the pop density is not uniform across the administrative division.