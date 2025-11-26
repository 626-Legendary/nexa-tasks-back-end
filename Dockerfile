# 1. 轻量 Node 镜像
FROM node:20-alpine

# 2. 工作目录
WORKDIR /app

# 3. 先复制依赖清单，安装依赖（利用缓存）
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# 4. 再复制其它代码
COPY . .

# 5. 生产环境变量（如果你需要可以再加 MONGODB_URI 等）
ENV NODE_ENV=production
ENV PORT=8000

# 6. 暴露服务端口（和 server.js 保持一致）
EXPOSE 8000

# 7. 启动命令
CMD ["npm", "start"]
