# started template
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import pandas as pd
from flask import Flask,request
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app=Flask(__name__)
CORS(app,
     supports_credentials=True,
     methods=['GET', 'POST','OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     max_age=3600,
     origins=['https://improved-giggle-9xq9j6rq4pj3gwr-3000.app.github.dev'])


# GPT integration
endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

@app.route('/')
def backend_check():
    return {"message":'Backend works!'}

def refer_db(query):
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    index = faiss.read_index("faiss/index.faiss")
    query_embedding = embedding_model.encode([query])
    D, I = index.search(np.array(query_embedding), k=3)

    # Load texts
    with open("faiss/texts.txt") as f:
        texts = f.readlines()

    # Get top matches
    context = "\n".join([texts[i] for i in I[0]])
    user_message_context=f"Data:\n {context}\n\n Question:{query}"
    return getGPTResponse(user_message_context)

@app.route('/query',methods=['POST','OPTIONS'])
def search():
    data=request.get_json()
    query=data['query']
    if('botique datasource' in query):
        return refer_db(query)
    return getGPTResponse(query)

def getGPTResponse(user_message):
    response = client.complete(
        messages=[
            SystemMessage("You are a friendly assistant."),
            UserMessage(user_message),
        ],  
        model=model
    )
    output={
            "message":response.choices[0].message.content,
            "isClient":False,
            "isLoading":False
            }
    return output

app.run(host='0.0.0.0')