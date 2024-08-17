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

def get_openai_response(system_message, user_prompt, outputformat="", model_name="gpt-4o-mini"):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model=model_name,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt + "\n" + outputformat}
        ]
    )
    return response.choices[0].message.content

@app.post("/query", response_model=QueryResponse)
async def query_llm(request: QueryRequest):
    try:
        query = request.query
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # reformat query if needed for optimal RAG-ing
        query_cleaned = get_openai_response("You are a grammar and spell checker who when given a query about a University and University topics, you will return back the same query but with its grammar and spelling fixed. If you see an acronym representing a course name, leave it alone.", 
                                            "Please reformat the below query to correct any mispellings and get the essence of what the user wants answered. Leave course names and acronyms alone just correct mispellings to help my RAG system be more robust. Please return me back just the fixed query and nothing more:\n" + query)
        print(query_cleaned)
        RAG = data_manager.query_from_index(query_cleaned)
        print(RAG)

        system_prompt = "You are a helpful assistant that answers my questions about Drexel University using the latest and most up to date information"
        user_prompt = RAG + "\n\nGiven the above context, accurately answer the following query. Forget everything you knew before and only use the information found in the context to answer the prompt. If you can't answer the prompt with the information provided, say that you're not sure and provide some helpful links to find the information:\n\n" + query_cleaned
        output_format = "\nPlease answer only in a couple sentences and use markdown formatting to organize your response in a readable manner."
        return QueryResponse(answer=get_openai_response(system_prompt, user_prompt, output_format))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run the server, use: uvicorn backend.server:app --reload