# 典型回答

> 线程安全:
> 	HashMap(不安全)
> 	Hashtable(所有方法同步, 安全)
> 	ConcurrentHashMap(CAS + synchronized, 安全)
> 允不允许null值:
> 	Hashtable: key和value都不允许null, 否则会抛出NPE
> 	HashMap: key和value都可以为null, 如果key为null, 他存在bucket[0]
> 	ConcurrentHashMap: key和value都不允许为null
> 继承关系:
> 	Hashtable: 继承自老式的Dictionary
> 	HashMap: 继承自AbstractMap, 并实现Map接口
> 	ConcurrentHashMap: 继承自AbstractMap, 并实现ConcurrentMap接口
> 默认初始容量 + 扩容机制:
> 	HashMap的默认容量是16, 加载因子是0.75, 表示当占用bucket容量到0.75的时候, 我们开始进行扩容, 扩容为原来的两倍
> 	Hashtable的默认容量是11, 加载因子是0.75, 当达到0.75的时候, 我们开始扩容, 扩容为2倍 + 1
> 	ConcurrentHashMap的默认容量是16, 加载因子是0.75, 表示当占用bucket容量到达0.75的时候, 我们进行扩容, 扩容为原来的两倍, 他和普通的HashMap的区别就是他扩容充分利用了多线程的优势, 使用分段锁(segment), 每个段分别进行扩容, 避免了竞争, 提高了效率.
> 遍历内部实现:
> 	HashMap: HashMap使用EntrySet进行遍历，即先获取到HashMap中所有的键值对(Entry)，然后遍历Entry集合。支持fail-fast，也就是说在遍历过程中，若HashMap的结构被修改（添加或删除元素），则会抛出ConcurrentModificationException。如果只需要遍历HashMap中的key或value，可以使用KeySet或Values来遍历。
> 	HashTable: Hashtable使用Enumeration进行遍历，即获取Hashtable中所有的key，然后遍历key集合。这个过程也会判断是否存在并发修改：
> 	ConcurrentHashMap: ConcurrentHashMap使用分段锁机制，因此在遍历时需要注意，遍历时ConcurrentHashMap的某个段被修改不会影响其他段的遍历。可以使用EntrySet、KeySet或Values来遍历ConcurrentHashMap，其中EntrySet遍历时效率最高。遍历过程中，ConcurrentHashMap的结构发生变化时，不会抛出ConcurrentModificationException异常，但是在遍历时可能会出现数据不一致的情况，因为遍历器仅提供了弱一致性保障。


**线程安全：**

****

HashMap是非线程安全的。

Hashtable 中的方法是同步的，所以它是线程安全的。

ConcurrentHashMap在JDK 1.8之前使用分段锁保证线程安全， ConcurrentHashMap默认情况下将hash表分为16个桶（分片），在加锁的时候，针对每个单独的分片进行加锁，其他分片不受影响。锁的粒度更细，所以他的性能更好。

ConcurrentHashMap在JDK 1.8中，采用了一种新的方式来实现线程安全，即使用了CAS+synchronized，这个实现被称为"分段锁"的变种，也被称为"锁分离"，它实现的锁的粒度更细。



[[✅ConcurrentHashMap是如何保证线程安全的？]]



**继承关系：**

Hashtable是基于陈旧的Dictionary类继承来的。

HashMap继承了抽象类AbstractMap实现了Map接口。

ConcurrentHashMap同样继承了抽象类AbstractMap，并且实现了ConcurrentMap接口。



**允不允许null值：**

HashTable中，key和value都不允许出现null值，否则会抛出NullPointerException异常。 

HashMap中，null可以作为键或者值都可以。

ConcurrentHashMap中，key和value都不允许为null。



[[✅为什么ConcurrentHashMap不允许null值？]]



**默认初始容量和扩容机制：**

<font style="color:rgb(55, 65, 81);background-color:rgb(247, 247, 248);"></font>

HashMap的默认初始容量为16，默认的加载因子为0.75，即当HashMap中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍，并将原来的元素重新分配到新的桶中。



Hashtable，默认初始容量为11，默认的加载因子为0.75，即当Hashtable中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍加1，并将原来的元素重新分配到新的桶中。



ConcurrentHashMap，默认初始容量为16，默认的加载因子为0.75，即当ConcurrentHashMap中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍，并会采用分段锁机制，将ConcurrentHashMap分为多个段(segment)，每个段独立进行扩容操作，避免了整个ConcurrentHashMap的锁竞争。

 



**遍历方式的内部实现上不同 ：**



HashMap使用EntrySet进行遍历，即先获取到HashMap中所有的键值对(Entry)，然后遍历Entry集合。支持fail-fast，也就是说在遍历过程中，若HashMap的结构被修改（添加或删除元素），则会抛出ConcurrentModificationException。如果只需要遍历HashMap中的key或value，可以使用KeySet或Values来遍历。



Hashtable使用Enumeration进行遍历，即获取Hashtable中所有的key，然后遍历key集合。这个过程也会判断是否存在并发修改：



```java
public T next() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
    return nextElement();
}

public void remove() {
    if (!iterator)
        throw new UnsupportedOperationException();
    if (lastReturned == null)
        throw new IllegalStateException("Hashtable Enumerator");
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();

    synchronized(Hashtable.this) {
        Entry[] tab = Hashtable.this.table;
        int index = (lastReturned.hash & 0x7FFFFFFF) % tab.length;

        for (Entry<K,V> e = tab[index], prev = null; e != null;
             prev = e, e = e.next) {
            if (e == lastReturned) {
                modCount++;
                expectedModCount++;
                if (prev == null)
                    tab[index] = e.next;
                else
                    prev.next = e.next;
                count--;
                lastReturned = null;
                return;
            }
        }
        throw new ConcurrentModificationException();
    }
}
```



ConcurrentHashMap使用分段锁机制，因此在遍历时需要注意，遍历时ConcurrentHashMap的某个段被修改不会影响其他段的遍历。可以使用EntrySet、KeySet或Values来遍历ConcurrentHashMap，其中EntrySet遍历时效率最高。遍历过程中，ConcurrentHashMap的结构发生变化时，不会抛出ConcurrentModificationException异常，但是在遍历时可能会出现数据不一致的情况，因为遍历器仅提供了弱一致性保障。





| 特性/集合类        | HashMap     | Hashtable  | ConcurrentHashMap                                      |
| ------------- | ----------- | ---------- | ------------------------------------------------------ |
| 线程安全          | 否           | 是，基于方法锁    | 是，基于分段锁（分段锁是个概念，并不是说只有Segment那种才叫分段锁，详见CHM的不同版本介绍的文章。） |
| 继承关系          | AbstractMap | Dictionary | AbstractMap，ConcurrentMap                              |
| 允许null值       | K-V都允许      | K-V都不允许    | K-V都不允许                                                |
| 默认初始容量        | 16          | 11         | 16                                                     |
| 默认加载因子        | 0.75        | 0.75       | 0.75                                                   |
| 扩容后容量         | 原来的两倍       | 原来的两倍加1    | 原来的两倍                                                  |
| 是否支持fail-fast | 支持          | 支持         | fail-safe                                              |










