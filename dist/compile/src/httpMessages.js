"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMessages = void 0;
exports.httpMessages = {
    authentication: {
        denied: "Operation Denied",
        expired: "Session Expired. Please Reauthenticate",
        invalid: "Authentication Tokens/Credentials are Invalid",
        userAlreadyExists: "Cannot Create User. Already Exists",
        userDoesnotExist: "User dooes not Exist"
    },
    queryparameters: {
        crs: "Invalid crs",
        bboxcrs: "Invalid bbox-crs",
        otherparams: "Check and Ensure Documented Query Parameters are Being Used",
    },
    resources: {
        404: "Does not Exist on this Server",
        500: "Server Failed to Process Request"
    }
};
