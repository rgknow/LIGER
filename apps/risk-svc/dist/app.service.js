"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    assessProposalRisk(proposal) {
        console.log('Assessing risk for proposal:', proposal);
        const { vertical, type, amount, studentSCS, studentAge } = proposal;
        let riskScore = 0;
        const factors = [];
        const verticalRisk = this.getVerticalRisk(vertical);
        riskScore += verticalRisk.score;
        factors.push(verticalRisk.factor);
        const amountRisk = this.getAmountRisk(amount);
        riskScore += amountRisk.score;
        if (amountRisk.factor)
            factors.push(amountRisk.factor);
        const scsAdjustment = this.getSCSRiskAdjustment(studentSCS);
        riskScore += scsAdjustment.score;
        if (scsAdjustment.factor)
            factors.push(scsAdjustment.factor);
        const ageAdjustment = this.getAgeRiskAdjustment(studentAge);
        riskScore += ageAdjustment.score;
        if (ageAdjustment.factor)
            factors.push(ageAdjustment.factor);
        const riskLevel = this.determineRiskLevel(riskScore);
        const requirements = this.getRiskRequirements(riskLevel);
        const recommendations = this.generateRecommendations(proposal, riskLevel, studentSCS);
        return {
            riskLevel,
            riskScore,
            factors,
            requirements,
            recommendations
        };
    }
    getRiskRequirements(riskLevel) {
        switch (riskLevel) {
            case 'Low':
                return {
                    requires2FA: false,
                    additionalChecks: []
                };
            case 'Medium':
                return {
                    minSCS: 60,
                    requires2FA: false,
                    maxAmount: 1000,
                    additionalChecks: ['Parent review of learning materials']
                };
            case 'High':
                return {
                    minSCS: 80,
                    requires2FA: true,
                    maxAmount: 500,
                    additionalChecks: [
                        'Mandatory cooling-off period (24 hours)',
                        'Parent quiz on risks',
                        'Student essay on rationale'
                    ]
                };
            default:
                return { requires2FA: false };
        }
    }
    getVerticalRisk(vertical) {
        const verticalRisks = {
            'chores': { score: 0, factor: 'Low-risk chores and savings' },
            'savings': { score: 5, factor: 'Savings bundles - minimal risk' },
            'real-estate': { score: 15, factor: 'Fractional real estate - moderate risk' },
            'stocks': { score: 20, factor: 'Equity investments - market volatility' },
            'commodities': { score: 25, factor: 'Commodities trading - price volatility' },
            'crypto': { score: 35, factor: 'Cryptocurrency - high volatility' },
            'p2p-lending': { score: 30, factor: 'P2P lending - default risk' },
            'vc-funds': { score: 40, factor: 'VC/Hedge funds - illiquid and high risk' },
            'collectibles': { score: 35, factor: 'Collectibles - illiquid markets' }
        };
        return verticalRisks[vertical] || { score: 25, factor: 'Unknown vertical' };
    }
    getAmountRisk(amount) {
        if (amount <= 100)
            return { score: 0, factor: null };
        if (amount <= 500)
            return { score: 5, factor: 'Moderate investment amount' };
        if (amount <= 1000)
            return { score: 15, factor: 'Large investment amount' };
        return { score: 25, factor: 'Very large investment amount' };
    }
    getSCSRiskAdjustment(scs) {
        if (scs >= 90)
            return { score: -10, factor: 'Excellent SCS reduces risk' };
        if (scs >= 80)
            return { score: -5, factor: 'High SCS reduces risk' };
        if (scs >= 60)
            return { score: 0, factor: null };
        if (scs >= 40)
            return { score: 10, factor: 'Low SCS increases risk' };
        return { score: 20, factor: 'Very low SCS significantly increases risk' };
    }
    getAgeRiskAdjustment(age) {
        if (age >= 17)
            return { score: -5, factor: 'Older student reduces risk' };
        if (age >= 15)
            return { score: 0, factor: null };
        if (age >= 13)
            return { score: 5, factor: 'Younger student increases risk' };
        return { score: 10, factor: 'Very young student increases risk' };
    }
    determineRiskLevel(score) {
        if (score <= 10)
            return 'Low';
        if (score <= 30)
            return 'Medium';
        return 'High';
    }
    generateRecommendations(proposal, riskLevel, scs) {
        const recommendations = [];
        if (riskLevel === 'High') {
            recommendations.push('Consider starting with a smaller amount');
            recommendations.push('Review educational materials on this investment type');
            recommendations.push('Discuss long-term goals and risk tolerance');
        }
        if (scs < 70) {
            recommendations.push('Focus on building SCS through chores and learning modules');
            recommendations.push('Consider starting with lower-risk investments');
        }
        if (proposal.vertical === 'crypto') {
            recommendations.push('Understand volatility and only invest what you can afford to lose');
        }
        if (proposal.amount > 500) {
            recommendations.push('Consider dollar-cost averaging instead of lump sum');
        }
        return recommendations;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map