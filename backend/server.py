import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from pinecone import Pinecone
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.chains.question_answering import load_qa_chain
from langchain_pinecone import PineconeVectorStore
from fastapi.middleware.cors import CORSMiddleware

from data_collection import data_manager

from dotenv import load_dotenv
load_dotenv("keys.env")

# Ensure environment variables for API keys are set
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not PINECONE_API_KEY or not OPENAI_API_KEY:
    raise EnvironmentError("API keys for Pinecone or OpenAI not set in environment variables")

# Initialize Pinecone
pinecone = Pinecone(api_key=PINECONE_API_KEY)
index_name = "dragongpt"

# Set up the Pinecone client and index
pinecone_index = pinecone.Index(index_name)

# Initialize LangChain components
llm = OpenAI(api_key=OPENAI_API_KEY)
embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
vector_store = PineconeVectorStore(index_name=index_name, embedding=embeddings)

# Initialize FastAPI
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
        {"role": "system", "content": "You are a helpful assistant that answers my questions about Drexel University using the latest and most up to date information. Please answer in a couple sentences and using markdown formatting to organize your response in a readable manner."},
        {"role": "user", "content": prompt}
    ])
    #print(response.choices)
    return response.choices[0].message.content
# Define the endpoint
@app.post("/query", response_model=QueryResponse)
async def query_llm(request: QueryRequest):
    try:
        query = request.query
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        RAG = data_manager.query_from_index(query)
        print(RAG)
        print(query)
        full_prompt = RAG + "\n\nGiven the above context, accurately answer the following query" + query
        return QueryResponse(answer=generate_response(full_prompt))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run the server, use: uvicorn backend.server:app --reload