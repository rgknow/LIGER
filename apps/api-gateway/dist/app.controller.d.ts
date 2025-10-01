import { ClientProxy } from '@nestjs/microservices';
export declare class AppController {
    private client;
    constructor(client: ClientProxy);
    createProposal(proposalRequest: any): import("rxjs").Observable<any>;
    getProposal(id: string): import("rxjs").Observable<any>;
    approveProposal(id: string): import("rxjs").Observable<any>;
    rejectProposal(id: string): import("rxjs").Observable<any>;
}
