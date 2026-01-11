import { NextResponse } from 'next/server';
import { perplexityClient } from '@/lib/perplexity';

export async function POST(req: Request) {
    try {
        const { productName, price } = await req.json();

        if (!productName || price === undefined) {
            return NextResponse.json(
                { error: 'Product name and price are required' },
                { status: 400 }
            );
        }

        const analysis = await perplexityClient.analyzePrice(productName, price);
        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('Analysis API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
