from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
# from openai_config import api_key
import random

# 成语列表和解释列表
idioms = ["半途而废", "大言不惭", "画蛇添足", "坐井观天", "杯弓蛇影", "海底捞针", "金玉满堂", "两小无猜", "三人成虎", "四面楚歌"]
meanings = ["做事不坚持到底就放弃了", "说话夸大其词，不顾实际情况", "比喻做了多余的事情", "比喻眼光狭窄，见识不广", "比喻因杞人忧天或多虑而感到害怕", "比喻费力寻找困难重重的事物", "比喻财富充裕，非常富有", "形容小孩子天真率直，没有猜疑", "说服很多人就会相信谎言", "比喻四面受敌，处境危险"]

# 设置字体和字号
font_size = 12
font_name = '华文楷体'
font_path = '/System/Library/Fonts/Supplemental/Songti.ttc'

# 创建 PDF 文件对象
pdf_canvas = canvas.Canvas("idiom_game.pdf", pagesize=A4)

# 加载字体
pdfmetrics.registerFont(TTFont(font_name, font_path))

# 设置字体
pdf_canvas.setFont(font_name, font_size)

# 生成连线题
for i in range(10):
    # 随机选择一个成语和其对应的解释
    idiom_index = random.randint(0, len(idioms) - 1)
    idiom = idioms[idiom_index]
    meaning = meanings[idiom_index]

    # 移除已选择的成语和解释
    idioms.pop(idiom_index)
    meanings.pop(idiom_index)

    # 设置连线的起始和结束坐标
    line_start = (20, 750 - i * 50)
    line_end = (100, 750 - i * 50)

    # 计算文字的起始坐标
    text_x = line_start[0] + 20
    text_y = line_start[1] - 10

    # 绘制连线
    pdf_canvas.setStrokeColor(colors.black)
    pdf_canvas.setLineWidth(1)
    pdf_canvas.line(line_start[0], line_start[1], line_end[0], line_end[1])

    # 绘制文字
    pdf_canvas.setFillColor(colors.black)
    pdf_canvas.drawString(text_x + 20, text_y - 10, idiom)
    pdf_canvas.drawString(text_x + 20, text_y - 20, meaning)

# 保存 PDF 文件并关闭对象
pdf_canvas.save()
