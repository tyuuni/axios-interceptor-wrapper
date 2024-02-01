import { createServer } from 'http';
import { HttpClient } from './Client';
import Axios from 'axios';
import { expect } from 'chai';

const TEST_PORT = 8000;

const TEST_URL = `http://localhost:${TEST_PORT}`;

const identity = e => e;

describe('Request should work', async () => {
    const axios = Axios.create({
        baseURL: TEST_URL,
        timeout: 1000
    });
    const httpClient = new HttpClient(axios);
    const server = createServer((req, res) => {
        if (req.url.endsWith('/200')) {
            res.writeHead(200);
            res.write(Buffer.from(JSON.stringify({
                count: 0,
                entities: []
            })));
            res.end();
            return;
        }
        if (req.url.endsWith('/401')) {
            res.writeHead(401);
            res.write(Buffer.from(JSON.stringify({
                code: 401,
                message: 'not logged in'
            })));
            res.end();
            return;
        }
        if (req.url.endsWith('/404')) {
            res.writeHead(404);
            res.write(Buffer.from(JSON.stringify({
                code: 404,
                message: 'resource does not exists'
            })));
            res.end();
            return;
        }
        if (req.url.endsWith('/406')) {
            res.writeHead(406);
            res.write(Buffer.from(JSON.stringify({
                code: 406,
                message: 'incorrect request'
            })));
            res.end();
            return;
        }
        if (req.url.endsWith('/500')) {
            res.writeHead(500);
            res.write(Buffer.from(JSON.stringify({
                code: 500,
                message: 'internal error'
            })));
            res.end();
            return;
        }
        if (req.url.endsWith('/timeout')) {
            res.writeHead(200);
            return;
        }
    });

    before(async () => {
        server.listen(TEST_PORT);
        await new Promise((resolve => {
            setTimeout(resolve, 1000);
        }));
    });

    after(async () => {
        server.close();
    });

    it('get method should work. Case 1: 200', async () => {
        const response = await httpClient.get('/200', undefined);
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({
            count: 0,
            entities: []
        });
    });

    it('get method should work. Case 2: 404', async () => {
        const response = await httpClient.get('/404', undefined);
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({
            code: 404,
            message: 'resource does not exists'
        });
    });

    it('get method should work. Case 3: 406', async () => {
        const response = await httpClient.get('/406', undefined);
        expect(response.status).to.equal(406);
        expect(response.body).to.deep.equal({
            code: 406,
            message: 'incorrect request'
        });
    });

    it('get method should work. Case 4: 500', async () => {
        const response = await httpClient.get('/500', undefined);
        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({
            code: 500,
            message: 'internal error'
        });
    });

    it('get method should work. Case 5: timeout error should be propagated', async () => {
        try {
            await httpClient.get('/timeout', undefined, 10);
        } catch (e) {
            expect(e).not.to.be.null;
            return ;
        }
        // should not reach here
        expect(false).to.be.true;
    });

    it('get method should work. Case 6: timeout error should be caught by interceptor', async () => {
        const client = new HttpClient(axios);
        client.intercept(async (ctx, next) => {
            try {
                await next();
            } catch (e) {
                expect(e).not.to.be.null;
                return;
            }
            // should not reach here
            expect(false).to.be.true;
        });
        const response = await client.get('/timeout', undefined, 10);
        expect(response).to.be.undefined;
    });

    it('get method should work. Case 7: extending context properties should work', async () => {
        let requestId = 0;
        const client = new HttpClient<{
            id: number
        }>(axios);
        client.intercept(async (ctx, next) => {
            ctx.id = requestId++;
            await next();
        });
        await client.get('/200');
        await client.get('/406');
        expect(requestId).to.equal(2);
    });
});
