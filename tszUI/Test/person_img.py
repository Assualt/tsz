import requests
import re

myurl = 'http://www.jiushujie.com'
pattern ='src="(.+?.jpg!tiny)" alt='
path ='F:/GitRepository/tsz/tszUI/dist/res/user-img'
try:
    res = requests.get(myurl)
    html = res.text.encode('utf-8')
    imgurls = re.findall(bytes(pattern, 'utf-8'), html, re.M)
    for i in range(1, len(imgurls)):
        print(i, "  ", imgurls[i], "\n")
        img = imgurls[i]   # net
        imgname = path+'/'+str(i)+'.jpg'   # local
        try:
            res = requests.get(img.strip())
            with open(imgname, 'wb+') as file:
                file.write(res.content)
                pass
            print('the ', imgname, 'download successfully')
        except:
            print('the ', imgname, ' failed ')
            pass
except:
    print("can't", "get images")
