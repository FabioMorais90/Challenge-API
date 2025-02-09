import { test, request, expect, BrowserContext, Page, Locator} from "@playwright/test";
import { JinkanApiClient } from "../clients/JinkanApiClient";

const testResponse1 = {
    mal_id : 1,
    url : "https://myanimelist.net/anime/1011/Ranma_½_Super/episode/1",
    title: 	"Cursed Tunnel of Lost Love",
    title_japanese: "ああ呪いの破恋洞! 我が愛は永遠に",
    title_romanji: "Aa Noroi no Harendou! Waga Ai wa Eien ni",
    duration: null,
    aired: "1995-09-21T00:00:00+09:00",
    filler: false,
    recap: false,
    synopsis: null,
};


const testEndPoint = "/anime/9999/episodes/99";
const testMockedResponse = {
    mal_id: 1,
    url : "lol",
    title: "recbtiojiy",
    title_japanese: "recbtiojiy",
    title_romanji: "recbtiojiy",
    duration: 0,
    aired: "string",
    filler: true,
    recap: true,
    synopsis: "string",
}

test.describe('Final Challenge API',() => {
    let jinkanApiClient: JinkanApiClient;
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({}) => {
        const requestContext = await request.newContext();
        jinkanApiClient = new JinkanApiClient(requestContext);
    });

    test.beforeEach(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    test('GET request by passing Endpoint, should return 200 and data should be valid', async () => {
        //Pass endpoint to get response.
        let endpoint = "/anime/1011/episodes/1";
        const response = await jinkanApiClient.getPost(endpoint);

        //Test if resposne is 200 or 2xx
        console.log(await response.json());
        await expect(response).toBeOK();
        
        //Validate
        const body = await response.json();
        await expect(body.data.mal_id).toBe(testResponse1.mal_id);
        await expect(body.data.url).toBe(testResponse1.url);
        await expect(body.data.title).toBe(testResponse1.title);
        await expect(body.data.title_japanese).toBe(testResponse1.title_japanese);
        await expect(body.data.title_romanji).toBe(testResponse1.title_romanji);
        await expect(body.data.duration).toEqual(testResponse1.duration);
        await expect(body.data.aired).toBe(testResponse1.aired);
        await expect(body.data.filler).toEqual(testResponse1.filler);
        await expect(body.data.recap).toEqual(testResponse1.recap);
        await expect(body.data.synopsis).toEqual(testResponse1.synopsis);

    });

    test('Mock Response', async () => {
        const mockedResponse1 = require('../json/mockedResponse1.json')
        let site = "https://api.jikan.moe/v4"
        
        await page.route('**/v4'  + testEndPoint, async (route) => {
            const response = await route.fetch();
            const json = await response.json();
            console.log(json);
            console.log(mockedResponse1);
            route.fulfill({
                status: 200,
                json: mockedResponse1
            });
        })
        await page.goto(site+testEndPoint);
        const body = await page.locator("//pre");
        await expect(page.locator("//pre")).toContainText(testMockedResponse.title);

    });

});