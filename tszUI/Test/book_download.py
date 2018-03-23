import os
import re
import requests
# download_book_img
def download_book_img(d_url, d_pattern, d_path):
    try:
        res = requests.get(d_url)
        res.encoding='utf-8'
        content = bytes(res.text, encoding='utf-8')   # 变成二进制
        # reg = re.compile(bytes(d_pattern, encoding='utf-8'), re.M)
        # img_urls = re.findall(reg, content)
        img_urls = re.findall(bytes(d_pattern, encoding='utf-8'), content, re.M)
        if len(img_urls) != 0:
            for i in range(1, len(img_urls)):
                print(i, " ", img_urls[i][0], str(img_urls[i][1], encoding='utf-8'))
                img_url = img_urls[i][0]
                img_name = os.path.join(d_path, str(img_urls[i][1], encoding='utf-8')+'.jpg')
                try:
                    res = requests.get(img_url.strip())
                    with open(img_name, 'wb+') as file:
                        file.write(res.content)
                    print('the ', img_name, 'download successfully')
                except:
                    print('the ', img_name, 'download failed')
        elif len(img_urls) == 0:
            print("can't get any images 0", )
    except OSError:
        print("can't get anything", OSError)
    except UnicodeError:
        print("uincodeError", UnicodeDecodeError)
    pass

d_url = 'http://www.jiushujie.com/sell'
# book_img_url  + book_name
d_pattern = 'src="(.+?.jpg)" title="(.*)'
# book_img_url + book_name
d_pattern_1 = 'src="(.+?.jpg)" alt="(.*)" title="'

d_path = "../dist/res/book_img"

print('-----------init-------------')
download_book_img(d_url, d_pattern_1, d_path)
print('-----------finish-----------')
