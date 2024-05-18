# Endpoints
    - Common:
      - params: 
        - f: content-negotiator. [Optional]
        - crs: coord ref sys to use for data returned. [Optional]
        - datetime: Retrieve data between two intervals. [Optional]
        - z: Return features where elevation is equal to said value [Optional]
        - parameter-name: dataProperties to include in the returned data. [Required?]. Example: temperature,windspeed
        - collectionId | instanceId: string
# Radius
    - params:
      - coords: `Point(x,y)` | `MultiPoint((x0,y0),(x1,y1,),(xn,yn))` [Required, supportsZAxis]
      - within: integer|number. Remember to handle conversions between various within-units [Required]
      - within-units: string. Examples: "km"| "cm"| "mi" [Required]
      - Others: [f,crs,datetime,parameter-name,z,]
# Area
    - params
      - coords: Must a polygon. [Required, noZAxis]
      - resolution-x: Used to change the granularity of the data along x-axis. [Optional]
      - resolution-y: Used to change the granularity of the data along x-axi. [Optional]
      - Others: [z,datetime,crs,parameter-name]
# Cube
    - params:
      - bbox: The usual. We should probably also add a bbox-crs param. 
      - z: Same as z but required. Overrides the vertical layers defined in the bbox param. Can be z=a,b,c for values where elevation=a&b&c. If list is interval i.e. a/b, return values where b>=elevation>=a
      - Others: [f,crs,datetime,parameter-name,]
# Locations
    - params:
      - bbox
      - Others: [datetime,bbox-crs?]
# LocationId:
    - Others: [parameter-name,crs,f,datetime]
# Corridor
    - params
      - coords: [Required]
        - 2D LineString(No Z or M)
        - 2D LineString(With M provided by datetime param)
        - 2D LineString(With Z provided by z param)
        - 2D LineString (With Z provided by z param & M provided by datetime param)
        - 3D LineStringM (With M-axis: TimeRange)?
        - 3D LineStringM (With M-axis: TimeRange? & z provided by z param)
        - 3D LineStringZ (With Z-axis; No M-axis)
        - 3D LineStringZ (With Z-axis) & datetime param
        - 4D LineStringZM (With both z-axis and m-axis). If datetime or z defined, throw 400
      - resolution-x: [Optional]
      - resolution-y: [Optional]
      //- resolution-z: [Optional]
      - corridor-width: Look for features within units to either side of trajectory [required]
      - width-units: Value of units [required]
      - corridor-height: Height of the corridor. [Required]
      - height-units: Value of units [Required]
      - Others: [z,datetime,crs,f,parameter-name]
# Trajectory
    - params:
        - coords: [Required]
          - 2D LineString(No Z or M)
          - 2D LineString(With M provided by datetime param)
          - 2D LineString(With Z provided by z param)
          - 2D LineString (With Z provided by z param & M provided by datetime param)
          - 3D LineStringM (With M-axis: TimeRange)?
          - 3D LineStringM (With M-axis: TimeRange? & z provided by z param)
          - 3D LineStringZ (With Z-axis; No M-axis)
          - 3D LineStringZ (With Z-axis) & datetime param
          - 4D LineStringZM (With both z-axis and m-axis). If datetime or z defined, throw 400
        - Others: [f,crs,datetime,parameter-name]
# Items
    - params:
      - bbox
      - crs?
      - datetime
# ItemId
    - params:
      - crs?
# Instances
    - params:
      - Others: [f]
# Position
    - params
      - coords: 2D(Point|MultiPoint)
      - Others: [f, crs,z,datetime,parameter-name]