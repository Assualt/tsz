import requests
import re

myurl = 'http://www.jiushujie.com'
pattern = '"http://*.*' + '.jpg" '
def download_pictue(url, pattern, path):
    try:
        res = requests.get(myurl)
        html = res.text.encode('utf-8')
        imgurls = re.findall(bytes(pattern, 'utf-8'), html, re.M)
        for index in range(0, len(imgurls)):
            imgname = path +'/'+ str(index) + '.jpg'
            imgurl = imgurls[index].decode('ascii')[1:len(imgurls[index]) - 2]  # divide the " "
            try:
                res = requests.get(imgurl.strip())
                with open(imgname, 'wb+') as file:
                    file.write(res.content)
                print('the ', imgname, ' download successfully')
            except:
                print('the ', imgname, ' failed ')
    except:
        print("can't ", 'get resource')


download_pictue(myurl, pattern, 'F:/MyFile/TaoShuZhai/dist/res')

