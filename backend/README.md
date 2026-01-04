# ScholarFlow Backend

ScholarFlow Planner的后端API服务，基于Node.js + Express + TypeScript + Prisma + PostgreSQL构建。

## 功能特性

- 🔐 **用户认证** - JWT-based authentication with refresh tokens
- 📋 **任务管理** - 创建、编辑、删除和跟踪任务
- 📊 **时间线管理** - 智能时间安排和冲突检测
- 📁 **项目组织** - 分层项目和任务分类
- 📈 **数据分析** - 生产力统计和趋势分析
- 😊 **心情追踪** - 每日心情记录和分析
- 🛡️ **安全保护** - 输入验证、速率限制、CORS等

## 技术栈

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 项目结构

```
backend/
├── prisma/
│   ├── schema.prisma      # 数据库模式定义
│   └── seed.ts            # 数据库种子数据
├── src/
│   ├── config/            # 配置文件
│   ├── controllers/       # 路由控制器
│   ├── middleware/        # 中间件
│   ├── models/            # 数据模型（如果需要）
│   ├── routes/            # 路由定义
│   ├── services/          # 业务逻辑服务
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 13+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.template .env
```

2. 配置数据库连接：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/scholarflow_db"
```

3. 配置JWT密钥：
```env
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 数据库设置

1. 生成Prisma客户端：
```bash
npm run db:generate
```

2. 运行数据库迁移：
```bash
npm run db:push
```

3. （可选）填充种子数据：
```bash
npm run db:seed
```

### 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:8000` 启动。

## API文档

### 认证相关

#### 注册用户
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 获取用户信息
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

### 任务管理

#### 获取任务列表
```
GET /api/tasks?page=1&limit=10&completed=false&priority=HIGH
Authorization: Bearer <access_token>
```

#### 创建任务
```
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "完成项目报告",
  "description": "详细的项目进度报告",
  "priority": "HIGH",
  "scheduledDate": "2024-01-15",
  "scheduledTime": "14:00",
  "duration": 120,
  "category": "工作",
  "tags": ["报告", "项目"],
  "projectIds": [1, 2]
}
```

#### 更新任务
```
PUT /api/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "completed": true
}
```

### 时间线管理

#### 获取日期时间线
```
GET /api/timeline/2024-01-15
Authorization: Bearer <access_token>
```

#### 检查时间冲突
```
GET /api/timeline/2024-01-15/conflicts?time=14:00&duration=60
Authorization: Bearer <access_token>
```

### 项目管理

#### 获取项目列表
```
GET /api/projects
Authorization: Bearer <access_token>
```

#### 创建项目
```
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "新项目",
  "color": "#4A4238",
  "description": "项目描述"
}
```

### 数据分析

#### 获取生产力统计
```
GET /api/analytics/productivity?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access_token>
```

#### 获取任务完成趋势
```
GET /api/analytics/trends/tasks?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <access_token>
```

### 心情追踪

#### 创建心情记录
```
POST /api/mood
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "mood": "Happy",
  "emoji": "😊",
  "note": "今天工作很顺利",
  "date": "2024-01-15"
}
```

#### 获取心情连续记录天数
```
GET /api/mood/streak
Authorization: Bearer <access_token>
```

## 开发脚本

- `npm run dev` - 启动开发服务器（带热重载）
- `npm run build` - 编译TypeScript
- `npm run start` - 启动生产服务器
- `npm run db:generate` - 生成Prisma客户端
- `npm run db:push` - 推送数据库模式更改
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:seed` - 填充种子数据
- `npm run db:studio` - 打开Prisma Studio
- `npm run lint` - 运行ESLint检查
- `npm run format` - 格式化代码

## 部署

### 生产环境部署

1. 构建应用：
```bash
npm run build
```

2. 设置生产环境变量

3. 启动服务器：
```bash
npm start
```

### Docker部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "start"]
```

## 安全注意事项

- 所有密码都使用bcrypt进行哈希处理
- JWT令牌有过期时间限制
- API请求有速率限制保护
- 输入数据通过Zod进行验证
- 使用Helmet添加安全头
- 启用CORS保护

## 许可证

MIT License
