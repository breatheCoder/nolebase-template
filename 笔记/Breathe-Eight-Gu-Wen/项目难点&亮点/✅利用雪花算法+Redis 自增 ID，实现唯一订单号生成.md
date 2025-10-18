### （本项目亮点来自我的[[数藏项目]]文档中的最佳实践部分，更多项目亮点难点（50+），更详细的落地方案和讲解，可以在项目课中和我们一起学）


在我的数藏项目中，我给大家定义了一个全局的 ID 生成器——DistributeID，其中定义了方法——generateWithSnowflake



他就是借助雪花算法生成唯一 ID 的，这个方法的声明如下：



```plain
/**
 * 利用雪花算法生成一个唯一ID
 */
public static String generateWithSnowflake(BusinessCode businessCode,long workerId,
                                           String externalId) {
    long id = IdUtil.getSnowflake(workerId).nextId();
    return generate(businessCode, externalId, id);
}
```



这里面需要三个参数：

+ BusinessCode businessCode
    - 主要是区分业务的，比如订单号、支付单号、优惠券单号等等，不同的业务定义一个不同的 BusinessCode
+ long workerId
    - 用于区分不同的 worker，这个 woker 其实就是一个机器实例，我们需要能保证不同的机器上的 workerId 不一样。
+ String externalId
    - 这个就是一个业务单号，比如买家 ID，这个字段会用于基于基因法进行订单号生成，在项目文档中讲过了，我们不展开了。



本文主要介绍下这个workerId我们如何获取。



这个workerId需要满足几个条件：

1、每台机器都不一样

2、是个正整数

3、能满足动态扩展，新增机器的时候不需要单独配置



在我们的项目中，workerId 的获取我们是通过WorkerIdHolder实现的。



```plain
@Component
public class WorkerIdHolder implements CommandLineRunner {

    @Autowired
    private RedissonClient redissonClient;

    public static long WORKER_ID;

    @Override
    public void run(String... args) throws Exception {
        RAtomicLong atomicLong = redissonClient.getAtomicLong("workerId");
        WORKER_ID = atomicLong.incrementAndGet() % 32;
    }
}
```



这个类实现了CommandLineRunner接口，那么在 Spring 容器启动的过程中，run方法就会被调用。



run 方法中的主要逻辑就是去 redis 中获取一个自增 id，然后我们再基于拿到的这个自增 id对32取模，就能得到一个 workerId 了。



为什么是32？主要是因为雪花算法对这个 workerId 有要求，不能超过32，否则会报错。



当我们有10台机器依次启动的过程中，就会获取到10个自增 id，比如是1000-1010吧，那么把他们对32取模就能得到一个10个不同的数字，就可以把这个数组保存在一个常量中，当作 workderId 来用了。



**但是，****<font style="color:rgb(47, 48, 52);">workerId不能超过32，如果机器数超过32，会有不同机器有相同workId，然后相同workId生成sequence会重复怎么办?</font>**

**<font style="color:rgb(47, 48, 52);"></font>**

确实超过32的话会重复，这个主要是Hutool框架的限制，但是影响也不大，因为workerId只是雪花算法中的一部分，很小的一部分。即使workerId重复的话，也要非常极端情况下（时间戳相同、随机数相同）才会导致整个id重复。



重复了咋办，插入数据库会失败的，直接提示下单失败，系统异常即可，这种发生的概率实在是太低了，没必要浪费感情去处理。



如果一定要解决，可行的方案是提前生成一批不会重复的订单号，比如用一个业务上线前的时间戳提前生成一批订单号。当实时生成的订单号插入数据库的时候报唯一性冲突异常的时候，从这个提前申请的订单号中找出来一个用就行了。



### 学习资料


[[✅什么是雪花算法，怎么保证不重复的？]]



### （本项目亮点来自我的[[数藏项目]]文档中的最佳实践部分，更多项目亮点难点（50+），更详细的落地方案和讲解，可以在项目课中和我们一起学）
