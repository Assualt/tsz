import os
import random
import pymysql

conn = pymysql.connect(
    host="localhost", user="root",password="123456",database="tsz",charset="utf8"
)
cursor = conn.cursor()

def randomEditions():
    n = random.randint(1,4)
    return n
publish = ['科学出版社','清华大学出版社','机械工业出版社','电子工业出版社','化学工业出版社','建筑工业出版社',
           '人民邮电出版社','中国水利水电出版社','中国电力出版社','北京科学技术出版社']
def randomPublish():
    n = random.randint(0,9)
    return publish[n]

def randomPrice():
    return str(round(random.random() * 100, 2))

def randomAuthor():
    return "作者1"

sql = "insert into tsz_book(book_id,book_img_url,book_edition,book_description,book_publish,book_price,book_name,book_author_chief,book_author_other,book_tags)" \
      "values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"

def dict_format(id, img_url, edtion, desc, publish, name, price_now, author_chief, author_another="", book_tags="1,2,3")->dict:
    return [
        str(id),img_url,edtion,desc,publish,price_now,name,author_chief,author_another,book_tags
    ]
    pass

def main():
    for root, dirs, files in os.walk("/home/xhou/work/GitRepository/tsz/vue-tsz/static/upload"):
        for index,file in enumerate(files):
            img_url = "static/upload/" + file
            edition = randomEditions()
            name = file[0:file.rfind('.')]
            desc = name  + " 第" + str(edition) + "版"
            publish = randomPublish()
            price_now = randomPrice()
            price_before = randomPublish()
            author = randomAuthor()
            tmpdict = dict_format(index,img_url,edition,desc,publish,name,price_now,author)
            print(tmpdict)
            try:
                cursor.execute(sql, tmpdict)
                print("exce success " + str(index))
            except Exception as e:
                print("exce failed " + str(index))
                continue
            conn.commit()
    cursor.close()
    conn.close()
if __name__ == '__main__':
    main()

