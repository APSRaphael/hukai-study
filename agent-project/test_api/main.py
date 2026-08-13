from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="第一个API", version="1.0")


@app.get("/")
def read_root():
    return {"Hello": "World"}


# 获取路径参数
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}


# 查询参数
@app.get("/items")
def read_item(age: str = None):
    return {"age": age}


# 定义请求体模型
class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=10, description="用户名")
    password: str = Field(min_length=6, max_length=16, description="密码")


# 新增用户接口
@app.post("/users")
def create_user(user: UserCreate):
    return {"code": 200, "msg": "创建成功", "data": user.model_dump()}
