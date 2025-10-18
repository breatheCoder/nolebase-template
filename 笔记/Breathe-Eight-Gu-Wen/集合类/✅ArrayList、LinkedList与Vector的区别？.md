# 典型回答

> ArrayList: 基于数组实现(线程不安全)
> 
> LinkedList: 基于双向链表实现(线程不安全)
> 
> Vector: 基于数组实现(线程安全)
> 
> 扩容机制: ArrayList每次增长大小50%, LinkedList由于是双向链表, 所以不需需要创建数组, 无需扩容, Vector每次扩容增长100%
> 
> 随机访问复杂度: ArrayList(O(1)), LinkedList(O(n)), Vector(O(1))
> 
> 插入/删除复杂度: ArrayList平均O(n)(需要移动元素), LinkedList(头尾O(1), 中间O(n)), Vector平均O(n)(需要移动元素)
> 
> 不建议使用Vector(太旧了, 也太慢了)
> 
> 如果想用线程安全的ArrayList, 可以通过Collections来创建一个, 也可以new一个CopyOnWriteArrayList
> 
> ArrayList的扩容详细(每次添加元素, 会先判断容量够不够, 如果不够的话, 就来扩容, 扩容的规则是原大小 + 原大小 >> 1, 也就是变成原先的1.5倍, ArrayList最大值是2^31 - 9, 为什么不是2^31 - 1呢, 是因为他复制的时候使用到了Arrays.copyOf方法, 这个方法要预留8位来存储元数据来提高性能和内存利用率, 之后申请数组, 然后将元素复制进去)

| **<font style="color:rgb(64, 64, 64);">特性</font>**       | **<font style="color:rgb(64, 64, 64);">ArrayList</font>**                                                                                                                                                                                                                                                                        | **<font style="color:rgb(64, 64, 64);">LinkedList</font>**                                                                                                                                                                                                                                                                             | **<font style="color:rgb(64, 64, 64);">Vector</font>**                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **<font style="color:rgb(64, 64, 64);">实现接口</font>**     | <font style="color:rgb(64, 64, 64);">List</font>                                                                                                                                                                                                                                                                                 | <font style="color:rgb(64, 64, 64);">Queue、Deque、List</font>                                                                                                                                                                                                                                                                           | <font style="color:rgb(64, 64, 64);">List</font>                                                                                                                                                                                                                                                                                 |
| **<font style="color:rgb(64, 64, 64);">底层数据结构</font>**   | <font style="color:rgb(64, 64, 64);">数组</font>                                                                                                                                                                                                                                                                                   | <font style="color:rgb(64, 64, 64);">双向链表</font>                                                                                                                                                                                                                                                                                       | <font style="color:rgb(64, 64, 64);">数组</font>                                                                                                                                                                                                                                                                                   |
| **<font style="color:rgb(64, 64, 64);">线程安全</font>**     | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);">非线程安全</font>                                                                                                                                                                                                                                    | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);">非线程安全</font>                                                                                                                                                                                                                                          | <font style="color:rgb(64, 64, 64);"> 线程安全</font>                                                                                                                                                                                                                                                                                |
| **<font style="color:rgb(64, 64, 64);">扩容机制</font>**     | <font style="color:rgb(64, 64, 64);">增长 50%</font>                                                                                                                                                                                                                                                                               | <font style="color:rgb(64, 64, 64);">无需扩容</font>                                                                                                                                                                                                                                                                                       | <font style="color:rgb(64, 64, 64);">增长 100%</font>                                                                                                                                                                                                                                                                              |
| **<font style="color:rgb(64, 64, 64);">随机访问复杂度</font>**  | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);"> O(1)（数组下标）</font>                                                                                                                                                                                                                              | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);"> O(n)（需遍历链表）</font>                                                                                                                                                                                                                                   | <font style="color:rgb(64, 64, 64);">O(1)（数组下标）</font>                                                                                                                                                                                                                                                                           |
| **<font style="color:rgb(64, 64, 64);">插入/删除复杂度</font>** | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);">平均 O(n)（需移动元素）</font>                                                                                                                                                                                                                           | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);">头尾 O(1)，中间 O(n)</font>                                                                                                                                                                                                                                | <font style="color:rgb(64, 64, 64);"></font><font style="color:rgb(64, 64, 64);">平均 O(n)（需移动元素）</font>                                                                                                                                                                                                                           |
| **<font style="color:rgb(64, 64, 64);">迭代器</font>**      | <font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">Iterator</font><br/><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);">+</font><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">ListIterator</font> | <font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">Iterator</font><br/><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);">+</font><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">DescendingIterator</font> | <font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">Iterator</font><br/><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);">+</font><font style="color:rgb(64, 64, 64);"> </font><font style="color:rgb(64, 64, 64);background-color:rgb(236, 236, 236);">ListIterator</font> |
| **<font style="color:rgb(64, 64, 64);">序列化</font>**      | <font style="color:rgb(64, 64, 64);">仅序列化有效元素</font>                                                                                                                                                                                                                                                                             | <font style="color:rgb(64, 64, 64);">序列化节点结构</font>                                                                                                                                                                                                                                                                                    | <font style="color:rgb(64, 64, 64);">默认序列化</font>                                                                                                                                                                                                                                                                                |
| **<font style="color:rgb(64, 64, 64);">是否建议使用</font>**   | <font style="color:rgb(64, 64, 64);">建议</font>                                                                                                                                                                                                                                                                                   | <font style="color:rgb(64, 64, 64);">建议</font>                                                                                                                                                                                                                                                                                         | <font style="color:rgb(64, 64, 64);">不建议</font>                                                                                                                                                                                                                                                                                  |




List主要有ArrayList、LinkedList与Vector几种实现。这三者都实现了List 接口，使用方式也很相似,主要区别在于因为实现方式的不同,所以对不同的操作具有不同的效率。



#### 底层数据结构


**ArrayList和Vector的底层都是一个可改变大小的数组**.当更多的元素加入到ArrayList中时,其大小将会动态地增长.内部的元素可以直接通过get与set方法进行访问,因为ArrayList本质上就是一个数组。



**LinkedList 是一个双向链表**，在添加和删除元素时具有比ArrayList更好的性能，但在get与set方面弱于ArrayList。当然,这些对比都是指数据量很大或者操作很频繁的情况下的对比,如果数据和运算量很小,那么对比将失去意义。



#### 复杂度


因为底层实现的数据结构不同，所以他们的各种操作的复杂度不同。



对于用数组实现的ArrayList和Vector的话，他们更适合查询，因为可以通过数组下标直接找到对应的元素，但是删除比较麻烦，因为删除其中某一个元素后，其他的元素需要移动位置。



而对于使用链表实现的LinkedList来说，他的增删更容易，只需要调整指针就行了，而查询元素比较麻烦，需要从头开始一个一个遍历查找。



#### 线程安全


**Vector属于强同步类。它里面的关键方法是通过synchronized修饰的，即线程安全的。**



而ArrayList和LinkedList没做过任何线程安全的保障，所以是非线程安全的。

#### 扩容


Vector和ArrayList在更多元素添加进来时会请求更大的空间。Vector每次请求其大小的双倍空间，而ArrayList每次对size增长50%。



而使用链表的LinkedList则不需要扩容



#### 实现接口


LinkedList 除了实现了List以外，还实现了Queue和Deque接口,该接口比List提供了更多的方法,包括offer(),peek(),poll()等。

****

#### 建议使用哪个？


如果是增删操作比较多，而查询操作比较少，建议使用LinkedList

如果是查询操作比较多，但是增删比较少的话，建议用ArrayList



而Vector不建议使用，即使是线程安全场景，也不建议，可以用`Collections.synchronizedList()` 或 `CopyOnWriteArrayList`来代替。

# 知识扩展


## ArrayList是如何扩容的？
首先，我们要明白ArrayList是基于数组的，我们都知道，申请数组的时候，只能申请一个定长的数组，那么List是如何通过数组扩容的呢？ArrayList的扩容分为以下几步：

1. 检查新增元素后是否会超过数组的容量，如果超过，则进行下一步扩容
2. 设置新的容量为老容量的1.5倍，最多不超过2^31-1 （Java 8中ArrayList的容量最大是Integer.MAX_VALUE - 8，即2^31-9。这是由于在Java 8中，ArrayList内部实现进行了一些改进，使用了一些数组复制的技巧来提高性能和内存利用率，而这些技巧需要额外的8个元素的空间来进行优化。）
3. 之后，申请一个容量为1.5倍的数组，并将老数组的元素复制到新数组中，扩容完成



## 如何利用List实现LRU？
LRU，即最近最少使用策略，基于时空局部性原理（最近访问的，未来也会被访问），往往作为缓存淘汰的策略，如Redis和GuavaMap都使用了这种淘汰策略。

我们可以基于LinkedList来实现LRU，因为LinkedList基于双向链表，每个结点都会记录上一个和下一个的节点，具体实现方式如下：

```java
public class LruListCache<E> {

    private final int maxSize;

    private final LinkedList<E> list = new LinkedList<>();

    public LruListCache(int maxSize) {
        this.maxSize = maxSize;
    }

    public void add(E e) {
        if (list.size() < maxSize) {
            list.addFirst(e);
        } else {
            list.removeLast();
            list.addFirst(e);
        }
    }

    public E get(int index) {
        E e = list.get(index);
        list.remove(e);
        add(e);
        return e;
    }

    @Override
    public String toString() {
        return list.toString();
    }
}

```

## 数组和链表的区别
[[✅数组和链表有何区别？]]

