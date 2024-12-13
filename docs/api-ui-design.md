# AI辅导系统 API 和 UI 设计文档

## 一、系统整体架构

### 1.1 技术栈
- 前端：React + Ant Design + Vite
- 后端：Node.js + Express + MongoDB
- AI：OpenAI API

### 1.2 系统模块
1. 用户认证模块
2. 课程管理模块
3. AI辅导模块
4. 作业管理模块
5. 在线答疑模块
6. 学习追踪模块

## 二、API 设计

### 2.1 用户认证 API
```
POST   /api/auth/register          # 用户注册
POST   /api/auth/login            # 用户登录
POST   /api/auth/logout           # 用户登出
POST   /api/auth/forgot-password  # 忘记密码
POST   /api/auth/reset-password   # 重置密码
GET    /api/auth/profile          # 获取用户信息
PUT    /api/auth/profile          # 更新用户信息
```

### 2.2 课程管理 API
```
GET    /api/courses               # 获取课程列表
POST   /api/courses               # 创建新课程
GET    /api/courses/:id           # 获取课程详情
PUT    /api/courses/:id           # 更新课程信息
DELETE /api/courses/:id           # 删除课程

# 课程资料
POST   /api/courses/:id/materials    # 上传课程资料
GET    /api/courses/:id/materials    # 获取课程资料列表
DELETE /api/courses/:id/materials/:materialId  # 删除课程资料
```

### 2.3 AI辅导 API
```
# 智能问答
POST   /api/ai/chat              # 发送问题获取回答
GET    /api/ai/chat/history      # 获取聊天历史
DELETE /api/ai/chat/history      # 清除聊天历史

# 知识点解析
POST   /api/ai/knowledge/analyze # 分析知识点
GET    /api/ai/knowledge/map     # 获取知识图谱
GET    /api/ai/knowledge/related # 获取相关知识点

# 学习建议
GET    /api/ai/advice            # 获取学习建议
POST   /api/ai/advice/feedback   # 提交建议反馈
```

### 2.4 作业管理 API
```
# 教师端
POST   /api/homework/assign      # 发布作业
GET    /api/homework/assigned    # 获取已发布作业列表
GET    /api/homework/:id/submissions  # 获取作业提交列表
POST   /api/homework/:id/grade   # 评分

# 学生端
GET    /api/homework             # 获取作业列表
POST   /api/homework/:id/submit  # 提交作业
GET    /api/homework/:id/feedback # 获取作业反馈
```

### 2.5 在线答疑 API
```
# WebSocket 接口
WS     /ws/qa                    # 实时答疑连接

# HTTP 接口
POST   /api/qa/questions         # 提交问题
GET    /api/qa/questions         # 获取问题列表
POST   /api/qa/questions/:id/answer  # 回答问题
GET    /api/qa/history           # 获取答疑历史
```

### 2.6 学习追踪 API
```
GET    /api/analytics/progress    # 获取学习进度
GET    /api/analytics/performance # 获取学习表现
GET    /api/analytics/statistics  # 获取统计数据
GET    /api/analytics/report      # 获取学习报告
```

## 三、UI 布局设计

### 3.1 整体布局
```
+------------------+
|      Header      |
+--------+---------+
|        |         |
|  Side  |  Main   |
|  Nav   | Content |
|        |         |
+--------+---------+
|      Footer      |
+------------------+
```

### 3.2 主要页面布局

#### 3.2.1 仪表盘页面
```
+-------------------+
| 欢迎信息 + 概览   |
+--------+----------+
| 最近   | 学习     |
| 课程   | 进度     |
+--------+----------+
| 待完成 | 学习     |
| 作业   | 建议     |
+--------+----------+
```

#### 3.2.2 AI辅导页面
```
+-------------------+
| 知识图谱展示区域  |
+--------+----------+
| 历史   | 对话     |
| 记录   | 区域     |
|        |          |
|        | 输入框   |
+--------+----------+
```

#### 3.2.3 课程学习页面
```
+-------------------+
| 课程内容展示区域  |
+--------+----------+
| 课程   | 学习     |
| 目录   | 内容     |
|        |          |
+--------+----------+
| 互动讨论区域      |
+-------------------+
```

#### 3.2.4 作业管理页面
```
+-------------------+
| 作业列表/状态     |
+-------------------+
| 作业详情/提交区域 |
+-------------------+
| 批改反馈区域      |
+-------------------+
```

## 四、交互设计要点

### 4.1 AI辅导模块
1. 实时对话反馈
2. 知识图谱可视化
3. 上下文保持
4. 建议智能推送

### 4.2 课程学习模块
1. 进度自动保存
2. 资料便捷预览
3. 笔记随堂记录
4. 重点标记功能

### 4.3 作业管理模块
1. 作业状态跟踪
2. 智能批改辅助
3. 错题自动归类
4. 进度提醒

### 4.4 学习追踪模块
1. 数据可视化展示
2. 学习报告生成
3. 进度预警提醒
4. 成绩趋势分析

## 五、技术实现重点

### 5.1 前端实现
1. 使用React Router进行路由管理
2. 使用Redux/Mobx进行状态管理
3. 使用WebSocket实现实时通信
4. 使用ECharts实现数据可视化

### 5.2 后端实现
1. 使用JWT进行身份认证
2. 使用Socket.io处理实时通信
3. 使用MongoDB进行数据存储
4. 使用Redis进行缓存处理

### 5.3 AI功能实现
1. 使用OpenAI API进行智能问答
2. 实现知识图谱构建算法
3. 实现个性化推荐系统
4. 实现智能批改系统

## 六、安全性考虑

1. 用户认证和授权
2. 数据加密传输
3. API访问限制
4. 敏感信息保护
5. 防止SQL注入
6. XSS防护

## 七、性能优化

1. 前端资源懒加载
2. API响应缓存
3. 数据库索引优化
4. 图片资源CDN
5. WebSocket连接优化
6. 大数据分页处理
