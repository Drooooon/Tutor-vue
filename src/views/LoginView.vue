<template>
  <el-container class="login-container">
    <el-card class="login-card acrylic" shadow="hover">
      <h2 class="title">登录</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="0"
      >
        <el-form-item prop="id">
          <el-input v-model="loginForm.id" placeholder="账号编号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </el-button>
          <el-button type="text" @click="goToRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加状态通知组件 -->
    <TeacherStatusNotification
      v-if="showStatusNotification"
      :status="teacherStatus"
      :name="userName"
      @close="handleNotificationClose"
    />
  </el-container>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "../api/axios";
import TeacherStatusNotification from "@/components/TeacherStatusNotification.vue";

export default {
  components: {
    TeacherStatusNotification,
  },
  name: "LoginView",
  setup() {
    const router = useRouter();
    const loginForm = ref({
      id: "",
      password: "",
    });
    const loading = ref(false);
    const loginFormRef = ref(null);

    const showStatusNotification = ref(false);
    const teacherStatus = ref("");
    const userName = ref("");

    const rules = {
      id: [{ required: true, message: "请输入账号编号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };

    const handleNotificationClose = () => {
      showStatusNotification.value = false;
      if (teacherStatus.value === "REJECTED") {
        loginForm.value = {
          id: "",
          password: "",
        };
      }
    };

    const handleLogin = () => {
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          try {
            const loginResponse = await axios.post(
              "/account/login",
              loginForm.value,
            );

            if (
              loginResponse.data.code === 200 &&
              loginResponse.data.message === "success"
            ) {
              const { userType, id, name } = loginResponse.data.data;
              userName.value = name;

              if (userType === "customer") {
                localStorage.setItem("token", "some-token");
                localStorage.setItem("userId", id);
                localStorage.setItem("userName", name);
                ElMessage.success(`欢迎回来，${name}！`);
                router.replace({ path: "/CustomerView", query: { id } });
              } else if (userType === "teacher") {
                try {
                  const statusResponse = await axios.post(
                    "/account/requestStatus",
                    {
                      id: loginForm.value.id,
                    },
                  );

                  // 正确处理状态响应
                  if (statusResponse.data.code === 200) {
                    teacherStatus.value = statusResponse.data.data;

                    if (
                      statusResponse.data.data === "PENDING" ||
                      statusResponse.data.data === "REJECTED"
                    ) {
                      showStatusNotification.value = true;
                      return; // 阻止后续的存储和跳转操作
                    }
                  }

                  // 只有在状态正常时才进行这些操作
                  localStorage.setItem("token", "some-token");
                  localStorage.setItem("userId", id);
                  localStorage.setItem("userName", name);
                  ElMessage.success(`欢迎回来，${name}！`);
                  router.replace("/TeacherView");
                } catch (error) {
                  ElMessage.error("获取教师状态失败，请稍后重试");
                }
              } else if (userType === "admin") {
                localStorage.setItem("token", "some-token");
                localStorage.setItem("userId", id);
                localStorage.setItem("userName", name);
                ElMessage.success(`欢迎回来，${name}！`);
                router.replace("/AdminView");
              }
            } else {
              ElMessage.error("密码错误或账户不存在，请重试");
            }
          } catch (error) {
            ElMessage.error("服务器错误，请稍后再试");
          } finally {
            loading.value = false;
          }
        } else {
          ElMessage.error("请完善表单信息");
        }
      });
    };

    const goToRegister = () => {
      router.push("/register");
    };

    return {
      loginForm,
      rules,
      handleLogin,
      goToRegister,
      loading,
      loginFormRef,
      showStatusNotification,
      teacherStatus,
      userName,
      handleNotificationClose,
    };
  },
};
</script>

<style scoped>
/* 保持原有样式不变 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.el-form-item {
  color: #fff;
}

.el-input__inner {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.el-input__inner:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.6);
}

.el-button {
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.el-button--primary {
  background-color: #42b983;
  border-color: #42b983;
}

.el-button--primary:hover {
  background-color: #36a772;
  border-color: #36a772;
  transform: scale(1.05);
}

.el-button--text {
  color: #fff;
  transition: color 0.3s ease, transform 0.2s ease;
}

.el-button--text:hover {
  color: #42b983;
  transform: scale(1.05);
}
</style>
