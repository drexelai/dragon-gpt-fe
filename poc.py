import streamlit as st
from openai import OpenAI
import faiss
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os

load_dotenv("keys.env") # this api key will have to come from production environment or an external storage unit

if 'messages' not in st.session_state:
    st.session_state['messages'] = []

def initialize_faiss():
    model = SentenceTransformer('all-MiniLM-L6-v2')
    index = faiss.IndexFlatL2(384)
    return model, index

model, index = initialize_faiss()

def add_to_index(text, model, index):
    vector = model.encode([text])
    index.add(vector)
    return vector

def retrieve_from_index(query, model, index, k=5):
    query_vector = model.encode([query])
    distances, indices = index.search(query_vector, k)
    return distances, indices

def generate_response(prompt):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that answers my questions about Drexel University using the latest and most up to date information."},
        {"role": "user", "content": prompt}
    ])
    print(response.choices)
    return response.choices[0].message.content

def chat():
    st.title("Dragon GPT")

    user_input = st.text_input("You:", key="input")
    if st.button("Send"):
        if user_input:
            # Store user message
            st.session_state.messages.append({"role": "user", "content": user_input})

            # Retrieve relevant documents
            distances, indices = retrieve_from_index(user_input, model, index)

            # Assuming documents are stored in a list for demonstration
            documents = ["Doc 1", "Doc 2", "Doc 3", "Doc 4", "Doc 5"]
            retrieved_docs = [documents[i] for i in indices[0]]

            # Generate response using LLM
            prompt = f"Context: {' '.join(retrieved_docs)}\nUser: {user_input}\nAssistant:"
            response = generate_response(prompt)

            # Store response
            st.session_state.messages.append({"role": "assistant", "content": response})

    # Display conversation history
    for msg in st.session_state.messages:
        st.write(f"{msg['role'].capitalize()}: {msg['content']}")

chat()
