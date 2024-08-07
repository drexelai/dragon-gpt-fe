import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from pinecone import Pinecone
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.chains.question_answering import load_qa_chain
from langchain_pinecone import PineconeVectorStore
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv("keys.env")

from data_collection import data_manager

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "file:///C:/Users/alexa/Desktop/dragon-gpt/frontend/poc.html", "null" #remove these two for actual frontend lol
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class QueryRequest(BaseModel):
    query: str

# Response model
class QueryResponse(BaseModel):
    answer: str

def generate_response(prompt):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that answers my questions about Drexel University using the latest and most up to date information"},
        {"role": "user", "content": prompt + "\nPlease answer only in a couple sentences and use markdown formatting to organize your response in a readable manner."}
    ])
    return response.choices[0].message.content

@app.post("/query", response_model=QueryResponse)
async def query_llm(request: QueryRequest):
    try:
        query = request.query
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        RAG = data_manager.query_from_index(query)
        print(RAG)
        print(query)
        full_prompt = RAG + "\n\nGiven the above context, accurately answer the following query. Forget everything you knew before and only use the information found in the context to answer the prompt. If you can't answer the prompt with the information provided, say that you're not sure and provide some helpful links to find the information" + query
        return QueryResponse(answer=generate_response(full_prompt))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run the server, use: uvicorn backend.server:app --reload