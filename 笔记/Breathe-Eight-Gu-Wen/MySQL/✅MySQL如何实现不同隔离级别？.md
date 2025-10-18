# 典型回答

- [x] MySQL如何实现不同隔离级别  [completion:: 2025-08-17]

> 通过MVCC和锁机制来实现不同的隔离级别:
> 
> RU: 他没有通过任何的MVCC, 读就是当前读, 但是写要加锁, 它可以防止脏写问题(加X锁, 然后在commit前都不释放)
> RC: 他会在每一次读都会生成一个快照(这里读到的是其他事务已经提交的数据, 所以可以多避免一个脏读)
> RR: 他会在第一次读的时候生成一个快照(这个快照会更新在本事务中更新的数据, 所以可以避免不可重复读, 因为他不会读到别人更新的数据, 他看不到, 解决了大部分的幻读, 用快照读来读取的其实都防止掉了, 但是不能够防范当前读, 而且如果更新了没有查到的数据, 由于更新的过程是加锁的并且读最新的数据, 所以他会更新成功, 更新成功后就会更新快照, 然后读到本读不到的数据)
> Serializable: 完整避免了所有并发问题, 但是性能很低.



MySQL 通过 **多版本并发控制（MVCC）** 和 **锁机制** 实现不同的事务隔离级别。以下是各隔离级别的实现原理及对应的并发控制手段：



| 隔离级别 | 脏读 | 不可重复读 | 幻读 | **实现机制** |
| --- | --- | --- | --- | --- |
| **READ UNCOMMITTED** | 可能 | 可能 | 可能 | **直接读取最新数据（无版本控制）** |
| **READ COMMITTED** | 不可能 | 可能 | 可能 | **每次查询生成新 Read View** |
| **REPEATABLE READ** | 不可能 | 不可能 | 可能 | **事务开始时生成 Read View + Next-Key 锁** |
| **SERIALIZABLE** | 不可能 | 不可能 | 不可能 | **所有读操作加共享锁，写操作加排他锁** |




[[✅InnoDB如何解决脏读、不可重复读和幻读的？]]



# 扩展知识
## MVCC
InnoDB 通过 **Undo Log** 和 **Read View** 实现 MVCC：



[[✅如何理解MVCC？]]



+ **Undo Log**：  
记录数据修改前的旧版本（版本链），用于构建历史快照。

```sql
-- 示例：更新操作生成 Undo Log
UPDATE users SET name = 'Bob' WHERE id = 1;
-- Undo Log 中会记录旧值（name = 'Alice'）和事务 ID（trx_id=200）
```



+ **Read View**：  
事务启动时生成，包含以下信息：
    - **trx_ids**，表示在生成ReadView时当前系统中活跃的读写事务的事务id列表。
    - **low_limit_id**，应该分配给下一个事务的id 值。
    - **up_limit_id**，未提交的事务中最小的事务 ID。
    - **creator_trx_id**，创建这个 Read View 的事务 ID。



[[✅什么是ReadView，什么样的ReadView可见？]]



**数据可见性规则**：  
通过遍历版本链，选择符合以下条件的版本：

    1. 版本 `trx_id (最新修改该行的事务ID) < up_limit_id`→ 可见（已提交）。
    2. 版本 `trx_id >= low_limit_id`→ 不可见（未来事务）。
    3. 版本 `trx_id` 在 `tr_ids` 中 → 不可见（未提交）。
    4. 其他情况 → 可见。



## 锁机制与幻读处理
+ **Next-Key 锁**（REPEATABLE READ 默认）：  
组合 **记录锁（行锁）** 和 **间隙锁（Gap Lock）**，防止幻读。（并不能完全解决）

```sql
-- 事务 A（RR 隔离级别）
BEGIN;
SELECT * FROM users WHERE age > 20 FOR UPDATE;  -- 对 age > 20 的所有记录及间隙加锁

-- 事务 B 尝试插入
INSERT INTO users (age) VALUES (25);  -- 阻塞，直到事务 A 提交
```



[[✅Innodb的RR到底有没有解决幻读？]]



+ **SERIALIZABLE**：  
所有读操作隐式转换为 `SELECT ... FOR SHARE`，加共享锁。

```sql
-- 事务 A
BEGIN;
SELECT * FROM users WHERE age > 20;  -- 自动加共享锁

-- 事务 B 尝试更新
UPDATE users SET name = 'Bob' WHERE age = 25;  -- 阻塞，直到事务 A 提交
```





