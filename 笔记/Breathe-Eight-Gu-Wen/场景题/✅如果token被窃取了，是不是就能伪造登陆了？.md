# 典型回答


假如，我们拿到了别人在某个网站上登录后的token（通常为AccessToken） ，是不是就可以直接用这个token访问他的数据了呢？是不是就相当于可以直接登录了呢？



确实是，一般是这样的，因为token是很多登录框架做鉴权的主要手段，所以很多时候，我们想要模拟登陆某个网站的时候，都是通过预先获取token做的。



那么，这个问题如何避免呢？可以从以下几个方面去考虑。



首先就是如何避免token被窃取，第二是如果获取到如何减少被攻击的概率。



### 如何避免token被窃取
首先，**token的窃取一般在2个阶段可以做，一个是网络传输过程中，一个是存储过程中。**网络传输这个比较简单，一般来说我们只需要注意，第一不要在url中传输token，而是通过header等方式传输。第二就是尽可能使用HTTPS的方式传输即可。



那么在存储过程中，我们需要注意的一般来说，我们的token都是通过浏览器cookie存储的，那么想要避免cookie被窃取，可以通过设置HttpOnly 和 Secure属性来实现。



```plain
Set-Cookie: session_id=abc123; Secure; HttpOnly; Path=/
```



> `HttpOnly` 标记的 Cookie 会被浏览器存储，但禁止客户端 JavaScript（如 `document.cookie`）读取或修改该 Cookie。这是防御 XSS（跨站脚本攻击） 的关键手段，因为即使攻击者注入了恶意脚本，也无法窃取受保护的 Cookie。
>
> `Secure` 属性确保浏览器仅在 HTTPS 加密连接中发送该 Cookie，防止在 HTTP 明文传输中被中间人窃取。
>



另外，很多时候token也被存储在cookie以外的存储中，比如LocalStorage/SessionStorage，这些位置应该尽量避免存储token。



> LocalStorage 和 SessionStorage 是浏览器提供的两种客户端存储机制。
>



### 如何降低token被窃取带来的影响


#### 过期/刷新机制


可以通过过期机制让token的不要那么长，比如短有效期（如15分钟~1小时），减少攻击窗口。



<font style="color:rgb(64, 64, 64);">还可以引入RefreshTo</font>ken机制，用于在 Access Token 过期后获取新的令牌，减少长期暴露敏感令牌的风险。



#### IP绑定


为了避免被窃取，可以将Token与用户登录时的IP或设备指纹（如mac地址、umid等）绑定，异常来源直接拒绝。





**<font style="color:rgb(64, 64, 64);">速率限制</font>**

  
还可以做一个限制单个Token的请求频率，防止自动化攻击。



#### **<font style="color:rgb(64, 64, 64);">多重验证</font>**


对敏感操作（如登录、修改密码）要求第二因素验证（短信、刷脸、指纹等），即使Token泄漏，攻击者仍需突破额外屏障。





