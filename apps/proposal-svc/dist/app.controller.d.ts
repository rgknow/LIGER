import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createProposal(proposalRequest: any): any;
    getProposal(id: string): any;
    approveProposal(id: string): any;
    rejectProposal(id: string): any;
}
