<template>
  <div :class="['status-notification', { 'show-notification': isVisible }]">
    <div class="notification-content">
      <h3>申请状态通知</h3>
      <div class="message" v-if="status === 'PENDING'">
        <p>尊敬的{{ name }}，</p>
        <p>
          感谢您对本平台的兴趣，并花时间参加我们的招聘过程。我们已经收到了您的申请，并且正在进行审核。
        </p>
        <p>
          由于审核过程需要一些时间，我们希望您能耐心等待。我们会尽快与您联系，告知审核结果。
        </p>
        <p>
          感谢您的理解和耐心。如果您有任何问题或需要进一步的信息，请随时与我们联系。
        </p>
        <p>祝您一切顺利！</p>
        <p>此致，</p>
        <p>教辅系统团队</p>
      </div>
      <div class="message" v-else-if="status === 'REJECTED'">
        <p>尊敬的{{ name }}，</p>
        <p>
          感谢您对本平台的兴趣，并花时间参加我们的招聘过程。经过仔细考虑，我们遗憾地通知您，您未能通过此次的面试。
        </p>
        <p>
          这并不意味着您的能力不足，而是我们在此次招聘中找到了更符合我们当前需求的候选人。我们非常感谢您展示的专业素养和热情，并希望您在未来的职业生涯中取得更大的成功。
        </p>
        <p>
          我们会将您的简历保存在人才库中，如果未来有适合您的职位，我们会第一时间联系您。
        </p>
        <p>再次感谢您的理解和支持。</p>
        <p>祝您一切顺利！</p>
        <p>此致，</p>
        <p>教辅系统管理员</p>
      </div>
      <el-button
        :type="status === 'PENDING' ? 'warning' : 'info'"
        @click="$emit('close')"
        class="close-button"
      >
        关闭通知
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "TeacherStatusNotification",
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ["PENDING", "REJECTED"].includes(value),
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isVisible = ref(false);

    onMounted(() => {
      setTimeout(() => {
        isVisible.value = true;
      }, 100);
    });

    return {
      isVisible,
    };
  },
};
</script>

<style scoped>
.status-notification {
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

.message {
  line-height: 1.6;
  font-size: 0.95em;
}

.message p {
  margin: 8px 0;
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
