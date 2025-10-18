# 典型回答

> 在我眼里最大的区别就是他们的扩容机制
> 
> 他们的底层数据结构也不太一样, 我们直接列举一下吧
> 
> 1. 数据结构: 
> 	1. redis的hash结构底层基于zipList(压缩列表)和hashtable实现的(6.0ziplist变成listpack)
> 	2. hashmap用的是数组 + 链表 + 红黑树
> 2. 并发问题
> 	1. redis本身是单线程执行, 所以肯定是线程安全的
> 	2. hashmap没有做线程安全的措施, fail-fast, 所以是线程不安全
> 3. 扩容机制:
> 	1. redis使用的是渐进式hash, 把扩容的操作分散开来, 不是一口气完成扩容, 减少了阻塞, 避免了请求延迟, 但是扩容期间内存占用是翻倍的.
> 	2. hashmap恰好相反, 他是一口气完成扩容, 减少了内存占用, 但是增加了阻塞, 但是我们日常使用场景下, 也不会像redis中给hash结构存很多数据, 所以也不需要渐进式hash

这个问题挺有意思的，如果真要对比，可以列出几十条的区别来，因为毕竟他们俩差异太大了， 一个是Redis中的，一个是Java中的，虽然都是hash结构。如果面试官问这个问题的话，我认为他可能比较关注的是这几个区别：



1、底层数据结构

2、并发安全相关

3、扩容机制



### 数据结构


**Redis的hash结构底层是基于ziplist（压缩列表）和hashtable实现的（6.0中ziplist改为了listpack）。**

****

ziplist用于小的hash结构，而hashtable用于大的hash结构，和zset差不多，也是可以通过配置来调整具体使用的结构的，以下两个同时满足时用ziplist，否则用hashtable。



+ Hash 中 `k-v` 对的数量 <= `hash-max-ziplist-entries` (默认 512)
+ 所有 k 和 v 的字符串长度 <= `hash-max-ziplist-value` (默认 64 字节)



[[✅Redis的ZipList、SkipList和ListPack之间有什么区别？]]

<font style="color:rgb(64, 64, 64);"></font>

ziplist/listpack的优点是极其节省内存。没有指针开销，内存局部性好。但是缺点就是增删改查操作（尤其是中间插入/删除）时间复杂度 O(n)，效率较低。



hashtable的优点是查找、插入、删除的平均时间复杂度 O(1)，适合大数据量。缺点就是内存开销较大，需要额外存储指针。



[[✅ZSet为什么在数据量少的时候用ZipList，而在数据量大的时候转成SkipList？]]



而HashMap采用的是数组+链表+红黑树的存储结构。



[[✅HashMap的数据结构是怎样的？]]





### 并发安全


因为Redis本身是单线程执行命令的，所以所有对 Redis Hash 的操作都是线程安全的。



而Java中的HashMap本身并不是线程安全的，需要用使用ConcurrentHashMap来保证线程安全。（`Collections.synchronizedMap(new HashMap<>())`也可以）





### 扩容机制


Redis的hash结构在扩容的时候，采用一种渐进式rehash的方案，可以实现平滑扩容，避免一次性迁移所有数据导致的请求延迟。但是缺点就是在数据迁移期间，内存占用是翻倍的。



[[✅什么是Redis的渐进式rehash]]



Java中的HashMap是没有采用渐进式rehash的，而是会一次性完成整个 Map 中所有元素的迁移。好处和缺点刚好和上面的渐进式rehash相反，优点是不占用过多空间，缺点就是迁移过程会阻塞。



但是其实HashMap也没必要搞渐进式rehash，因为HashMap一般都是存很少的数据，不像Redis一样大家会拿他来存很多东西。

