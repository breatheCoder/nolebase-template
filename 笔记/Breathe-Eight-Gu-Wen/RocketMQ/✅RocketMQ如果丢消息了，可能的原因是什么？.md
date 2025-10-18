# 典型回答


[[✅RocketMQ如何保证消息不丢失？]]



先看下上面这篇，如果保证不丢，那么大概就能知道，如果丢了可能是啥原因了。从发送端、Broker端以及消费者端分别分析。



### 发送端


#### 用了单向发送
<font style="color:rgb(24, 24, 24);"></font>

<font style="color:rgb(24, 24, 24);">RocketMQ提供了一种发送方只负责发送消息，不等待服务端返回响应且没有回调函数触发，即只发送请求不等待应答的发送方式，叫做单向发送。</font>

<font style="color:rgb(24, 24, 24);"></font>

```java
producer.sendOneway(msg);
```

<font style="color:rgb(24, 24, 24);"></font>

<font style="color:rgb(24, 24, 24);">用了这种发送方式，是非常有可能发送不成功，导致消息丢失的。</font>

<font style="color:rgb(24, 24, 24);"></font>

#### 未处理发送失败的情况


如果使用了同步发送或者异步发送，但是没有处理好异常的情况，没有进行合理的重试，那么也会导致消息丢失。



```java
try {
    SendResult sendResult = producer.send(msg);
    // 同步发送消息，只要不抛异常就是成功。
    if (sendResult != null) {
        //忽略失败
    }
}
catch (Exception e) {
    //忽略异常
}
```



```java
// 异步发送消息, 发送结果通过callback返回给客户端。
producer.sendAsync(msg, new SendCallback() {
    @Override
    public void onSuccess(final SendResult sendResult) {
        // 消息发送成功。
        System.out.println("send message success. topic=" + sendResult.getTopic() + ", msgId=" + sendResult.getMessageId());
    }

    @Override
    public void onException(OnExceptionContext context) {
        // 忽略异常
    }
});
```



#### 发送过程中，Producer挂了


这种情况也有可能出现，就是消息正准备发呢，但是没等发出去，应用就挂了。那么消息也可能会丢了



### Broker端


这部分和Kafka丢消息的情况一样，直接内容copy过来了。

#### Broker挂了（不常见）


最常见的就是Broker挂了的情况，还没来及做消息的持久化以及同步，他挂了，那么消息就可能会丢了。



那有人说，Broker不是个集群么？集群的话挂了不是有选举机制么。确实，那么如果是下面的情况一样会丢消息。



#### leader 还没同步给 follower，就挂了（不常见）


 如果在 `acks=1`这种情况下，但 **leader broker 在follower还没同步完成之前就挂了**，那么数据就丢了。  



#### 未开启主从同步或者没有集群部署，leader挂了（不常见）


这种也是有可能的，就只有一个leader在抗，挂了就完蛋了。



#### 消息一直不成功


RocketMQ的消息默认保存72小时，在消息过期前，消费者一直没有消费成功，到期后消息会被删除。这种情况也可能会导致消息丢失。



### 消费者端


#### 没处理成功就自动提交了offset（常见）


 如果你代码里 try-catch 后忽略了异常，或者消费失败后，仍然返回 `CONSUME_SUCCESS`，那消息就不会再投递，这就等同于丢失了。

