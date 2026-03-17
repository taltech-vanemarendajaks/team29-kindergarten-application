import { defineConfig } from 'orval';

export default defineConfig({
    kindergarten: {
        input: {
            target: '../openapi/openapi.bundled.yaml',
        },
        output: {
            mode: 'tags-split',
            target: './src/api/generated/hooks',
            schemas: './src/api/generated/models',
            client: 'react-query',
            prettier: true,
            override: {
                mutator: {
                    path: './src/api/fetch-instance.ts',
                    name: 'fetchInstance',
                },
            },
        },
    },
});