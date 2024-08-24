import os
from flask import Flask, request, jsonify, Response
from dotenv import load_dotenv
from openai import OpenAI
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../data_collection'))
import data_manager

load_dotenv("keys.env")

app = Flask(__name__)
app.config['DEBUG'] = os.environ["DEBUG_FLASK"]

from flask_cors import CORS
CORS(app)

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.route("/query", methods=["POST"])
def query_llm():
    try:
        data = request.get_json()
        query = data.get("query")
        if not query:
            return jsonify({"detail": "Query is required"}), 400

        RAG = data_manager.query_from_index(query)
        
        system_prompt = "You are a helpful assistant that answers questions about Drexel University using the latest and most up to date information"
        user_prompt = f"{RAG}\n\nGiven the above context, accurately answer the following query. Forget everything you knew before and only use the information found in the context to answer the prompt. If you can't answer the prompt with the information provided, say that you're not sure and provide some helpful links to find the information:\n\n{query}"
        output_format = "\nPlease answer only in a couple sentences and render the entire response in markdown."

        def generate():
            stream = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt + output_format}
                ],
                stream=True
            )
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    print(content)  # Print the content for debugging purposes
                    yield content

        return Response(generate(), content_type="text/plain-text")
    
    except Exception as e:
        print(e)
        return jsonify({"answer": str(e)}), 500

if __name__ == "__main__":
    app.run()