import http from "http";

export const httpRequest = {
    get: (options: http.ClientRequestArgs | string) => {
        return new Promise((resolve, reject) => {
            return http.get(options, resp => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
                resp.on('error', err => {
                    reject(err);
                });
            });
        });
    },
    post: (options: http.ClientRequestArgs, body?: unknown) => {
        options.method = 'POST'
        return new Promise((resolve, reject) => {
            const req = http.request(options, resp => {
                let data = '';
                resp.on('data', chunk => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
                resp.on('error', err => {
                    reject(err);
                });
            });
            if(body) {
                req.write(body)
            }
            req.end()
            return req
        });
    }
};