import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
    console.log('Testing connection...');

    // Dynamic imports to ensure dotenv loads first
    const { pinecone, indexName } = await import('../lib/pinecone');
    const { getVectorStore } = await import('../lib/langchain');

    try {
        // 1. Check Pinecone Client
        console.log(`Checking Pinecone index: ${indexName}...`);
        const index = pinecone.Index(indexName);
        const stats = await index.describeIndexStats();
        console.log('✅ Pinecone connected. Stats:', stats);

        // 2. Check LangChain + OpenAI Embeddings
        console.log('Checking LangChain + OpenAI Embeddings...');
        const vectorStore = await getVectorStore();

        // Create a dummy document to embed
        const results = await vectorStore.similaritySearch("hello world", 1);
        console.log('✅ LangChain vector store search successful.');

        console.log('🎉 All connections verified successfully!');
    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
