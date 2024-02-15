export var RequestMethod;
(function (RequestMethod) {
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["GET"] = "GET";
    RequestMethod["PATCH"] = "PATCH";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["POST"] = "POST";
    RequestMethod["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
export * from './abstractions';
