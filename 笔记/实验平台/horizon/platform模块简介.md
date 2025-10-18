我来帮你介绍一下 horizon-platform 模块。让我先探索一下这个模块的整体结构和功能。

基于我对代码的分析，我来为你详细介绍一下 **horizon-platform** 模块：

## 🏗️ 模块概述

**horizon-platform** 是 Horizon AB实验平台的核心服务模块，主要负责提供实验平台的业务逻辑和API服务。从代码结构和配置来看，这是一个基于 Spring Boot 的微服务应用。

## 📁 核心架构

### 1. **主要包结构**
```
horizon-platform/
├── service/          # 业务服务层
├── controller/       # REST API控制器
├── optimize/         # Arena优化模块（核心功能）
├── manager/          # 业务管理器
├── config/           # 配置管理
├── thrift/           # RPC服务接口
├── bean/             # 数据传输对象
├── utils/            # 工具类
└── exception/        # 异常处理
```

### 2. **核心服务组件**

#### **业务服务层 (Service)**
- **FlowService** (126KB) - 流量管理核心服务，处理流量申请、分配、调整
- **VersionService** (116KB) - 版本管理服务
- **WhiteService** (120KB) - 白名单管理服务
- **StrategyService** (33KB) - 策略管理服务
- **ExpService** (14KB) - 实验管理服务
- **ApprovalService** (20KB) - 审批流程服务
- **FlowQueueService** (25KB) - 流量排队服务

#### **API控制器层 (Controller)**
- **FlowController** - 流量申请和管理API
- **AuthController** - 权限控制API
- **RecommendSceneController** - 推荐场景管理API
- **WhiteController** - 白名单管理API
- **VersionController** - 版本管理API

## 🎯 核心功能模块

### 1. **Optimize 模块 - Arena优化引擎**
这是平台最重要的功能模块，包含：

#### **数据处理 (data/)**
- **auto/** - 自动化数据处理
- **engine/** - 数据引擎服务
- **dataset/** - 数据集管理
- **source/** - 数据源管理

#### **核心服务**
- **PriorAaTaskService** - 预分流任务服务（如你提供的代码文件）
- **ExpService** - 实验优化服务
- **StrategyService** - 策略优化服务
- **ModuleService** - 场景模块服务

#### **计算引擎**
- **CoreComputingService** - 核心计算服务，处理流量分配算法
- **DefaultFlowService** - 转全服务，提供实验转全功能

### 2. **流量管理系统**
- 流量申请和审批流程
- 流量分配和调整
- 流量排队管理
- 城市级流量控制

### 3. **实验管理系统**
- 实验创建、配置、管理
- 实验版本控制
- 实验状态流转
- AA测试和效果评估

### 4. **权限和安全**
- SSO单点登录集成
- UAC权限控制
- 菜单和按钮级权限管理

## 🔧 技术栈

### **框架和中间件**
- **Spring Boot** - 主框架
- **MyBatis** - 数据访问层
- **Thrift** - RPC通信
- **Swagger** - API文档
- **Lion** - 配置管理
- **Cellar** - 分布式缓存
- **Kafka** - 消息队列

### **外部依赖**
- **S3** - 对象存储
- **Druid** - 数据查询引擎
- **Spark** - 大数据计算引擎
- **大象** - 内部通知系统

## 🌟 关键特性

### 1. **多环境支持**
- dev/test/staging/prod 环境配置
- 不同环境的数据库和服务配置

### 2. **Arena平台集成**
从代码可以看出，这个模块与Arena实验平台深度集成：
- 预分流任务管理
- Spark任务调度
- 数据集管理和计算
- 效果评估和AA测试

### 3. **企业级功能**
- 完整的审批流程
- 权限管理体系
- 操作日志记录
- 监控和告警

## 📊 业务流程

基于代码分析，主要业务流程包括：

1. **实验创建** → 场景选择 → 层配置 → 策略设计
2. **流量申请** → 审批流程 → 流量分配 → 上线发布
3. **效果监控** → 数据分析 → AA测试 → 结果评估
4. **实验管理** → 版本控制 → 状态流转 → 下线回收

这个模块是整个Horizon实验平台的核心，承载了从实验设计到效果评估的完整业务链路，特别是在Arena平台的优化和自动化方面有很强的能力。