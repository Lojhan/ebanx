import { serve, Server } from 'bun'

import { AccountsModule } from './accounts'

const app = serve({
    port: 3000,
    async fetch(this, request: Request, server: Server) { 
        const response = await AccountsModule.init(request)
        if (response) return response;
        return new Response('Not found', { status: 404 })
    },
    
})
