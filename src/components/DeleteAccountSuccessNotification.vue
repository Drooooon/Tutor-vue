<!-- src/components/SuccessNotification.vue -->
<template>
  <div :class="['success-notification', { 'show-notification': isVisible }]">
    <div class="notification-content">
      <h3>账号注销成功</h3>
      <p>感谢您的陪伴</p>
      <p>期待与您的再次相遇</p>
      <el-button type="success" @click="$emit('close')" class="home-button">
        前往首页
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "SuccessNotification",
  setup() {
    const isVisible = ref(false);
    const router = useRouter();

    const goToHome = () => {
      isVisible.value = false;
      router.push("/");
    };

    onMounted(() => {
      setTimeout(() => {
        isVisible.value = true;
      }, 100);

      setTimeout(() => {
        goToHome();
      }, 5000); // 5秒后自动回到主界面
    });

    return {
      isVisible,
      goToHome,
    };
  },
};
</script>

<style scoped>
.success-notification {
  position: fixed;
  top: 20px;
  left: 0;
  transform: translateX(-100%);
  padding: 20px;
  width: 300px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.5s ease;
  z-index: 1000;
  color: white;
}

.show-notification {
  transform: translateX(20px);
  animation: slideAndShake 1.2s ease forwards;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-content h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
}

.notification-content p {
  margin: 5px 0;
}

.home-button {
  margin-top: 10px;
  width: 100%;
}

@keyframes slideAndShake {
  0% {
    transform: translateX(-100%);
  }

  60% {
    transform: translateX(20px);
  }

  70% {
    transform: translateX(15px);
  }

  80% {
    transform: translateX(20px);
  }

  90% {
    transform: translateX(18px);
  }

  100% {
    transform: translateX(20px);
  }
}
</style>
