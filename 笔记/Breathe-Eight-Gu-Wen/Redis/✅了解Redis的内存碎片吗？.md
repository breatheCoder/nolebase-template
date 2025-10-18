# 典型回答

> redis的内存碎片是被分配给redis的内存空间, 但是实际上并没有被用到的部分, 这个和mysql还是有点差异, mysql碎片是由于数据的插入, 更新和删除操作, 导致存储空间不连续和浪费. 但这个纯粹就是没有用到, 我认为这个更符合内存碎片的定义.
> 
> redis的内存碎片是如何产生的呢?
> 
> 原因是内存在分配的时候, 没有办法做到按需精确分配. 他的jemalloc分配器会按固定大小(如8B, 16B, 32B....4KB)划分内存页, 当存储的数据大小与分配的空间不完全匹配的时候就会产生内存碎片.
> 
> 而且jemalloc内部会缓存未使用的内存块(目的是为了快速满足后续的内存分配请求, 避免频繁向操作系统申请或释放内存, 提高性能), 这也会造成内存碎片
> 
> 一些数据结构自动扩容也会导致碎片, 如何dict.
> 
> 如何清理碎片呢?
> 他会配置一个参数, 里面有内存占用和碎片率, 如果达到指标就会清理碎片, 清理碎片的原理也很简单, Redis 会在后台运行一个碎片整理器；它会扫描部分内存中的小对象（特别是那些容易产生碎片的对象，比如哈希、字符串、小集合）；通过移动数据、复制并释放旧内存，减少碎片；

所谓**内存碎片，就是被分配给Redis的内存空间，但是实际上并没有被用到的部分。**（这和MySQL的内存碎片还是有些差异的，MySQL内存碎片指的是由于数据的插入、更新和删除操作导致的存储空间不连续和浪费。）



**Redis的内存碎片形成的主要原因是内存在分配的时候，没办法做到精准的按需分配。**



Redis支持libc、jemalloc、tcmalloc多种内存分配器来分配内存，默认使用**jemalloc**。他是按固定大小（如 8B、16B、32B…4KB）划分内存页。当存储的数据大小与分配器提供的块不完全匹配时，会产生剩余空间。**例如申请 5B 数据可能分配 8B，剩余 3B就成为碎片。**



而且jemalloc 内部**会缓存未使用的内存块**（目的是为了快速满足后续的内存分配请求，避免频繁向操作系统申请或释放内存，提升性能）除非显式调用 `malloc_trim` 或 Redis 的 `MEMORY PURGE`，这些空间不会释放给操作系统；所以 `RSS`（物理内存） 不会下降，即使数据删除了。



另外，一些**数据结构自动扩容也会导致碎片**，Redis 内部有些结构（如哈希表、列表、集合）会自动扩容。在扩容时，可能会出现申请了新内存，但是旧内存不释放的情况，比如hash表的渐进式rehash过程：



[[✅什么是Redis的渐进式rehash]]



### 查看碎片情况
```java
INFO memory
# Memory
used_memory:1000000
used_memory_human:976.56K
used_memory_rss:1200000
used_memory_rss_human:1.14M
...
mem_fragmentation_ratio:1.20
```



+ **<font style="color:rgb(24, 24, 24);">used_memory</font>**<font style="color:rgb(24, 24, 24);">：表示</font><font style="color:rgb(24, 24, 24);">Redis</font><font style="color:rgb(24, 24, 24);">为了保存数据实际申请使用的内存空间。</font>
+ **<font style="color:rgb(24, 24, 24);">used_memory_rss</font>**<font style="color:rgb(24, 24, 24);">：表示操作系统实际分配给</font><font style="color:rgb(24, 24, 24);">Redis</font><font style="color:rgb(24, 24, 24);">的物理内存空间，其中包含了内存空间碎片。</font>
+ **<font style="color:rgb(24, 24, 24);">mem_fragmentation_ratio</font>**<font style="color:rgb(24, 24, 24);">：表示Redis当前的内存碎片率。等于used_memory_rss/used_memory</font>
    - **<font style="color:rgb(24, 24, 24);"></font>**<font style="color:rgb(24, 24, 24);">大于等于1但小于等于1.5，这种情况是合理的。</font>
    - <font style="color:rgb(24, 24, 24);">大于1.5，表明内存碎片率已经超过了50%。说明碎片比较多了。</font>

<font style="color:rgb(24, 24, 24);"></font>

### <font style="color:rgb(24, 24, 24);">清理碎片</font>


清理碎片有几种办法，最简单暴力的就是直接重启Redis（手动狗头。。。）



其次，可以利用Redis提供的碎片整理的功能更，在4.0中，提供了`CONFIG SET activedefrag yes`（默认 是 `activedefrag no `）可以用来整理碎片。



他的工作原理是，Redis 会在后台运行一个碎片整理器；它会扫描部分内存中的小对象（特别是那些容易产生碎片的对象，比如哈希、字符串、小集合）；通过移动数据、复制并释放旧内存，减少碎片；



注意，`CONFIG SET activedefrag yes`只是个开关，碎片的整理还要遵守一些条件的。



| **参数** | **默认值** | **建议值** | **说明** |
| --- | --- | --- | --- |
| `active-defrag-ignore-bytes` | 100MB | 500MB | 碎片内存达到此值才触发 |
| `active-defrag-threshold-lower` | 10 | 50 | 碎片率 >30% 开始整理 |
| `active-defrag-threshold-upper` | 100 | 70 | 碎片率 >70% 全力整理 |




假如你做了如下配置：



```plain
# 启用主动碎片整理
CONFIG SET activedefrag yes

# 调整阈值参数
CONFIG SET active-defrag-ignore-bytes 500000000  # 500MB
CONFIG SET active-defrag-threshold-lower 50      # 50%
CONFIG SET active-defrag-threshold-upper 70      # 70%
```



那么他会在碎片率达到50%的时候就开始清理碎片了。



另外，碎片整理的过程中是比较耗费CPU资源的，可以通过一些配置限制资源的使用：



| **参数** | **默认值** | **说明** |
| --- | --- | --- |
| `active-defrag-cycle-min` | 5 | CPU 最小利用率（百分比） |
| `active-defrag-cycle-max` | 75 | CPU 最大利用率（超过则暂停整理） |




使用方法一样是通过`CONFIG SET `来配置具体的值。

