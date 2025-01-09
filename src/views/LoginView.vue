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

    // 添加教师状态相关的响应式变量
    const showStatusNotification = ref(false);
    const teacherStatus = ref("");
    const userName = ref("");

    const rules = {
      id: [{ required: true, message: "请输入账号编号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    };

    // 添加通知关闭处理函数
    const handleNotificationClose = () => {
      showStatusNotification.value = false;
      if (teacherStatus.value === "REJECTED") {
        loginForm.value = {
          id: "",
          password: "",
        };
      }
    };

    const handleLogin = async () => {
      loginFormRef.value.validate(async (valid) => {
        if (!valid) {
          ElMessage.error("请完善表单信息");
          return;
        }

        loading.value = true;

        try {
          // 发送登录请求
          const loginResponse = await axios.post(
            "/account/login",
            loginForm.value,
          );

          if (
            loginResponse.data.code !== 200 ||
            loginResponse.data.message !== "success"
          ) {
            ElMessage.error("密码错误或账户不存在，请重试");
            return;
          }

          const { userType, id, name } = loginResponse.data.data;
          userName.value = name;

          if (userType === "customer") {
            handleLoginSuccess({ id, name, path: "/CustomerView" });
          } else if (userType === "teacher") {
            await handleTeacherLogin(id, name);
          } else if (userType === "admin") {
            handleLoginSuccess({ id, name, path: "/AdminView" });
          }
        } catch (error) {
          ElMessage.error("服务器错误，请稍后再试");
        } finally {
          loading.value = false;
        }
      });
    };

    // 处理教师用户的登录逻辑
    const handleTeacherLogin = async (id, name) => {
      try {
        const statusResponse = await axios.post("/account/requestStatus", {
          id: loginForm.value.id,
        });

        if (statusResponse.data.code !== 200) {
          ElMessage.error("获取教师状态失败，请稍后重试");
          return;
        }

        const status = statusResponse.data.data;
        teacherStatus.value = status;

        if (status === "PENDING" || status === "REJECTED") {
          showStatusNotification.value = true;
        } else if (status === "APPROVED") {
          handleLoginSuccess({ id, name, path: "/TeacherView" });
        } else {
          ElMessage.error("未知状态，请联系管理员");
        }
      } catch (error) {
        ElMessage.error("获取教师状态失败，请稍后重试");
      }
    };

    // 通用的登录成功处理逻辑
    const handleLoginSuccess = ({ id, name, path }) => {
      localStorage.setItem("token", "some-token");
      localStorage.setItem("userId", id);
      localStorage.setItem("userName", name);
      ElMessage.success(`欢迎回来，${name}！`);
      router.replace({ path, query: { id } });
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
