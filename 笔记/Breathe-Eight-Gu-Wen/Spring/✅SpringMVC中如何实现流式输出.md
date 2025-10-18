# 典型回答


**流式输出**指的是服务器将数据以“**流**”的方式逐步写入响应体，而不是一次性生成整个结果后再返回。 比较典型的就是现在大语言模型的对话功能，几乎都是以流式输出的方式的。好处就是不用让用户等很长时间。



想要实现流式输出，有很多种方式。



**方式一，使用 ResponseEntity + StreamingResponseBody**



```java
@GetMapping("/chat")
public ResponseEntity<StreamingResponseBody> chat() {
    StreamingResponseBody body = outputStream -> {
        for (int i = 0; i < 10; i++) {
            String data = "data chunk " + i + "\n";
            outputStream.write(data.getBytes(StandardCharsets.UTF_8));
            outputStream.flush();
            try {
                Thread.sleep(500); // 模拟延迟
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    };

    return ResponseEntity.ok()
    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_EVENT_STREAM_VALUE)
    .body(body);
}
```



`StreamingResponseBody` 是一个函数式接口，其内部通过 `OutputStream` 将数据逐步写入响应流。



Spring 在处理该返回值时会延迟执行该函数，直到响应提交前才调用 writeTo(OutputStream) 方法。

每次写入后调用 flush() 强制刷新缓冲区，使客户端能实时接收内容。



这个方式适用于传统的 Spring MVC 应用，用于将数据分块写入 HTTP 响应体。但是需要注意的是，它是一种同步的方式，也就是说请求会一直占用连接，等全部写入结束后才会断开。







**方式二，使用 SseEmitter（Server-Sent Events）**



**SSE（Server-Sent Events，服务器推送事件）** 是一种基于 HTTP 协议的**单向通信机制**，允许服务器主动将实时数据推送给客户端（比如我们的浏览器），而不是客户端频繁轮询请求数据。  



使用方式如下：



```java
@GetMapping("/chat1")
public SseEmitter sse() {
    SseEmitter emitter = new SseEmitter(60_000L); // 设置超时时间

    Executors.newSingleThreadExecutor().submit(() -> {
        try {
            for (int i = 0; i < 10; i++) {
                emitter.send("Message " + i);
                Thread.sleep(1000);
            }
            emitter.complete();
        } catch (Exception ex) {
            emitter.completeWithError(ex);
        }
    });

    return emitter;
}
```



 Spring 为 SSE 提供了专门的支持：`**SseEmitter**`，其中的`send()`方法用于发送数据到客户端，`complete()`用于正常结束连接，而`completeWithError()`则是错误终止连接。



这个方案可以做成异步，即通过线程池不断的向`**SseEmitter**`中send数据。





**方式三：使用 Flux实现（推荐）**



还有一种更简单的方式，那就是用Flux实现。



`**Flux**` 是响应式编程库中的一个核心类型，它表示一个**异步的、可变化数量（0 到 N 个）的数据流**，支持流式处理、背压（Backpressure）和非阻塞。



使用方式如下：



```java
@GetMapping(value = "/chat2")
public Flux<String> fluxStream() {
    return Flux.interval(Duration.ofSeconds(1))
            .map(seq -> "Stream element - " + seq);
}
```



只需要接口返回一个Flux类型即可实现，非常的简单。这是一种异步非阻塞的实现方式。推荐用这种。

