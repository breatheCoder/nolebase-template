# 典型回答


在 Spring Cloud 中，OpenFeign 的超时配置可以通过 `application.yml` 或 `application.properties` 文件来设置：  



```java
feign:
  client:
    config:
      default:
        connectTimeout: 5000  # 连接超时，单位：毫秒
        readTimeout: 5000     # 读取超时，单位：毫秒

```



OpenFeign 提供了 `ErrorDecoder` 接口来处理请求异常的情况。我们可以自定义 `ErrorDecoder` 来捕获不同的 HTTP 状态码并处理相应的逻辑。  



```java
@Configuration
public class FeignConfig {

    @Bean
    public ErrorDecoder errorDecoder() {
        return new ErrorDecoder.Default();  // 可以替换为自定义的 ErrorDecoder
    }
}


@FeignClient(name = "hollis-service", configuration = FeignConfig.class)
public interface ExampleServiceClient {
    @GetMapping("/api/data")
    String getData();
}
```



可以在 `application.yml` 或 `application.properties` 中配置 Feign 的日志级别， 还可以自定义日志记录  



```java
logging:
  level:
    com.example.feignclient: DEBUG
    feign: DEBUG  # 打开 Feign 客户端的日志记录

```



```java
@Bean
Logger.Level feignLoggerLevel() {
    return Logger.Level.FULL;  // 设置为 FULL 记录详细的请求和响应信息
}
```





