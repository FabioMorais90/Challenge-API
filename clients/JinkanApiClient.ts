import { APIRequestContext } from "@playwright/test";

const baseURL: string = "https://api.jikan.moe/v4";;

export class JinkanApiClient {
    private requestContext: APIRequestContext;

    constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
    }

    async getPost(endpoint: string) {
        return await this.requestContext.get(baseURL + endpoint);
    }

}