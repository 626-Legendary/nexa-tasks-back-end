// 引入 jsonwebtoken 用于验证 JWT
const jwt = require('jsonwebtoken');
// 引入用户模型
const User = require("../models/User");

// 路由保护中间件，用于验证用户身份
const protect = async (req, res, next) => {
    try {
        // 从请求头中获取 Authorization 字段
        let token = req.headers.authorization;

        // 如果存在 token 且以 "Bearer" 开头
        if (token && token.startsWith("Bearer")) {
            // 提取出实际的 token 值（去掉 "Bearer "）
            token = token.split(" ")[1];

            // 使用 JWT 密钥解码 token，获取用户信息
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 根据解码出来的用户 ID 查找用户，并排除密码字段
            req.user = await User.findById(decoded.id).select("-password");

            // 调用 next()，继续执行后续中间件或路由处理
            next();
        } else {
            // 如果没有 token，返回未授权错误
            res.status(401).json({ message: "Access denied:No Token" });
        }
    } catch (error) {
        // 如果 token 验证失败，返回错误信息
        res.status(401).json({ message: "Invalid token.", error: error.message });
    }
};

// 管理员权限中间件，仅允许管理员访问
const adminOnly = (req, res, next) => {
    // 如果当前用户存在，且角色为 admin，则放行
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // 否则返回权限不足的错误信息
        res.status(401).json({ message: "Access denied: Administrator privileges required." });
    }
};

// 导出中间件函数
module.exports = { protect, adminOnly };
