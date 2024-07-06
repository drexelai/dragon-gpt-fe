import streamlit as st
from openai import OpenAI
import faiss
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os

# Load API key from environment
load_dotenv("keys.env")

if 'messages' not in st.session_state:
    st.session_state['messages'] = []

# Initialize FAISS index and model
def initialize_faiss():
    model = SentenceTransformer('all-MiniLM-L6-v2')
    index = faiss.IndexFlatL2(384)
    return model, index

model, index = initialize_faiss()

# Function to add text to FAISS index
def add_to_index(texts, model, index):
    vectors = model.encode(texts)
    index.add(vectors)
    return vectors

# Function to retrieve from FAISS index
def retrieve_from_index(query, model, index, k=5):
    query_vector = model.encode([query])
    distances, indices = index.search(query_vector, k)
    return distances, indices

def generate_response(prompt):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that answers my questions about Drexel University using the latest and most up to date information. Please answer only in 1 paragraph."},
        {"role": "user", "content": prompt}
    ])
    #print(response.choices)
    return response.choices[0].message.content
def load_text_files(file_paths):
    all_contents = []
    for file_path in file_paths:
        with open(file_path, 'r') as file:
            contents = file.readlines()
            all_contents.extend(contents)
    add_to_index(all_contents, model, index)
    return all_contents

# Assuming you have two local text files
file_paths = ["data collection/johnfryemail.txt", "data collection/johnfrygoodbye.txt"]
texts = load_text_files(file_paths)

# Main chat function
def chat():
    st.title("Dragon GPT")

    user_input = st.text_input("You:", key="input")
    if st.button("Send"):
        if user_input:
            # Store user message
            st.session_state.messages.append({"role": "user", "content": user_input})

            response_before_rag = generate_response(user_input)
            print("_" * 50)
            print("Response Before RAG:", response_before_rag)
            # Retrieve relevant documents
            distances, indices = retrieve_from_index(user_input, model, index, k=3)
            retrieved_docs = [texts[i] for i in indices[0]]

            # Generate response using LLM
            prompt = f"Context: {' '.join(retrieved_docs)}\nUser: {user_input}\nAssistant:"
            response = generate_response(prompt)
            print("Additional Context:", ' '.join(retrieved_docs))
            print("Response Using RAG:", response)
            print("_" * 50)


            # Store response
            st.session_state.messages.append({"role": "assistant", "content": response})

    # Display conversation history
    for msg in st.session_state.messages:
        st.write(f"{msg['role'].capitalize()}: {msg['content']}")

chat()