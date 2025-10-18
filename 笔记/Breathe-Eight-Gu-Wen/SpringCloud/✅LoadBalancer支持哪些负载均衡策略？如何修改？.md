# 典型回答


Spring Cloud LoadBalancer 内置其实只提供了以下2种默认策略：

| **策略** | **类** | **描述** |
| --- | --- | --- |
| **轮询 (Round-Robin)** | `RoundRobinLoadBalancer` | **默认策略**，每个请求依次分配到不同的实例 |
| **随机 (Random)** | `RandomLoadBalancer` | 随机选择一个可用实例 |




默认情况下，Spring Cloud LoadBalancer 使用`RoundRobinLoadBalancer` 进行轮询调度（向下兼容了Ribbon的轮询策略），即请求会依次轮流分配到可用的服务实例。  定义在`LoadBalancerClientConfiguration` 中：



```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnDiscoveryEnabled
public class LoadBalancerClientConfiguration {
	
	@Bean
	@ConditionalOnMissingBean
	public ReactorLoadBalancer<ServiceInstance> reactorServiceInstanceLoadBalancer(Environment environment,
			LoadBalancerClientFactory loadBalancerClientFactory) {
		String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
		return new RoundRobinLoadBalancer(
				loadBalancerClientFactory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
	}
}
```



以上，就可以看到，这里是使用了RoundRobinLoadBalancer来作为默认的负载均衡策略的。





如果想要修改负载均衡策略，需要自己定义 `ReactorLoadBalancer<ServiceInstance>` Bean。  比如使用随机策略：



```java
@Bean
public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(Environment environment,
                                                               LoadBalancerClientFactory clientFactory) {
    String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
    return new RandomLoadBalancer(clientFactory.getLazyProvider(name, ServiceInstanceListSupplier.class), name);
}
```



# 扩展知识


## Nacos负载均衡策略使用


当然，除了默认的这两种之外，其实我们还可以用其他的负载均衡策略，比如Nacos提供的 NacosLoadBalancer，用如下方式即可开启Nacos的负载均衡策略了。



```java
@Bean
public ReactorLoadBalancer<ServiceInstance> nacosLoadBalancer(Environment environment,
                                                              LoadBalancerClientFactory clientFactory) {
    String serviceId = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
    return new NacosLoadBalancer(clientFactory.getLazyProvider(serviceId, ServiceInstanceListSupplier.class), serviceId);
}

```



## 自定义负载均衡策略


在 **Spring Cloud LoadBalancer** 中自定义负载均衡策略，通常需要实现 `ReactorServiceInstanceLoadBalancer` 接口，并在其中自定义实例选择逻辑。Spring Cloud LoadBalancer 会根据你的负载均衡策略来决定如何选择服务实例。  



1、 实现 `ReactorServiceInstanceLoadBalancer`



```java
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.Request;
import org.springframework.cloud.client.loadbalancer.Response;
import org.springframework.cloud.client.loadbalancer.ReactorServiceInstanceLoadBalancer;
import org.springframework.cloud.client.loadbalancer.ServiceInstanceListSupplier;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class CustomLoadBalancer implements ReactorServiceInstanceLoadBalancer {

    private final ServiceInstanceListSupplier serviceInstanceListSupplier;

    public CustomLoadBalancer(ServiceInstanceListSupplier serviceInstanceListSupplier) {
        this.serviceInstanceListSupplier = serviceInstanceListSupplier;
    }

    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        return serviceInstanceListSupplier.get().next().map(serviceInstances -> {
            // 自定义负载均衡逻辑
            // 这里可以是轮询、最小请求次数、加权策略等
            ServiceInstance chosenInstance = chooseByMinRequestCount(serviceInstances);
            return new DefaultResponse(chosenInstance);
        });
    }

    /**
     * 按最少请求次数选择实例（示例策略）
     */
    private ServiceInstance chooseByMinRequestCount(List<ServiceInstance> serviceInstances) {
        // 这里可以使用计数器或者负载均衡逻辑进行选择，示例为选择第一个
        return serviceInstances.get(0); 
    }
}
```



2、 配置自定义负载均衡器。



```java
import org.springframework.cloud.client.loadbalancer.ReactorServiceInstanceLoadBalancer;
import org.springframework.cloud.client.loadbalancer.ServiceInstanceListSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoadBalancerConfig {

    @Bean
    public ReactorServiceInstanceLoadBalancer customLoadBalancer(ServiceInstanceListSupplier serviceInstanceListSupplier) {
        return new CustomLoadBalancer(serviceInstanceListSupplier);
    }
}
```







