interface ProposalRiskAssessment {
    riskLevel: 'Low' | 'Medium' | 'High';
    riskScore: number;
    factors: string[];
    requirements: {
        minSCS?: number;
        requires2FA: boolean;
        maxAmount?: number;
        additionalChecks?: string[];
    };
    recommendations: string[];
}
export declare class AppService {
    assessProposalRisk(proposal: any): ProposalRiskAssessment;
    getRiskRequirements(riskLevel: string): {
        requires2FA: boolean;
        additionalChecks: any[];
        minSCS?: undefined;
        maxAmount?: undefined;
    } | {
        minSCS: number;
        requires2FA: boolean;
        maxAmount: number;
        additionalChecks: string[];
    } | {
        requires2FA: boolean;
        additionalChecks?: undefined;
        minSCS?: undefined;
        maxAmount?: undefined;
    };
    private getVerticalRisk;
    private getAmountRisk;
    private getSCSRiskAdjustment;
    private getAgeRiskAdjustment;
    private determineRiskLevel;
    private generateRecommendations;
}
export {};
