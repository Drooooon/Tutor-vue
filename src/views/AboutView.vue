<template>
  <el-container class="about-container">
    <el-card class="about-card acrylic" shadow="hover">
      <h2 class="title">关于我们</h2>
      <p class="description">
        欢迎使用我们的教辅系统！<br />
        本系统旨在为教师和家长提供便捷、高效的教学管理与沟通工具。<br />
        我们致力于构建一个更紧密的教育网络，促进学习与成长。<br /><br />
        感谢您的信任与支持！<br />
        —— jmu.cdl
      </p>
    </el-card>
  </el-container>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 确保高度为整个视口高度 */
  width: 100vw;
  /* 确保宽度为整个视口宽度 */
}

/* 亚克力卡片样式 */
.about-card {
  width: 550px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
  color: #fff;
}

/* 标题样式 */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
}

/* 描述文本样式 */
.description {
  font-size: 16px;
  line-height: 1.8;
  color: #fff;
}
</style>
