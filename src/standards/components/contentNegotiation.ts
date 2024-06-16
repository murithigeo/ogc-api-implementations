export  interface CNValueNew {
  f: "JSON" | "YAML" | "COVERAGEJSON" | "GEOJSON";
  contentType:
    | "application/json"
    | "text/yaml"
    | "application/vnd+cov+json"
    | "application/prs.coverage+json"
    | "application/geo+json";
}

const contentNegotiationValues: CNValueNew[] = [
  {
    f: "YAML",
    contentType: "text/yaml",
  },
  {
    f: "JSON",
    contentType: "application/json",
  },
  { f: "GEOJSON", contentType: "application/geo+json" },
  {
    f: "COVERAGEJSON",
    contentType: "application/prs.coverage+json",
  },
  /*{
    f: "COVERAGEJSON",
    contentType: "application/vnd+cov+json",
  },
  */
];
export default contentNegotiationValues;
