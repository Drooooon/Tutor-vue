<template>
  <el-container class="exam-system-container">
    <!-- 提示框 -->
    <AddExamNotification
      v-if="isNotificationVisible"
      :data="notificationData"
      @close="isNotificationVisible = false"
    />

    <!-- 侧边栏 -->
    <el-aside width="200px" class="aside-panel">
      <el-menu :default-active="activeIndex" @select="handleMenuSelect">
        <el-menu-item index="home">
          <template #title>
            <i class="el-icon-house"></i>
            <span>主页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="add-exam">
          <template #title>
            <i class="el-icon-edit"></i>
            <span>添加考试及信息</span>
          </template>
        </el-menu-item>
        <el-menu-item index="view-scores">
          <template #title>
            <i class="el-icon-document"></i>
            <span>查看成绩信息</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主面板 -->
    <el-container class="main-panel">
      <el-header class="header-panel">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <span class="username">{{ userName }}</span>
      </el-header>

      <el-main class="main-content">
        <!-- 主区域内容，暂时为空 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ExamManagementSystem",
  setup() {
    const activeIndex = ref("home");
    const breadcrumb = ref(["主页"]);
    const userName = ref("管理员");
    const isNotificationVisible = ref(false);
    const notificationData = ref(null);

    const handleMenuSelect = (index) => {
      activeIndex.value = index;
      switch (index) {
        case "home":
          breadcrumb.value = ["主页"];
          break;
        case "add-exam":
          breadcrumb.value = ["主页", "添加考试及信息"];
          break;
        case "view-scores":
          breadcrumb.value = ["主页", "查看成绩信息"];
          break;
        default:
          breadcrumb.value = ["主页"];
      }
    };

    return {
      activeIndex,
      breadcrumb,
      userName,
      isNotificationVisible,
      notificationData,
      handleMenuSelect,
    };
  },
};
</script>

<style scoped>
.exam-system-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.aside-panel {
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
}

.header-panel {
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.breadcrumb {
  font-size: 14px;
}

.username {
  font-size: 14px;
  color: #666;
}

.main-content {
  padding: 20px;
  background-color: #fafafa;
  flex: 1;
}
</style>
