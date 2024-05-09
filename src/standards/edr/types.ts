type CollectionId = string;
type OutputFormats = string[];
type default_output_format = string;
type withinUnits = string[];

type Crs_Details = {
  crs: string;
  wkt: string;
}[];

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

interface Collection {
  id: string;
  title?: string;
  description?: string;
  extent: {
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
    data_queries?: {
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
        link: DataQueryLinkDefault;
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
      //radius?: DataQueryRadius;
    };
    crs: string[];
    output_formats:string[];
  };
}

interface DataQueryLinkDefault<T = {}> extends Link {
  variables: {
    title?: string;
    description?: string;
    query_type:
      | "position"
      | "corridor"
      | "cube"
      | "trajectory"
      | "area"
      | "radius"
      | "items"
      | "locations";
    default_output_format: default_output_format;
    crs_details: Crs_Details[];
  } & T;
}

interface CoverageJSON {}

interface EdrJSON {}
