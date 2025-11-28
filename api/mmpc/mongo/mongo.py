import os
from pymongo import MongoClient

client = MongoClient(os.environ.get('MONGO_URI'))
db = client[os.environ.get('MONGO_DB')]

