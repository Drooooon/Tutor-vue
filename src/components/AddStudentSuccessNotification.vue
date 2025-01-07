<!-- src/components/AddStudentSuccessNotification.vue -->
<template>
  <div
    :class="['student-notification', { 'show-notification': isVisible }]"
    role="alert"
    aria-live="polite"
  >
    <div class="notification-content">
      <button
        class="close-button"
        @click="closeNotification"
        aria-label="关闭通知"
      >
        &times;
      </button>
      <h3>感谢您的信任！</h3>
      <p>以下是添加成功的学生信息：</p>
      <p>ID: {{ id }}</p>
      <p>姓名: {{ name }}</p>
      <p>年级: {{ grade }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "StudentSuccessNotification",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 10000, // 默认显示时长为10秒
    },
  },
  setup(props, { emit }) {
    const isVisible = ref(false);

    const closeNotification = () => {
      isVisible.value = false;
      setTimeout(() => {
        emit("close");
      }, 500); // 确保动画结束后完全移除
    };

    onMounted(() => {
      setTimeout(() => {
        isVisible.value = true;
      }, 100);

      setTimeout(() => {
        closeNotification();
      }, props.duration);
    });

    return {
      isVisible,
      closeNotification,
    };
  },
};
</script>

<style scoped>
.student-notification {
  position: fixed;
  top: 20px;
  right: 0;
  transform: translateX(100%);
  opacity: 0;
  z-index: 9999; /* 确保通知卡片层级在最前 */
  padding: 20px;
  width: 300px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.5s ease, opacity 0.5s ease;
  color: white;
}

.show-notification {
  transform: translateX(-20px);
  opacity: 1;
  animation: slideAndShake 1.2s ease forwards;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.notification-content h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
}

.notification-content p {
  margin: 5px 0;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: white;
  cursor: pointer;
}

.close-button:hover {
  color: red;
}

@keyframes slideAndShake {
  0% {
    transform: translateX(100%);
  }

  60% {
    transform: translateX(-20px);
  }

  70% {
    transform: translateX(-15px);
  }

  80% {
    transform: translateX(-20px);
  }

  90% {
    transform: translateX(-18px);
  }

  100% {
    transform: translateX(-20px);
  }
}
</style>
