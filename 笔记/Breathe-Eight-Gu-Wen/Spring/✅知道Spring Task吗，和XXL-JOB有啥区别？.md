# 典型回答


所谓Spring Task，只是一种不规范的说法，其实表示的就是Spring中的Scheduling Task：[https://spring.io/guides/gs/scheduling-tasks](https://spring.io/guides/gs/scheduling-tasks)



就是使用@Scheduled来执行一个定时任务，关于@Scheduled的原理和用法可以看下面这篇：



[[✅介绍下@Scheduled的实现原理以及用法]]



同样是定时任务，他和xxl-job这种定时任务的框架有啥区别呢？包括Spring其实还提供了一个Spring Batch，也是一个定时任务框架，为啥呢？



其实，Spring Scheduling Task是基于 Spring 提供的**轻量级任务调度框架** ，他适合用在单机场景下的定时任务，基于`@Scheduled` 进行任务调度，任务调度的状态和管理比较简单，不支持任务分片和失败重试 。



而XXL-JOB是一个典型的分布式调度系统， 采用**分布式架构**，它支持分布式任务执行，即让多个实例同时执行任务，把集群的力量给利用上，他支持任务分片、失败重试、任务日志管理、任务依赖等高级功能。  



[[✅xxl-job 支持分片任务吗？实现原理是什么？]]



所以，**Spring Task **适合 **小规模、本地定时任务**，如定时清理数据库日志、定时执行缓存同步，**但是不适用于** 分布式任务调度、大并发任务。



而**XXL-Job **适合 **大规模、分布式任务调度**，如定期关闭未支付订单、如定期计算用户活跃度，但是**不适用于**仅单机运行的小任务，因为他还是有一定的部署成本的。



