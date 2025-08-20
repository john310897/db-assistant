from sentence_transformers import SentenceTransformer
import pandas as pd
import faiss
import numpy as np

# Load CSV
df = pd.read_csv("datasource/fashion_boutique_dataset.csv")

# Convert rows to strings
texts = df.astype(str).apply(" | ".join, axis=1).tolist()

# Generate embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(texts)

# Create FAISS index
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

# Save index and texts
faiss.write_index(index, "index.faiss")
with open("texts.txt", "w") as f:
    f.write("\n".join(texts))