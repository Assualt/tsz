import os
import json
# {
#     "book_name":"卡耐基魅力口才",
#     "img_url":"../dist/res/book_img/卡耐基.jpg",
#     "book_tags":[
#       "励志","卡耐基","阳光"
#     ],
#     "price_now":"5.00",
#     "price_before":"33.00",
#     "book_author":"卡耐基",
#     "book_edition":"第3版",
#     "book_publisher":"机械工业出版社",
#     "book_seller":"陈",
#     "book_seller_id":"123",
#     "book_store_name":"书店1",
#     "book_uni":"海南大学",
#     "book_description":""
# }

def setJSON(book_name, img_url, book_tags,
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

# self, book_name, img_url, book_tags,price_now,
# price_before, book_author, book_edition, book_publisher,
#  book_seller, book_seller_id, book_store_name,book_uni, book_description

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
    c = setJSON(file_book_name, file_book_rel_path, file_book_tags,
                file_book_price_now, file_book_price_before,file_book_author,
                file_book_edition, file_book_publisher,
                file_book_seller, file_book_seller_id, file_book_store_name,
                file_book_uni, file_book_description)
    all_book.append(c)
all_book = json.dumps(all_book)
try:
    file = open('./test.json', 'w', encoding='utf-8')
except IOError:
    print('IO error')
else:
    file.write(str(all_book))
    file.close()
    print('success')

