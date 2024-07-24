from pinecone import Pinecone
from pinecone import ServerlessSpec
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import os
import time
import json
from dotenv import load_dotenv

load_dotenv("keys.env")

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
spec = ServerlessSpec(cloud="aws", region="us-east-1")
index_name = "dragongpt"
index = pc.Index(index_name)

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')


def make_index(index_name):
    if index_name in pc.list_indexes().names():
        pc.delete_index(index_name)

    pc.create_index(
        name=index_name,
        dimension=384,
        metric="cosine",
        spec=spec
    )

    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)
    print("Index Created")

def create_vector(json_data):
    return embedding_model.encode(json.dumps(json_data))


# TODO THIS DATA NEEDS TO BE BATCHED or PARALELLIZED
def add_json_file_to_index(filepath):
    filepath = r"data_collection\tools\drexel_catalog\course_desc_json_files\undergrad_quarter_majors.json"
    with open(filepath, "r") as f:
        # data must be a list of jsons [{"data": data, "url": url},...]
        data = json.load(f)

    pinecone_data = []
    for item in tqdm(data):
        data = item['data']
        vector = create_vector(data)
        metadata = {
            'Identifier': data['Identifier'],
            'Title': data['Title'],
            'Number_of_credits': data['Number_of_credits'],
            'Description': data['Description'],
            'College/Department': data['College/Department'],
            'Repeat Status': data['Repeat Status'],
            'Prerequisites': data['Prerequisites'],
            'url': item['url']
        }
        pinecone_data.append({
            'id': data['Identifier'],
            'values': vector,
            'metadata': metadata
        })

    index.upsert(pinecone_data)

    print("Added data to index")

    print(index.describe_index_stats())


def query_from_index(prompt):
    print(index.query(
        vector=embedding_model.encode(prompt),
        top_k=5,
        include_values=True
        ))
query_from_index("Computer Science")