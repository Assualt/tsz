import xlrd
import os

from xlutils.copy import copy

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



# def read_excel(list):
#     xls_file_name = r'C:/Users/T_T/Desktop/book_img.xls'
#     # open excel file
#     workbook = xlrd.open_workbook(xls_file_name)
#     # 获取所有sheet
#     sheet_name = workbook.sheet_names()
#
#     print('sheet length is ', len(sheet_name))
#
#     #获取sheet 1
#     sheet1 = workbook.sheet_by_name('Sheet1')
#
#     # sheet的名称，行数，列数
#     rows = sheet1.nrows
#     cols = sheet1.ncols
#
#     print('rows ', rows, 'cols ', cols)
#
#     # 获取整行 或者 整列操作
#     i = 1
#
#     newworkbook = copy(workbook)
#     for file in list:
#         filename = file.split('.')[0]  # file name
#         fileImgUrl = os.path.relpath(os.path.join(book_img_path, file))
#         newsheet = newworkbook.get_sheet(0)
#         if i >= rows:
#             newsheet.write(i, 0, 10000+i)
#             pass
#         newsheet.write(i, 1, filename)
#         newsheet.write(i, 2, fileImgUrl)
#         i = i + 1
#         pass
#     newworkbook.save(xls_file_name)
pass

def read_excel(xlsfilename):
    workbook = xlrd.open_workbook(xlsfilename)
    sheet1 = workbook.sheet_by_name('Sheet1')
    print('sheet1 name ', sheet1.row_values(0))

    for i in range(1, sheet1.nrows):
        for j in range(1, sheet1.ncols):
            print(sheet1.cell_value(i, j), '  ', end='')
        print('\n')
    pass
read_excel(r'C:/Users/T_T/Desktop/book_img.xls')
