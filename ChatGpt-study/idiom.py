import openai
import random
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from openai_config import api_key

# 将字体文件注册到 ReportLab 中
font_name = '华文楷体'
font_path = '/System/Library/Fonts/Supplemental/Songti.ttc'
pdfmetrics.registerFont(TTFont(font_name, font_path))

# 设置 OpenAI API 密钥
openai.api_key = api_key

# 设置 API 请求的参数
model_engine = "text-davinci-002"
prompt = "请生成一个四字成语"

# 调用 GPT-3 生成成语和解释
response = openai.Completion.create(
    prompt=prompt,
    max_tokens=100,
    n=1,
    stop="6. ",
    temperature=0.5,
    frequency_penalty=0,
    presence_penalty=0,
    engine=model_engine
)
print(111, response)
output_text = response.choices[0].text.strip()
print(222, output_text)
# 解析生成的成语和解释
idioms = []
explanations = []
for line in output_text.splitlines():
    if line.startswith("成语："):
        idioms.append(line[3:].strip())
    elif line.startswith("解释："):
        explanations.append(line[3:].strip())

# 随机打乱成语列表和解释
random.shuffle(idioms)
random.shuffle(explanations)

# 创建 PDF 文档
pdf_canvas = canvas.Canvas('idioms.pdf',pagesize=A4)

# 设置字体
pdf_canvas.setFont(font_name, 14)

# 写入成语和解释
for i in range(len(idioms)):
    pdf_canvas.drawString(20, 735 - i*30, idioms[i])
    pdf_canvas.drawString(150, 735 - i*30, explanations[i])

# 保存 PDF 文件
pdf_canvas.save()
