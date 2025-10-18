## 本系列文档简介
本系列文章为研究Skywalking-OAP8.9.1版本, 探针Skywalking-java8.9.0时所著，文章内容来源有博客、官网、自己的体会、源代码剖析、测试所得。专业性的知识参考权威性官方文档，保证内容的可靠性。
## Skywalking简介
- 起源：Skywalking是由国内开源爱好者吴晟（原OneAPM工程师）开源并提交到Apache孵化器的产品，它同时吸收了Zipkin/Pinpoint/CAT的设计思路，支持非侵入式埋点。是一款基于分布式跟踪的应用程序性能监控系统。另外社区还发展出了一个叫OpenTracing的组织，旨在推进调用链监控的一些规范和标准工作。
- 为什么选择Skywalking:
	- SkyWalking **支持很多框架**，包括很多国产框架，例如，Dubbo、gRPC、SOFARPC 等等，也有很多开发者正在不断向社区提供更多插件以支持更多组件无缝接入 SkyWalking。
	- SkyWalking **增长势头强劲**，社区活跃，中文文档齐全，**没有语言障碍**
## Skywalking核心功能
- JVM分析(metrics)
- 服务拓扑图分析
- 服务、服务实例和端点依赖性分析
- 检测到慢速服务和端点(metrics)
- 性能剖析
- 链路追踪(trace)
- 数据库访问指标。检测慢速数据库访问语句（包括 SQL 语句）
- 报警
- LOG
> 这里介绍几个概念：
   **log**: 日志，Skywalking中需要进行特殊的配置才能显示日志信息，这个不符合我们的需求，我们要求是无侵入的性能监控。  
   **trace**: 链路追踪，能够反映输出接口的调用链，比如这个接口调用其他的接口，调用了哪个数据库等等，详细信息请参考OpenTrace官方文档，此文档定义了链路追踪规范 
   **metrics**: 度量信息，Skywalking中所有的图标展示的数据信息统称为metric

![[Pasted image 20251017161310.png]]
## Skywalking代码模块及架构
![[Pasted image 20251017161339.png]]
从图中可以看出Skywalking主要由以下三个模块组成：
### Skywalking-Agent
探针，数据捕获（后续简称（Agent）[探针]）

SkyWalking Agent 采用了**微内核架构**（Microkernel Architecture），那什么是微内核架构呢？微内核架构也被称为**插件化架构**（Plug-in Architecture），是一种面向功能进行拆分的可扩展性架构。在基于产品的应用中通常会使用微内核架构，例如，IDEA、Eclipse 这类 IDE 开发工具，内核都是非常精简的，对 Maven、Gradle 等**新功能的支持都是以插件的形式增加**的。如下图所示，微内核架构分为核心系统和插件模块两大部分。详解《Skywalking-Agent项目结构》
![[Pasted image 20251017161458.png]]
### Skywalking-OAP
服务，数据分析与存储 (后续简称OAP[观察分析平台])

OAP 与 Agent 类似，也采用了微内核架构（Microkernel Architecture），如下图所示。
![[Pasted image 20251017161536.png]]

**OAP** 使用 **ModuleManager**（组件管理器）**管理**多个 **Module**（组件），一个 Module 可以对应多个 ModuleProvider（组件服务提供者），**ModuleProvider** 是 Module 底层真正的实现。在 OAP 服务启动时，一个 Module 只能选择使用一个 ModuleProvider 对外提供服务。**一个 ModuleProvider 可能支撑了一个非常复杂的大功能**，在一个 ModuleProvider 中，可以包含多个 Service ，一个 Service 实现了一个 ModuleProvider 中的一部分功能，通过将多个 Service 进行组装集成，可以得到 ModuleProvider 的完整功能。具体结构设计见《Skywalking模块加载机制》

## 模块间的通信协议
