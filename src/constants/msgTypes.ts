//
//  getProfileList, getProcParameter, getList, getProfilePack
//  only request types
//
export enum MESSAGE_REQUEST {
  getProfileList = "GET_PROFILE_LIST_REQUEST", //  0x00000400,
  getProcParameter = "GET_PROC_PARAMETER_REQUEST", // 0x00000500
  setProcParameter = "SET_PROC_PARAMETER_REQUEST", // 0x00000600
  getList = "GET_LIST_REQUEST" // 0x00000700
  //getProfilePack = "GetProfilePackRequest" // currently unused
}

export enum MESSAGE_RESPONSE {
  getProfileList = "GET_PROFILE_LIST_RESPONSE", // 0x00000401
  getProcParameter = "GET_PROC_PARAMETER_RESPONSE", // 0x00000501
  setProcParameter = "SET_PROC_PARAMETER_RESPONSE", // 0x00000601
  getList = "GET_LIST_RESPONSE" //  0x00000701
  //getProfilePack = "GetProfilePackResponse" // currently unused
}
