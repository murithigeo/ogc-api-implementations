import { Crs_prop } from "../../../types";

const supportedcrs_properties: Crs_prop[] = [
    {
        authority: 'OGC',
        version: 1.3,
        code: 'CRS84',
        srid: 4326,
        //auth_name: 'OGC',
        isGeographic: false,
        //uri: `http://www.opengis.net/def/crs/${authority}/${version}/${code}`
    },
    {
        code: 4326,
        version: 0,
        srid: 4326,
        authority: 'EPSG',
        isGeographic: true,
    }
];

for (const crsObject of supportedcrs_properties) {
    crsObject.uri = `http://www.opengis.net/def/crs/${crsObject.authority}/${crsObject.version}/${crsObject.code}`
};

if (supportedcrs_properties[0].code !== ('CRS84' || 'CRS84h')){
    throw new Error (`Please set CRS84 as first element of supported coordinate ref. sys. array`)
}
    ///console.log(supportedcrs_properties)
    /**
     * Generate a string[] for the above CRS comprised of the uri attribute.
     */
    const supportedcrs_array = supportedcrs_properties.map((crsObject: { uri?: string }) => crsObject.uri);

const trs: string = "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian";
export { supportedcrs_array, supportedcrs_properties, trs };