# 典型回答


<font style="color:rgb(64, 64, 64);">DeepSeek的训练成本显著低于行业平均水平（如GPT-4的1/20），官方自己说V3模型训练成本仅为557.6万美元，那么做了什么呢？</font>

<font style="color:rgb(64, 64, 64);"></font>

#### <font style="color:rgb(64, 64, 64);">合专家模型（MoE）与动态路由  
</font>
<font style="color:rgb(64, 64, 64);">DeepSeek采用</font>**<font style="color:rgb(64, 64, 64);">Transformer+MoE架构</font>**<font style="color:rgb(64, 64, 64);">，在训练和推理时仅激活部分参数（如推理阶段激活10%-37%的参数量），显著减少计算资源消耗。动态路由机制根据输入内容自动分配专家网络，进一步提升效率</font>



#### <font style="color:rgb(64, 64, 64);">强化学习与训练策略优化</font>
<font style="color:rgb(64, 64, 64);">  
</font><font style="color:rgb(64, 64, 64);">引入GRPO算法（Group Relative Policy Optimization），摒弃传统PPO算法中的价值模型，减少50%训练内存需求，并通过强化学习直接优化策略，降低无效训练60%</font>

<font style="color:rgb(64, 64, 64);"></font>

#### <font style="color:rgb(64, 64, 64);">FP8混合精度训练</font>
<font style="color:rgb(64, 64, 64);">  
</font><font style="color:rgb(64, 64, 64);">全球首个全面采用8位浮点（FP8）精度训练的大模型，动态调整训练阶段精度，降低内存占用40%，同时支持消费级显卡运行复杂模型</font>

<font style="color:rgb(64, 64, 64);"></font>

#### <font style="color:rgb(64, 64, 64);">PTX编程</font>
<font style="color:rgb(64, 64, 64);">  
</font><font style="color:rgb(64, 64, 64);">直接优化底层硬件指令（如英伟达PTX编程层），绕过CUDA抽象层，最大化GPU算力利用率。例如，在A100显卡上运行原需H100的任务。</font>

<font style="color:rgb(64, 64, 64);"></font>

<font style="color:rgb(64, 64, 64);"></font>

