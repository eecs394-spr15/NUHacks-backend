import json
import requests

from pprint import pprint

with open('posts.json') as data_file:    
    data = json.load(data_file)

url = 'https://dry-coast-1630.herokuapp.com/post'

for post in data["data"]["children"]:
	post_params = dict()
	post_params['author'] = post['data']['author']
	post_params['title'] = post['data']['title']

	# print(post_params)
	# print(" ")
	r = requests.post(url, params=post_params)
	# print(r.text)



	

