import openai
from openai_config import api_key

openai.api_key = api_key

response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user", "content": "使用 python3 循环一个数组，获取数组对象中的 id 字段， 生成一个新数组"}]
)
# modelList = openai.Model.list()


# 文件路径
file_path = "my_file.md"

# print(modelList.object)

print(response.choices[0].message.content.strip())
