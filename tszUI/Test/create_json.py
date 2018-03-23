import os
import json

# 当前文件目录
filePath = os.getcwd()
# 获取当前文件父目录
filePath = os.path.dirname(filePath)
# 获得资源结构目录
root = os.path.join(filePath, 'dist\\res')
# json 输出目录
jsonPath = os.path.join(root, 'json')
# book_img_path 图书目录
book_img_path = os.path.join(root, 'book_img')
# 获取当前目录的所有文件名
list = os.listdir(book_img_path)


# all_book.json create
def setJSON_ALL_BOOK(book_name, img_url, book_tags,
                     price_now, price_before, book_author, book_edition,
                     book_publisher, book_seller, book_seller_id, book_store_name,
                     book_uni, book_description):
    book = {}
    book["book_name"] = book_name
    book["img_url"] = img_url
    book["book_tags"] = book_tags
    book["price_now"] = price_now
    book["price_before"] = price_before
    book["book_author"] = book_author
    book["book_edition"] = book_edition
    book["book_publisher"] = book_publisher
    book["book_seller"] = book_seller
    book["book_seller_id"] = book_seller_id
    book["book_store_name"] = book_store_name
    book["book_uni"] = book_uni
    book["book_description"] = book_description
    return book
pass
# book-discount.json create
#     "book_name": "十爱",
#     "img_url": "dist/res/book_img/十爱.jpg",
#     "price_now": "1.00",
#     "price_before": "33.00",
#     "book_author": "卡耐基",
#     "book_edition": "第3版",
#     "book_publisher": "机械工业出版社",
#     "book_seller": "陈",
#     "book_seller_id": "",
#     "book_uni": "海南大学",
#     "book_description": ""
def setJSON_Book_Discount(book_name, img_url, price_now, price_before,
                     book_author, book_edition, book_publisher, book_seller,
                     book_seller_id, book_uni, book_description):
    book = {}
    book["book_name"] = book_name
    book["img_url"] = img_url
    book["price_now"] = price_now
    book["price_before"] = price_before
    book["book_author"] = book_author
    book["book_edition"] = book_edition
    book["book_publisher"] = book_publisher
    book["book_seller"] = book_seller
    book["book_seller_id"] = book_seller_id
    book["book_uni"] = book_uni
    book["book_description"] = book_description
    return book
pass
# "book_id":"10010",
# "book_store_id":"1234561",
# "book_store_name":"我的书店",
# "book_name":"兄弟",
# "book_img_url":"../dist/res/book_img/兄弟.jpg",
# "book_ads":"大卖特卖卖到无法或",
# "book_publish":"人民教育出版社",
# "book_author":"奥斯特洛夫斯基",
# "book_edition":"第一版",
# "book_price_before":"28",
# "book_price_now":"15",
# "book_left":"123",
# "book_else":"-"
def setJSON_user_book(book_id, book_store_id, book_store_name, book_name,
                      book_img_url, book_ads, book_publish, book_author, book_edition,
                      book_price_before, book_price_now, book_left, book_else):
    book = {}
    book["book_name"] = book_name
    book["book_img_url"] = book_img_url
    book["book_price_now"] = book_price_now
    book["book_price_before"] = book_price_before
    book["book_author"] = book_author
    book["book_edition"] = book_edition
    book["book_publish"] = book_publish
    book["book_store_id"] = book_store_id
    book["book_id"] = book_id
    book["book_else"] = book_else
    book["book_store_name"] = book_store_name
    book["book_ads"] = book_ads
    book["book_left"] = book_left
    return book
pass

# 生成 user-book
i = 0
user_book = {}
books = []
for file in list:
    i = i + 1
    file_book_name = file.split('.')[0]
    file_book_rel_path = os.path.relpath(os.path.join(book_img_path, file))
    file_book_price_now = "19.8"
    file_book_price_before = "29.8"
    file_book_author = "卡耐基"
    file_book_edition = "第二版"
    file_book_publisher = "人民教育出版社"
    file_book_seller_id = "1234561"
    file_book_store_name = "第"+str(i)+"书店"
    file_book_description = "无"
    file_book_left = "134"
    file_book_id = 10000+ i
    file_book_ads =" 欢迎来到"+file_book_store_name +"书店"
    c = setJSON_user_book(file_book_id, file_book_seller_id, file_book_store_name, file_book_name,
                          file_book_rel_path, file_book_ads, file_book_publisher, file_book_author,
                          file_book_edition, file_book_price_before, file_book_price_now, file_book_left
                          , file_book_description)
    books.append(c)

user_book["name"] = "sunshine"
user_book["name_id"] = "1234561"
user_book["books"] = books

user_books =[]
user_books.append(user_book)
user_books = json.dumps(user_books)

try:
    file = open('../dist/res/json/user_book_copy.json','w',encoding='utf-8')
except IOError:
    print('Io error')
else:
    file.write(str(user_book))
    file.close()
    print('create user-book-copy.json success')



# 生成 all_book
all_book = []
for file in list:
    # book_name
    file_book_name = file.split('.')[0]
    # img_url
    file_book_rel_path = os.path.relpath(os.path.join(book_img_path, file))
    # book_tags
    file_book_tags = ["励志", "阳光", "青春"]
    # price_now
    file_book_price_now = "19.8"
    # price_before
    file_book_price_before = "29.8"
    # book_author
    file_book_author = "卡耐基"
    # book_edition
    file_book_edition = "第二版"
    # book_publisher
    file_book_publisher = "人民教育出版社"
    # book_seller
    file_book_seller = "陈彦君"
    # book_seller_id
    file_book_seller_id = "1234561"
    # book_store_name
    file_book_store_name = "第一书店"
    # book_uni
    file_book_uni = "海南大学"
    # book_description
    file_book_description = "无"
    c = setJSON_ALL_BOOK(file_book_name, file_book_rel_path, file_book_tags,
                         file_book_price_now, file_book_price_before, file_book_author,
                         file_book_edition, file_book_publisher,
                         file_book_seller, file_book_seller_id, file_book_store_name,
                         file_book_uni, file_book_description)
    all_book.append(c)

#
# all_book = json.dumps(all_book)
# try:
#     file = open('../dist/res/json/all_book.json', 'w', encoding='utf-8')
# except IOError:
#     print('IO error')
# else:
#     file.write(str(all_book))
#     file.close()
#     print('create all_book.json success')

