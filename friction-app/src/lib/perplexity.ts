export interface PriceAnalysisResult {
    recommendation: 'BUY' | 'WAIT' | 'DONT_BUY';
    confidence: number;
    reasoning: string;
    currentPrice: number;
    fairPrice: number;
}

export class PerplexityService {
    private apiKey: string;
    private baseUrl = 'https://api.perplexity.ai';

    constructor() {
        this.apiKey = process.env.PERPLEXITY_API_KEY || '';
        if (!this.apiKey) {
            console.warn('PERPLEXITY_API_KEY is not set');
        }
    }

    async analyzePrice(productName: string, currentPrice: number): Promise<PriceAnalysisResult> {
        if (!this.apiKey) {
            throw new Error('Perplexity API key is missing');
        }

        const prompt = `
        Analyze the price of "${productName}" which is currently listed for $${currentPrice}.
        Determine if this is a good price based on historical data and current market trends.
        Provide a recommendation (BUY, WAIT, or DONT_BUY), a confidence score (0-100), reasoning, and an estimated fair price.
        Return the response as a valid JSON object with the keys: recommendation, confidence, reasoning, currentPrice, fairPrice.
        Do not include any markdown formatting or extra text, just the JSON.
        `;

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'sonar-reasoning-pro',
                    messages: [
                        { role: 'system', content: 'You are a helpful shopping assistant that analyzes prices.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Perplexity API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Simple basic cleanup if needed, though instruction says just JSON
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(jsonStr) as PriceAnalysisResult;

        } catch (error) {
            console.error('Price Analysis Failed:', error);
            throw error;
        }
    }
}

export const perplexityClient = new PerplexityService();
