type CollectionId = string;
type OutputFormats = string[];
type default_output_format = string;
type withinUnits = string[];

type Crs_Details = {
  crs: string;
  wkt: string;
}[];



/**
 * @interface InstanceOrCollectionProps
 */

interface CollectionWithoutProps {
  id:string;
  modelName: string;
  hasZ:boolean;
  edrVariables: string[];
  data_queries:{
    position?:boolean;
    instances?:boolean;
    area?:boolean;
    trajectory?:boolean;
    corridor?:boolean;
    locations?:boolean;
    items?:boolean;
    radiues?:boolean;
  }
  output_formats: string[]
}
interface InstanceOrCollectionProps {
  id: string
}
interface Link {
  title: string; //Enable trace issues to specific resource
  href: string;
  type?: string; //application/geo+json, application/json, text/yaml etc
  hreflang?: string; //Language of the linked resource
  rel: string; //Relation of the linked res. to current res.
  length?: number;
  templated?: boolean; //If link has replaceable values
}

type Keywords = string[];
interface Provider {
  name: string; //Name of provider
  url?: string; //Url to the provider's website
}

interface EDRLandingPage {
  title?: string;
  description?: string;
  links: Link[];
  keywords?: Keywords;
  provider?: Provider;
  contact?: ProviderContact;
}
interface ProviderContact {
  email: string; //
  phone: string;
  fax: string;
  hours: string;
  instructions: string;
  address: string;
  city: string;
  stateorprovince: string;
  country: string; //Leaning towards ISO3
}

interface EDRConformancePage {
  conformsTo: string[];
  links?: Link[];
}

type BBOXArray =
  | [number, number, number, number][]
  | [number, number, number, number, number, number][];

type IntervalArray = [string | null, string | null][];
interface Extent {
  spatial: {
    bbox: BBOXArray;
    crs: string;
    name?: string; //Name of vertical coordinate system?
  };
  temporal: {
    interval: IntervalArray;
    trs: string;
    values?: string[]; ////An array with >0 strings
    name?: string; //Name of the TRS
  };
  vertical?: {
    interval: [number | string, number | string][];
    values?: string[][]; //Min of 1 item in main array
    vrs: string; //crs of the vertical coords of data
    name: string; ///Name of the vrs
  };
}
interface CollectionsMany {
  collections: Collection[];
  links: Link[];
}
interface Collection {
  id: string;
  title?: string;
  description?: string;
  extent: Extent;
  data_queries: {
    position?: {
      link: DataQueryLinkDefault;
    };
    radius?: {
      link: DataQueryLinkDefault<{ within_units: string[] }>; //Add within_units interface
    };
    area?: {
      link: DataQueryLinkDefault;
    };
    cube?: {
      link: DataQueryLinkDefault<{ height_units: string[] }>;
    };
    trajectory?: {
      link: DataQueryLinkDefault;
    };
    corridor?: {
      link: DataQueryLinkDefault<{
        width_units: string[];
        height_units: string[];
      }>;
    };
    items?: {
      link: DataQueryLinkDefault;
    };
    locations?: {
      link: DataQueryLinkDefault;
    };
    instances?: DataQueryLinkDefault;
  };
  crs: string[];
  output_formats: string[];
  parameter_names: {
    [key: string]: ParameterNames;
  };
}

type QueryType =
  | "instances"
  | "position"
  | "corridor"
  | "cube"
  | "trajectory"
  | "area"
  | "radius"
  | "items"
  | "locations";
interface DataQueryLinkDefault<T = {}> extends Link {
  variables: {
    title: string;
    description: string;
    query_type: QueryType;
    default_output_format: default_output_format;
    crs_details: Crs_Details[];
  } & T;
}

/**
 * @interface ParameterNames
 * @example ParameterNamesExample
 */

const ParameterNamesExample: ParameterNames = {
  type: "Parameter",
  id: "sea_ice",
  description: "Sea Ice concentration (ice=1; no ice=0)",
  unit: {
    label: "Ratio",
    symbol: {
      value: "1",
      type: "http://www.opengis.net/def/uom/UCUM/",
    },
  },
  observedProperty: {
    id: "http://vocab.nerc.ac.uk/standard_name/sea_ice_area_fraction/",
    label: "Sea Ice Concentration",
  },
};
interface ParameterNames {
  type: "Parameter";
  description?: string;
  label?: string;
  "data-type"?: "integer" | "float" | "string";
  unit?: Units;
  observedProperty: ObservedProperty;
  categoryEncoding?: {
    [key: string]: number | number[];
  };
  extent?: Extent;
  id?: string; //Unique id of the parameter
  measurementType?: {
    method: string; //Example: mean
    duration?: string; //Not required for instantenous measurements; Example: PT10M
  };
}

interface Units {
  label: { [key: string]: string } | string; //Example: {label:{en:Kelvin}}
  symbol:
    | {
        value: string; //Representation of the units symbol
        type: string; //uri pointing to detailed description of the unit
      }
    | string; //{symbol:{value:K,type:http://www.opengis.net/def/uom/UCUM/ }}
  id?: string;
}

/**
 * @interface ObservedProperty
 * @example {id: http://vocab.nerc.ac.uk/standard_name/sea_ice_area_fraction/
  label: Sea Ice Concentration}
 */
interface ObservedProperty {
  /**
   * URI linking to an external registry which contains the definitive
      definition of
      the observed property
   */
  id?: string;
  label: string | object;
  description?: string;
  categories?: [
    {
      /**
   * URI linking to an external registry which contains the definitive
      definition of
      the observed property
      */
      id: string;
      label: string | object;
      description?: string | { en: string };
    }
  ];
}
interface CoverageJSON {
  type: "Coverage" | "CoverageCollection" | "Domain";
  domainType?: string;
  coverages: Coverage[];
  parameters: {
    [key: string]: EdrGeoJSONParameter;
  };
  ranges?: {
    [key: string]: NdArray;
  };
  referencing?: ReferenceSystemConnection[];
}

interface Coverage {
  type: "Coverage";
  domain: Domain;
  ranges: {
    [key: string]: NdArray;
  };
}
/**
 * @interface NdArray description: Object representing a multidimensional (>= 0D) array with named
  axes, encoded as a flat one-dimensional array in row-major order
  @type axisNames. Items should be Unique
  @type value. Unique=true. MinItems=1
 */
interface NdArray {
  type: "NdArray";
  dataType: "float" | "integer" | "string";
  shape: number[];
  axisNames: string[];
  values: number[] | string[] | null;
}
interface Domain {
  type: "Domain";
  axes:
    | {
        x: NumericAxis;
        y: NumericAxis;
        z: NumericAxis;
        t: NumericAxis;
      }
    | {
        axes: {
          composite: TupleValueAxis;
          z?: NumericAxis;
        };
      };
  referencing?: ReferenceSystemConnection[];
}

type ReferenceSystem =
  | {
      type: string;
      calendar: string;
      timeScale?: string;
    }
  | {
      id: string;
      label: i18N;
      description: i18N;
      targetConcept: { id?: string; label: i18N; description?: i18N };
      identifiers?: {
        [key: string]: { id?: string; label: i18N; description?: i18N };
      };
    };
interface ReferenceSystemConnection {
  coordinates: string[];
  system: ReferenceSystem;
}
interface TupleValueAxis {
  dataType: "tuple";
  values: (string | number)[][];
  coordinates: {};
  bounds?: any[];
}

type ValuesAxis =
  | ValuesAxisBase
  | PrimitiveValuesAxis
  | TupleValueAxis
  | PolygonValuesAxis;

interface PrimitiveValuesAxis extends ValuesAxisBase {
  values: string[] | number[];
  
}

interface PolygonValuesAxis {}

type NumericAxis = NumericValuesAxis | NumericRegularlySpacedAxis;

/**
 * @interface NumericRegularlySpacedAxis
 * @type num should be >1 & is int
 */
interface NumericRegularlySpacedAxis {
  start: number;
  stop: number;
  num: number;
}

/**
 * @interface ValuesAxisBase
 * @type dataType !=="primitive"
 * @type coordinates.length should be >1(minItems=2)
 * @type bounds.length should be >1(minItems=2)
 */
type ValuesAxisBase = {
  dataType: string;
  values: any[];
  coordinates?: string[];
  bounds?: any[];
};
interface NumericValuesAxis extends ValuesAxisBase {
  values: number[];
  bounds: number[];
}
interface EdrGeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  parameters: EdrGeoJSONParameter[];
}

interface GeoJSONFeature {
  type: "Feature";
  id: string | number;
  links?: Link[];
  geometry: GeoJSONPoint | GeoJSONGeometryCollection;
  properties: edrGeoJSONProperties;
}
interface EdrGeoJSONParameter {
  id?: string;
  type: "Parameter";
  description?: i18N;
  observedProperty: {
    id?: string;
    label: i18N;
    description?: i18N;
    categories?: {
      id: string;
      label: i18N;
      description?: i18N;
    };
  };
  unit?: {
    /**
     * @label or @symbol must be defined
     */
    id?: string;
    label?: i18N;
    symbol?: string | { type?: string; value?: string };
  };
  categoryEncoding?: {
    [key: string]: number | number[];
  };
}

/**
 * @interface i18N
 * @description Object representing an internationalised string.
 */
interface i18N {
  [key: string]: string;
}

/**
 * @interface GeoJSONPoint
 */

interface GeoJSONPoint {
  type: "Point";
  coordinates:
    | [number, number] //2D. Is the minimum
    | [number, number, number] //3D (z-axis can be elevation/Time)
    | [number, number, number, number]; //4D
}

interface GeoJSONGeometryCollection {
  type: "GeometryCollection";
  geometries: GeoJSONPoint;
}
/**
 * @interface edrGeoJSONProperties
 * @example
 */
const edrGeoJSONProperties_Example: edrGeoJSONProperties = {
  datetime: "2020-10-10T12-02/2020-10-11",
  "parameter-name": ["velocity", "temperatue"],
  label: "Site A",
  edrqueryendpoint: "http://someURL/edd",
};

interface edrGeoJSONProperties {
  datetime: string; //Either a date-time or a period string that adheres to RFC 3339. Indicates the time instant or period for which data are available from the EDR feature.
  "parameter-name": string[];
  label: string;
  edrqueryendpoint: string; //Is an URL
}

/**
 * @interface LineStringGeoJSON
 * @items Main array, 2ndArray MinItems=2. Nested Array minItems=2, max=4
 * [number,number,?number,?number]
 */

interface LineStringGeoJSON {
  type: "LineString" | "LineStringM" | "LineStringZ" | "LineStringZM";
  coordinates: number[][][];
}

interface MultiPolygonGeoJSON {}

/**
 * @interface InstanceQuery
 */
interface InstanceQuery {
  links: Link[];
  instances: Collection[];
}

/**
 * @interface ParameterGroup
 */

interface ParameterGroup {
  type: "ParameterGroup";
  id: string;
  label: i18N;
  description: i18N;
  observedProperty: ObservedProperty;
}

/**
 * @interface QueryParameterF
 */
interface QueryParameterF {
  f: "json" | "yaml" | "coverageJSON" | "edrGeoJSON" | "featuresJSON";
  type:
    | "application/json"
    | "text/yaml"
    | "application/vnd.cov+json"
    | "application/geo+json"
    | "application/x-netcdf";
}

/**
 * @interface AreaQueryResponse
 */

/**
 * @interface InstancesResponse
 * @type application/json
 */

interface InstancesResponse {
  links: Link[];
  instances: Collection[];
}

interface ItemsResponse {}
