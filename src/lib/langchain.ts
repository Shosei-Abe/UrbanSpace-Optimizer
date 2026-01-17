import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { pinecone, indexName } from './pinecone';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
}

export async function getVectorStore() {
    const pineconeIndex = pinecone.Index(indexName);

    return await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
        }),
        { pineconeIndex }
    );
}
