const codes = {
  202: "Successful Request. Wait for processing to finish. Include a Retry-After Header (in seconds)",
  204: "Successful Request. No data found to complete the request",
  304: "An entity tag was provided in the request and the resource has not changed since the prev request",
  308: "Server cannot process the data through a synchronous request. Append a Location header of where the data will be available once the req finishes processing",
  400: "Client-side error.",
  401: "Request requires authentication. Response should contain WWW-Authenticate header containing an applicable challenge",
  403: "Successful request but client does not have required permissions",
  404: "Resource does not exist on this server",
  405: "Method not allowed: Example POST requests on GET routes",
  413: "Requestbody too large to be processed by server",
  500: "Internal server error"
};

export default codes;
