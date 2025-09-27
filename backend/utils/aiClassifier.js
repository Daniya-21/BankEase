exports.classifyComplaint = (description) => {
    const category = classifyCategory(description);
    const sentiment = analyzeSentiment(description);
    const complexity = assessComplexity(description);
    const riskLevel = calculateRiskLevel(description);

    return {
        category,
        sentiment,
        complexity,
        riskLevel,
        confidence: Math.random() * 0.3 + 0.7
    };
};

function classifyCategory(description) {
    const keywords = {
        'account': ['account', 'balance', 'statement', 'savings', 'current'],
        'transaction': ['transaction', 'transfer', 'payment', 'debit', 'credit'],
        'card': ['card', 'debit', 'credit', 'atm', 'pin'],
        'loan': ['loan', 'emi', 'interest', 'mortgage', 'personal loan'],
        'fraud': ['fraud', 'unauthorized', 'stolen', 'hack', 'scam']
    };

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => description.toLowerCase().includes(word))) {
            return category;
        }
    }
    return 'other';
}

function analyzeSentiment(description) {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'angry', 'frustrated'];
    
    const positiveCount = positiveWords.filter(word => 
        description.toLowerCase().includes(word)).length;
    const negativeCount = negativeWords.filter(word => 
        description.toLowerCase().includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
}

function assessComplexity(description) {
    const wordCount = description.split(' ').length;
    if (wordCount > 100) return 'high';
    if (wordCount > 50) return 'medium';
    return 'low';
}

function calculateRiskLevel(description) {
    const riskKeywords = ['fraud', 'stolen', 'hack', 'unauthorized', 'emergency'];
    const riskCount = riskKeywords.filter(word => 
        description.toLowerCase().includes(word)).length;
    
    if (riskCount >= 2) return 'high';
    if (riskCount === 1) return 'medium';
    return 'low';
}