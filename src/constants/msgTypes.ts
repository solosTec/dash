//
//  getProfileList, getProcParameter, getList, getProfilePack
//  only request types
//
export enum MESSAGE_REQUEST {
  getProfileList = "GetProfileListRequest",
  getProcParameter = "GetProcParameterRequest",
  setProcParameter = "SetProcParameterRequest",
  getList = "GetListRequest"
  //getProfilePack = "GetProfilePackRequest" // currently unused
}

export enum MESSAGE_RESPONSE {
  getProfileList = "GetProfileListResponse",
  getProcParameter = "GetProcParameterResponse",
  setProcParameter = "SetProcParameterResponse",
  getList = "GetListResponse"
  //getProfilePack = "GetProfilePackResponse" // currently unused
}
