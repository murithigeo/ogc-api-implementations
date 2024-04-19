interface F_ContentTypes {
    f: string;
    type: string;
}

const possibleContentTypes: F_ContentTypes[] = [
    {
        f: 'html',
        type: 'text/html'
    },
    {
        f: 'json',
        type: 'application/json'
    },
    {
        f: 'json',
        type: 'application/geo+json'
    },
    {
        f: 'json',
        type: 'application/vnd.oai.openapi+json;version=3.0'
    },
    {
        f: 'gpkg',
        type: 'application/geopackage+sqlite3'
    }
]; 