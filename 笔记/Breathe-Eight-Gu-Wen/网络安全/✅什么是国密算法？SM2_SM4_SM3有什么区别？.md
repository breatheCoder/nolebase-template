# 典型回答
****

**国密算法**（**SM系列算法**）是中国国家密码管理局（SCA，State Cryptography Administration）制定的国产商用密码算法标准，**广泛应用于金融、政务、电信等领域**，主要用于数据加密、身份认证、电子签名等场景。



> <font style="color:rgb(51, 51, 51);">本文主要介绍的都是SM系列密码，SM代表商密，即商业密码，是指用于商业的、不涉及国家秘密的密码技术。</font>
>



SM国密算法主要包括以下几种：



### 国密对称加密算法：SM4


**SM4** 是中国制定的**分组对称加密算法**，用于数据加密和解密。采用128位密钥，分组长度128位（16字节），采用32轮迭代加密方式，安全性较高，适用于无线局域网标准（WAPI）、移动支付、金融行业等。



相比常见的AES加密算法，**AES支持128/192/256位，SM4固定128位。AES-128和SM4的安全性相当，SM4更适合国产软硬件环境。**

****

```java
String content = "Hollistest中文";

// 随机生成密钥
SymmetricCrypto sm4 = SmUtil.sm4();

String encryptHex = sm4.encryptHex(content);
String decryptStr = sm4.decryptStr(encryptHex, CharsetUtil.CHARSET_UTF_8);
```



### 国密非对称加密算法：SM2
**SM2** 是基于椭圆曲线密码学（ECC, Elliptic Curve Cryptography）的**公钥密码算法**，是一种典型的非对称加密算法。场用于**数据加密、数字签名和身份认证**。



SM2相比传统RSA算法更高效，密钥长度更短但安全性更高。SM2使用256位，RSA通常为2048/3072位（更长）。SM2签名和解密速度比RSA快，适用于资源受限设备（如移动终端）。SM2主要用于电子认证、数字签名、SSL/TLS安全传输等场景。



```java
String text = "Hollis测试aaaa";

SM2 sm2 = SmUtil.sm2();
// 公钥加密，私钥解密
String encryptStr = sm2.encryptBcd(text, KeyType.PublicKey);
String decryptStr = StrUtil.utf8Str(sm2.decryptFromBcd(encryptStr, KeyType.PrivateKey));
```



### 国密哈希算法：SM3
****

**SM3** 是中国自主研发的**密码散列算法（Hash算法）**，类似于SHA-256。他同样更适合国产硬件环境，被广泛用于中国的电子政务、金融、可信计算等应用。



```java
//结果为：136ce3c86e4ed909b76082055a61586af20b4dab674732ebd4b599eef080c9be
String digestHex = SmUtil.sm3("aaaaa");
```



### 国密密钥交换算法：SM9
**SM9** 是基于**身份密码学（IBE，Identity-Based Encryption）**的公钥密码算法。通过用户的身份信息（如邮箱、手机号）生成公钥，无需传统的CA证书体系，减少证书管理成本。适用于物联网（IoT）、云计算、区块链等场景。





### **对比**
| 算法 | 类型 | 主要用途 | 主要特点 |
| --- | --- | --- | --- |
| **SM4** | 对称加密 | 数据加密、文件加密 | 128位密钥，AES级安全 |
| **SM2** | 非对称加密 | 数字签名、身份认证 | ECC算法，密钥短但更安全 |
| **SM3** | 哈希算法 | 数据完整性校验 | 抗碰撞，类似SHA-256 |
| **SM9** | 密钥交换 | 身份密码学，去中心化 | 适用于IoT、云计算 |


由于国家对信息安全的高度重视，国密算法已成为国内各行业的标准安全协议，并被广泛应用于各类安全场景。



# 扩展知识


## 如何使用


Hutool针对`Bouncy Castle`做了简化包装，用于实现国密算法中的SM2、SM3、SM4。可以使用Hutool来简化国密算法的使用：[https://doc.hutool.cn/pages/SmUtil/#%E4%BB%8B%E7%BB%8D](https://doc.hutool.cn/pages/SmUtil/#%E4%BB%8B%E7%BB%8D) 



引入以下依赖后，就可以像前面的例子一样使用这些算法了。



```java
<dependency>
  <groupId>org.bouncycastle</groupId>
  <artifactId>bcpkix-jdk18on</artifactId>
  <version>1.78.1</version>
</dependency>
```





