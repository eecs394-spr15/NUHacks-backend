import json
import requests

from pprint import pprint

with open('posts.json') as data_file:    
    data = json.load(data_file)

url = 'https://dry-coast-1630.herokuapp.com/post'

for post in data["data"]["children"]:
	post_params = dict()
	post_params['author'] = post['data']['author']
	post_params['text'] = post['data']['title']

	# print(post_params)
	# print(" ")
	print post_params
	r = requests.post(url, data=post_params)
	print r.text
	# print(r.text)



	

