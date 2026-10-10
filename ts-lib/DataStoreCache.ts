import type { ResponseResultData } from "./ResponseResult.ts";

export default class DataStoreCache {
    #cachedRequests: Array<CachedRequest>;
    
    constructor() {
        this.#cachedRequests = [];
    }


}

type CachedRequest = {
    requestInfo: RequestInfo,
    actionResult: ResponseResultData,
};