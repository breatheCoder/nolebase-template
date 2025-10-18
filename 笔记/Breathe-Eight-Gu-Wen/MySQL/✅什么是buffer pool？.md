# 典型回答

> buffer pool 是为了加快读写效率的一个缓冲池, 都知道因为mysql有持久化, 所以数据都存在了磁盘中, 但是如果我们直接和磁盘交互的性能会很差, 所以为了提高性能, 就引入了buffer pool.
> buffer 是在内存上的一块连续空间, 他主要的用途就是用来缓冲数据页的, 每个数据页的大小是16KB.


- [x] 什么是buffer pool  [completion:: 2025-08-14]



我们都知道，MySQL的数据是存储在磁盘上面的（Memory引擎除外），但是如果每次数据的查询和修改都直接和磁盘交互的话，性能是很差的。



于是，为了提升读写性能，Innodb引擎就引入了一个中间层，就是buffer pool。



buffer是在内存上的一块连续空间，他主要的用途就是用来缓存数据页的，每个数据页的大小是16KB。



> 页是Innodb做数据存储的单元，无论是在磁盘，还是buffer pool中，都是按照页读取的，这也是一种'预读'的思想。
>



[[✅介绍一下InnoDB的数据页，和B+树的关系是什么？]]



![[6894d68f-2f20-4251-8a94-61c21b7a9bea.png]]



有了buffer pool之后，当我们想要做数据查询的时候，InnoDB会首先检查Buffer Pool中是否存在该数据。如果存在，数据就可以直接从内存中获取，避免了频繁的磁盘读取，从而提高查询性能。如果不存在再去磁盘中进行读取，磁盘中如果找到了的数据，则会把该数据所在的页直接复制一份到buffer pool中，并返回给客户端，后续的话再次读取就可以从buffer pool中就近读取了。



![[28b96a77-ce82-49f7-85a0-28b57d3de4d5.png]]



当需要修改的时候也一样，需要先在buffer pool中做修改，然后再把他写入到磁盘中。



但是因为buffer pool是基于内存的，所以空间不可能无限大，他的默认大小是<font style="color:rgb(51, 51, 51);">128M，当然这个</font>大小也不是完全固定的，我们可以调整，可以通过修改MySQL配置文件中的innodb_buffer_pool_size参数来调整Buffer Pool的大小<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);"></font>

```plain
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';  -- 查看buffer pool

SET GLOBAL innodb_buffer_pool_size = 512M; -- 修改buffer pool
```

<font style="color:rgb(51, 51, 51);"></font>

# <font style="color:rgb(51, 51, 51);">扩展知识</font>


## buffer pool和query cache的区别


在Innodb中，除了buffer pool，还有一个缓存层是用来做数据缓存，提升查询效率的，很多人搞不清楚他和buffer pool的区别是什么。



首先就是他们目的和作用不同。Buffer Pool用于缓存表和索引的数据页，从而加速读取操作；而Query Cache用于缓存查询结果，减少重复查询的执行时间。



Buffer Pool主要与存储引擎InnoDB相关，而Query Cache也支持其他的引擎，如MyISAM等。所以，Query Cache是位于Server层的优化技术，而Buffer Pool 是位于引擎层的优化技术。



需要注意的是，在MySQL 5.7版本中，Query Cache已经被标记为废弃，并在MySQL 8.0版本中彻底被移除了。

  
 

## 读写过程


[[✅buffer pool的读写过程是怎么样的？]]



