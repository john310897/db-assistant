# started template
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
import pandas as pd
from flask import Flask,request,jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json

app=Flask(__name__)
CORS(app,
     supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
    resources={r"/*": {"origins": "*"}},
     origins=['https://improved-giggle-9xq9j6rq4pj3gwr-3000.app.github.dev'])

# GPT integration
endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)
def auth(func):
    def wrapper(*args,**kwargs):
        print("authenticating****************************")
        return func(*args,**kwargs)
    return wrapper

def refer_db(query):
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    index = faiss.read_index("src/faiss/index.faiss")
    query_embedding = embedding_model.encode([query])
    D, I = index.search(np.array(query_embedding), k=3)

    # Load texts
    with open("src/faiss/texts.txt") as f:
        texts = f.readlines()

    # Get top matches
    context = "\n".join([texts[i] for i in I[0]])
    user_message_context=f"Data:\n {context}\n\n Question:{query}"
    return getGPTResponse(user_message_context)

@app.route('/')
def backend_check():
    return {"message":'Backend works!'}

@app.route('/get_datasource')
def get_datasource():
    df=pd.read_csv('src/datasource/fashion_boutique_dataset.csv')
    df = df.astype(object)
    df = df.where(pd.notnull(df), None)
    result=df.to_dict(orient='records')
    return jsonify(result)

@app.route('/testPost',methods=['POST','OPTIONS','GET'])
@auth
def testPost():
    return {"message":"post works fine"}

@app.route('/query/<queryString>',methods=['POST','OPTIONS','GET'])
def search(queryString):
    # data=request.get_json()
    query=queryString #or data['query']
    if('-botique' in query):
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

app.run(host='0.0.0.0',port=5001, debug=True)