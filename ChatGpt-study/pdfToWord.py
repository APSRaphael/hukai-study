'''
Author: 益智
Date: 2023-04-24 14:06:55
LastEditTime: 2023-04-25 10:02:48
LastEditors: 益智
Description:
'''
import pdf2docx
import pandas as pd

def convert_pdf_to_docx(pdf_path, docx_path):
    pdf2docx.parse(pdf_path, docx_path)
    print('PDF converted to Word successfully')

def read_table_from_docx(docx_path):
    table = pd.read_table(docx_path, sep='\t')
    return table

convert_pdf_to_docx('path/to/output.pdf', 'path/to/output.docx')
# table = read_table_from_docx('path/to/output.docx')
# print(table)
