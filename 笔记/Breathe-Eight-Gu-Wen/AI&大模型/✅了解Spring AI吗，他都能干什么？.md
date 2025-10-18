# 典型回答


Spring ai是Spring官方推出的ai应用开发框架，最近（2025年5月20）刚刚发布1.0版本，他的主要作用就是通过提供各种API的封装来降低用Java开发大模型应用的门槛。



#### **与大型语言模型集成**
Spring通过简单的配置快速集成 OpenAI、Azure OpenAI、HuggingFace、Ollama、Mistral、Google Gemini 等主流 LLM 服务。



```java
ChatClient chatClient = ... // 自动注入或配置
ChatResponse response = chatClient.call("帮我写一个天气查询的API");
System.out.println(response.getResult().getOutput());
```



#### 提供了ChatClient和ChatModel和大模型进行对话


ChatModel API 让应用开发者可以非常方便的与 AI 模型进行文本交互，它抽象了应用与模型交互的过程，包括使用 `Prompt` 作为输入，使用 `ChatResponse` 作为输出等。



```java
@RestController
public class ChatModelController {
  private final ChatModel chatModel;

  public ChatModelController(ChatModel chatModel) {
    this.chatModel = chatModel;
  }

  @RequestMapping("/chat")
  public String chat(String input) {
    ChatResponse response = chatModel.call(new Prompt(input));
    return response.getResult().getOutput().getContent();
  }
}
```



`ChatClient` 提供了与 AI 模型通信的 Fluent API，它支持同步和反应式（Reactive）编程模型。与 `ChatModel`、`Message`、`ChatMemory` 等原子 API 相比，更加灵活，代码更精简。



```java
@RestController
public class ChatController {

  private final ChatClient chatClient;

  public ChatController(ChatClient.Builder builder) {
    this.chatClient = builder.build();
  }

  @GetMapping("/chat")
  public String chat(String input) {
    return this.chatClient.prompt()
        .user(input)
        .call()
        .content();
  }
}
```



#### **Prompt 模板支持**
可以定义 prompt 模板，使用变量动态生成 prompt。使用类似 Spring Boot 配置和注入方式加载模板。



```java
PromptTemplate template = new PromptTemplate("请用Java写一个{task}的例子");
String prompt = template.render(Map.of("task", "文件读取"));
```



#### **支持RAG**
支持将文本向量化后存储到向量数据库（如 Redis, Pinecone, PostgreSQL with pgvector, Milvus 等）。可用于构建 RAG 应用，实现文档问答、知识库问答等。

```java
EmbeddingClient embeddingClient = ...;
VectorStore vectorStore = new PgVectorStore(...);
vectorStore.add(List.of(new Document("Spring 是什么框架？", metadata)));
```



#### 支持对话记忆


<font style="color:rgb(53, 56, 65);">支持基于chat memory的对话记忆，也就是不需要调用显示的记录每一轮的对话历史。</font>

<font style="color:rgb(53, 56, 65);"></font>

```java
//初始化基于内存的对话记忆
ChatMemory chatMemory = new InMemoryChatMemory();

DashScopeChatModel chatModel = ...;
ChatClient chatClient = ChatClient.builder(dashscopeChatModel)
.defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
.build();

//对话记忆的唯一标识
String conversantId = UUID.randomUUID().toString();

ChatResponse response = chatClient
        .prompt()
        .user("我想去新疆")
        .advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, conversantId)
                .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
        .call()
        .chatResponse();
String content = response.getResult().getOutput().getContent();
Assertions.assertNotNull(content);

logger.info("content: {}", content);

response = chatClient
        .prompt()
        .user("可以帮我推荐一些美食吗")
        .advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, conversantId)
                .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
        .call()
        .chatResponse();
content = response.getResult().getOutput().getContent();
Assertions.assertNotNull(content);

logger.info("content: {}", content);
```

<font style="color:rgb(53, 56, 65);"></font>

<font style="color:rgb(53, 56, 65);"></font>



#### **支持Function Calling**


[[✅什么是Function Calling？]]



官方文档：[https://docs.spring.io/spring-ai/reference/api/tools.html](https://docs.spring.io/spring-ai/reference/api/tools.html)



#### 支持MCP


[[✅什么是MCP？]]



官方文档：[https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html)



