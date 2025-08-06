

const STATUS_MESSAGE = {
  // 1xx Informational
  100: { message: "Continue", description: "Server received request headers, client should send body" },
  101: { message: "Switching Protocols", description: "Server is switching protocols as requested" },
  102: { message: "Processing", description: "Server is processing request (WebDAV)" },
  103: { message: "Early Hints", description: "Server is returning some headers before final response" },

  // 2xx Success
  200: { message: "OK", description: "Successful response" },
  201: { message: "Created", description: "Resource created successfully" },
  202: { message: "Accepted", description: "Request accepted but not yet processed" },
  203: { message: "Non-Authoritative", description: "Transformed response from proxy" },
  204: { message: "No Content", description: "Success but no response body" },
  205: { message: "Reset Content", description: "Client should reset document view" },
  206: { message: "Partial Content", description: "Partial response to range request" },
  207: { message: "Multi-Status", description: "Multiple status codes for WebDAV" },
  208: { message: "Already Reported", description: "WebDAV binding members already listed" },
  226: { message: "IM Used", description: "Instance manipulation applied" },

  // 3xx Redirection
  300: { message: "Multiple Choices", description: "Multiple options for resource representation" },
  301: { message: "Moved Permanently", description: "Resource permanently moved to new URL" },
  302: { message: "Found", description: "Resource temporarily at different URL" },
  303: { message: "See Other", description: "Response at different URL (GET)" },
  304: { message: "Not Modified", description: "Cached version still valid" },
  305: { message: "Use Proxy", description: "Must access through proxy" },
  307: { message: "Temporary Redirect", description: "Repeat request with same method" },
  308: { message: "Permanent Redirect", description: "Permanently redirect with same method" },

  // 4xx Client Errors
  400: { message: "Bad Request", description: "Malformed request syntax" },
  401: { message: "Unauthorized", description: "Authentication required" },
  402: { message: "Payment Required", description: "Reserved for future use" },
  403: { message: "Forbidden", description: "Server refuses action" },
  404: { message: "Not Found", description: "Resource doesn't exist" },
  405: { message: "Method Not Allowed", description: "HTTP method not supported" },
  406: { message: "Not Acceptable", description: "No matching content type" },
  407: { message: "Proxy Auth Required", description: "Client must authenticate with proxy" },
  408: { message: "Request Timeout", description: "Server timed out waiting" },
  409: { message: "Conflict", description: "Request conflicts with current state" },
  410: { message: "Gone", description: "Resource permanently removed" },
  411: { message: "Length Required", description: "Content-Length header missing" },
  412: { message: "Precondition Failed", description: "Request conditions not met" },
  413: { message: "Payload Too Large", description: "Request exceeds size limits" },
  414: { message: "URI Too Long", description: "Request URI too long" },
  415: { message: "Unsupported Media Type", description: "Unsupported payload format" },
  416: { message: "Range Not Satisfiable", description: "Can't satisfy Range header" },
  417: { message: "Expectation Failed", description: "Can't meet Expect header" },
  418: { message: "I'm a teapot", description: "April Fools' joke status code" },
  421: { message: "Misdirected Request", description: "Server can't produce response" },
  422: { message: "Unprocessable Entity", description: "Semantic request errors" },
  423: { message: "Locked", description: "Resource is locked (WebDAV)" },
  424: { message: "Failed Dependency", description: "Request depended on failed request" },
  425: { message: "Too Early", description: "Risk of request replay" },
  426: { message: "Upgrade Required", description: "Client must switch protocols" },
  428: { message: "Precondition Required", description: "Conditional request required" },
  429: { message: "Too Many Requests", description: "Rate limiting applied" },
  431: { message: "Header Fields Too Large", description: "Request headers too large" },
  451: { message: "Unavailable For Legal Reasons", description: "Legal restriction" },

  // 5xx Server Errors
  500: { message: "Internal Server Error", description: "Unexpected server error" },
  501: { message: "Not Implemented", description: "Unsupported request method" },
  502: { message: "Bad Gateway", description: "Invalid response from upstream" },
  503: { message: "Service Unavailable", description: "Server temporarily overloaded" },
  504: { message: "Gateway Timeout", description: "Upstream server timeout" },
  505: { message: "HTTP Version Not Supported", description: "Unsupported HTTP version" },
  506: { message: "Variant Also Negotiates", description: "Circular content negotiation" },
  507: { message: "Insufficient Storage", description: "Storage space issue (WebDAV)" },
  508: { message: "Loop Detected", description: "Infinite loop detected (WebDAV)" },
  510: { message: "Not Extended", description: "Further extensions required" },
  511: { message: "Network Auth Required", description: "Client needs network authentication" }
};

module.exports = STATUS_MESSAGE;