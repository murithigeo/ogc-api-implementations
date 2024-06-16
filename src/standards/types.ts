export interface CrsDetail {
  /**
   * @type uri formed by computing `http://www.opengis.net/def/crs/{authority}/{version}/{code}
   */
  type?: "GeographicCRS" | "PlanarCRS";
  crs?: string;
  wkt?: string;
  version: number;
  code: string | number;
  srid: number;
  authority: string;
  isGeographic: boolean;
}
