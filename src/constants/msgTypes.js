"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
//  getProfileList, getProcParameter, getList, getProfilePack
//  only request types
//
var MESSAGE_REQUEST;
(function(MESSAGE_REQUEST) {
  MESSAGE_REQUEST["getProfileList"] = "GET_PROFILE_LIST_REQUEST";
  MESSAGE_REQUEST["getProcParameter"] = "GET_PROC_PARAMETER_REQUEST";
  MESSAGE_REQUEST["setProcParameter"] = "SET_PROC_PARAMETER_REQUEST";
  MESSAGE_REQUEST["getList"] = "GET_LIST_REQUEST"; // 0x00000700
  //getProfilePack = "GetProfilePackRequest" // currently unused
})(
  (MESSAGE_REQUEST = exports.MESSAGE_REQUEST || (exports.MESSAGE_REQUEST = {}))
);
var MESSAGE_RESPONSE;
(function(MESSAGE_RESPONSE) {
  MESSAGE_RESPONSE["getProfileList"] = "GET_PROFILE_LIST_RESPONSE";
  MESSAGE_RESPONSE["getProcParameter"] = "GET_PROC_PARAMETER_RESPONSE";
  MESSAGE_RESPONSE["setProcParameter"] = "SET_PROC_PARAMETER_RESPONSE";
  MESSAGE_RESPONSE["getList"] = "GET_LIST_RESPONSE"; //  0x00000701
  //getProfilePack = "GetProfilePackResponse" // currently unused
})(
  (MESSAGE_RESPONSE =
    exports.MESSAGE_RESPONSE || (exports.MESSAGE_RESPONSE = {}))
);
//# sourceMappingURL=msgTypes.js.map
