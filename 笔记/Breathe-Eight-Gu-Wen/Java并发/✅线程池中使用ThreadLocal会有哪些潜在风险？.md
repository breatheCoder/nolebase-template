# 典型回答


[[✅ThreadLocal为什么会导致内存泄漏？如何解决的？]]



其实这个问题就是上面这个问题的变形。（<u>请仔细看上面这篇文章之后再学习本文，不然可能看不懂。</u>）



如果在线程池中使用ThreadLocal，线程就要复用，就不会被销毁，ThreadLocal 变量不会自动清理，容易造成内存泄漏！  



![[b69a8bf4-bb65-44e2-ad04-8d590df91aea.png]]



因为`ThreadLocal` 绑定在线程的 `ThreadLocalMap` 里。如上图的引用链。如果线程一直被复用，那么Thread Ref就会一直在，那么他关联的Thread对象，ThreadLocalMap和其中的Value就会一直在，无法被回收。



随着线程不断服用，不断的往ThreadLocalMap中加东西，就会导致Value越来越多。最终导致OOM。



ThreadLocalMap底层使用数组来保存元素，使用“线性探测法”来解决hash冲突的，在每次调用ThreadLocal的get、set、remove等方法的时候，内部会实际调用ThreadLocalMap的get、set、remove等操作。



而ThreadLocalMap的每次get、set、remove，都会清理key为null,但是value还存在的Entry。



**所以，当我们在一个ThreadLocal用完之后，手动调用一下remove，就可以在下一次GC的时候，把Entry清理掉。**

****

****

# 
