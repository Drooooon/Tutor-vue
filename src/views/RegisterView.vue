<template>
  <el-container class="login-container">
    <el-card class="register-card" shadow="hover">
      <h2 class="title">注册</h2>
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerFormRef"
        label-width="0"
      >
        <el-form-item prop="userType">
          <el-radio-group
            v-model="registerForm.userType"
            @change="handleUserTypeChange"
          >
            <el-radio label="teacher">我是老师</el-radio>
            <el-radio label="customer">我是家长</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="name">
          <el-input v-model="registerForm.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading">
            注册
          </el-button>
          <el-button type="text" @click="goToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <teacher-success-notification
      v-if="showNotification && registerForm.userType === 'teacher'"
      :id="registeredId"
      :name="registeredName"
      @close="handleNotificationClose"
    />
    <customer-success-notification
      v-if="showNotification && registerForm.userType === 'customer'"
      :id="registeredId"
      :name="registeredName"
      @close="handleNotificationClose"
    />
  </el-container>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "../api/axios";
import CustomerSuccessNotification from "@/components/CustomerRegisterNotification.vue";
import TeacherSuccessNotification from "@/components/TeacherRegisterNotification.vue";

export default {
  name: "RegisterView",
  components: {
    CustomerSuccessNotification,
    TeacherSuccessNotification,
  },
  setup() {
    const router = useRouter();

    // 表单相关的响应式数据
    const registerForm = ref({
      userType: "customer",
      name: "",
      password: "",
      email: "",
    });
    const loading = ref(false);
    const registerFormRef = ref(null);

    // 通知相关的响应式数据
    const showNotification = ref(false);
    const registeredId = ref("");
    const registeredName = ref("");

    const rules = {
      userType: [
        { required: true, message: "请选择用户类型", trigger: "change" },
      ],
      name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, message: "密码至少6位", trigger: "blur" },
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        {
          type: "email",
          message: "请输入有效的邮箱地址",
          trigger: ["blur", "change"],
        },
      ],
    };

    // 处理注册
    const handleRegister = async () => {
      registerFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          try {
            const response = await axios.post(
              "/account/add",
              registerForm.value,
            );

            if (response.data.code === 200) {
              const { id, name } = response.data.data;
              registeredId.value = id;
              registeredName.value = name;
              showNotification.value = true;
            } else {
              ElMessage.error(response.data.message || "注册失败！");
            }
          } catch (error) {
            console.error("注册错误:", error);
            ElMessage.error(
              error.response?.data?.message || "服务器错误，请稍后再试",
            );
          } finally {
            loading.value = false;
          }
        } else {
          ElMessage.error("请完善表单信息");
        }
      });
    };

    // 处理通知关闭
    const handleNotificationClose = () => {
      showNotification.value = false;
      router.push("/");
    };

    // 跳转到登录页
    const goToLogin = () => {
      router.push("/");
    };

    // 用户类型变更处理
    const handleUserTypeChange = (value) => {
      console.log("用户类型:", value);
    };

    return {
      registerForm,
      rules,
      handleRegister,
      goToLogin,
      loading,
      registerFormRef,
      handleUserTypeChange,
      showNotification,
      registeredId,
      registeredName,
      handleNotificationClose,
    };
  },
};
</script>

<style scoped>
/* 全局背景 */
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 注册卡片 */
.register-card {
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 标题样式 */
.title {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

/* 表单项颜色 */
.el-form-item {
  color: #fff;
}

/* 输入框样式 */
:deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

:deep(.el-input__inner:focus) {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 5px rgba(66, 185, 131, 0.6);
}

/* 按钮样式和动效 */
:deep(.el-button) {
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

:deep(.el-button--primary) {
  background-color: #42b983;
  border-color: #42b983;
}

:deep(.el-button--primary:hover) {
  background-color: #36a772;
  border-color: #36a772;
  transform: scale(1.05);
}

:deep(.el-button--text) {
  color: #fff;
  transition: color 0.3s ease, transform 0.2s ease;
}

:deep(.el-button--text:hover) {
  color: #42b983;
  transform: scale(1.05);
}

/* 单选框样式 */
:deep(.el-radio) {
  color: #fff;
}

:deep(.el-radio__label) {
  color: #fff;
}

:deep(.el-radio.is-checked .el-radio__label) {
  color: #42b983;
}
</style>
