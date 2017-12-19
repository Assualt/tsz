import os
import json
import re
book_img_path='dist\\res\\book_img\\'
relpath=os.path.join(os.path.pardir,book_img_path)
book=os.path.abspath(relpath)
print(book)
# book_info={
#     "book_name":"",
#     "img_url":"",
#     "price_now":"",
#     "price_before":"",
#     "book_author":"",
#     "book_edition":"",
#     "book_publisher":"",
#     "book_seller":"",
#     "book_uni":"",
#     "book_description":""
# }
a=os.listdir(book)
with open('../dist/res/json/book_recommend.json','r',encoding='utf-8') as file:
    print(file.read())

# for book_name in a:
#     book_url=os.path.join(relpath,book_name)
#     json_book_info=json.loads(json.dumps(book_info))
#     json_book_info['book_name']=book_name
#     json_book_info['img_url']=book_url
#     print(str(json_book_info))
#     print (book_url,type(json_book_info))
