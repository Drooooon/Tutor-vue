<template>
  <el-container class="customer-container">
    <!-- 提示框 -->
    <AddStudentSuccessNotification
      v-if="isNotificationVisible"
      :id="notificationData?.id"
      :name="notificationData?.name"
      :grade="notificationData?.grade"
      @close="isNotificationVisible = false"
    />
    <DeleteAccountSuccessNotification
      v-if="isDeleteAccountSuccessVisible"
      @close="isDeleteAccountSuccessVisible = false"
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
        <el-menu-item index="add-student">
          <template #title>
            <i class="el-icon-plus"></i>
            <span>添加学生</span>
          </template>
        </el-menu-item>
        <el-menu-item index="account-management">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>账号信息管理</span>
          </template>
        </el-menu-item>
        <el-sub-menu index="student-management">
          <template #title>
            <i class="el-icon-user"></i>
            <span>学生管理</span>
          </template>
          <el-menu-item
            v-for="student in students"
            :key="student.id"
            :index="'student-' + student.id"
          >
            {{ student.name }}
          </el-menu-item>
        </el-sub-menu>
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
        <!-- 主页欢迎信息 -->
        <div v-if="currentPage === 'home'" class="welcome-message">
          <h2>欢迎，{{ userName }}！</h2>
          <p>请选择侧边栏的内容进行管理。</p>
        </div>

        <!-- 添加学生表单 -->
        <div v-if="currentPage === 'add-student'" class="form-container">
          <div class="floating-form">
            <h2 class="form-title">添加学生</h2>
            <el-form
              :model="newStudent"
              @submit.prevent="submitForm"
              label-position="top"
              class="student-form"
            >
              <el-row :gutter="30">
                <el-col :span="12">
                  <el-form-item label="姓名">
                    <el-input
                      v-model="newStudent.name"
                      placeholder="请输入学生姓名"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="年龄">
                    <el-input
                      v-model="newStudent.age"
                      type="number"
                      placeholder="请输入年龄"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="年级">
                <el-select v-model="newStudent.grade" placeholder="请选择年级">
                  <el-option label="高一" value="高一"></el-option>
                  <el-option label="高二" value="高二"></el-option>
                  <el-option label="高三" value="高三"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="科目">
                <div class="subjects-grid">
                  <div
                    v-for="subject in subjects"
                    :key="subject"
                    class="subject-card"
                  >
                    <el-checkbox v-model="newStudent.subjects" :label="subject">
                      {{ subject }}
                    </el-checkbox>
                  </div>
                </div>
              </el-form-item>

              <el-form-item class="submit-button-container">
                <el-button type="primary" size="large" @click="submitForm"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 账号管理 -->
        <div
          v-if="currentPage === 'account-management'"
          class="account-management-container"
        >
          <div class="password-change-container">
            <h2>修改密码</h2>
            <el-form
              :model="passwordForm"
              label-position="top"
              class="password-form"
            >
              <el-form-item label="旧密码">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="请输入旧密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                ></el-input>
              </el-form-item>
              <el-form-item class="submit-button-container">
                <el-button type="primary" size="large" @click="updatePassword"
                  >提交</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="account-deletion-container">
            <h2>注销账号</h2>
            <el-form
              :model="deleteAccountForm"
              label-position="top"
              class="delete-account-form"
            >
              <el-form-item label="密码">
                <el-input
                  v-model="deleteAccountForm.password"
                  type="password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="deleteAccountForm.confirm">
                  我确认注销账号
                </el-checkbox>
              </el-form-item>
              <el-form-item class="submit-button-container">
                <el-button
                  type="danger"
                  size="large"
                  @click="deleteAccount"
                  :disabled="!deleteAccountForm.confirm"
                >
                  确认注销
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 学生信息查看及管理 -->
        <div v-if="currentPage.startsWith('student-')" class="student-view">
          <div class="info-manage-container">
            <div class="student-info-container">
              <h2 class="student-info-title">
                {{ selectedStudent.name }} 的信息
              </h2>
              <p class="student-info-p">学号: {{ selectedStudent.id }}</p>
              <p class="student-info-p">年级: {{ selectedStudent.grade }}</p>
              <p class="student-info-p">年龄: {{ selectedStudent.age }}</p>
              <p
                class="student-info-p"
                v-if="Array.isArray(selectedStudent.subjects)"
              >
                科目: {{ selectedStudent.subjects.join(", ") }}
              </p>
              <p v-else>科目: 无</p>
            </div>

            <div class="subject-management-container">
              <el-button @click="toggleSubjectManagement">
                {{ isAddingSubject ? "切换到删除科目" : "切换到新增科目" }}
              </el-button>
              <div v-if="isAddingSubject">
                <h3>新增科目</h3>
                <el-form @submit.prevent="addSubject">
                  <el-form-item label="科目">
                    <div class="subjects-grid">
                      <div
                        v-for="subject in restSubjects"
                        :key="subject"
                        class="subject-card"
                      >
                        <el-checkbox
                          v-model="selectedSubjects"
                          :label="subject"
                        >
                          {{ subject }}
                        </el-checkbox>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item class="submit-button-container">
                    <el-button type="primary" size="large" @click="addSubject"
                      >提交</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
              <div v-else>
                <h3>删除科目</h3>
                <el-form @submit.prevent="deleteSubject">
                  <el-form-item label="科目">
                    <div class="subjects-grid">
                      <div
                        v-for="subject in selectedStudent.subjects"
                        :key="subject"
                        class="subject-card"
                      >
                        <el-checkbox
                          v-model="selectedSubjects"
                          :label="subject"
                        >
                          {{ subject }}
                        </el-checkbox>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item class="submit-button-container">
                    <el-button
                      type="primary"
                      size="large"
                      @click="deleteSubject"
                      >提交</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>

          <!-- 图表区域 -->
          <div class="chart-container" v-if="selectedStudent.subjects?.length">
            <div class="subject-list">
              <el-radio-group
                v-model="selectedSubject"
                @change="handleSubjectChange"
              >
                <el-radio
                  v-for="subject in selectedStudent.subjects"
                  :key="subject"
                  :label="subject"
                >
                  {{ subject }}
                </el-radio>
              </el-radio-group>
            </div>
            <div class="chart-and-details">
              <div class="chart-wrapper" v-if="chartData.length">
                <line-chart
                  :average="chartData.map((item) => item.average)"
                  :scores="chartData.map((item) => item.score)"
                  :testname="chartData.map((item) => item.examName)"
                />
              </div>
              <div class="exam-details">
                <h3 class="details-title">考试详情</h3>
                <ul class="details-list" v-if="recentExams.length">
                  <li v-for="(item, index) in recentExams" :key="index">
                    <span class="exam-name">{{ item.examName }}:</span>
                    <span class="score">{{ item.score }}</span>
                  </li>
                </ul>
                <p v-else>近期无考试</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "../api/axios";
import AddStudentSuccessNotification from "@/components/AddStudentSuccessNotification.vue";
import LineChart from "@/components/LinerChart.vue";
import DeleteAccountSuccessNotification from "@/components/DeleteAccountSuccessNotification.vue";

export default {
  components: {
    AddStudentSuccessNotification,
    LineChart,
    DeleteAccountSuccessNotification,
  },
  name: "CustomerView",
  data() {
    return {
      isNotificationVisible: false, // 控制添加学生成功通知的显示
      notificationData: null, // 存储通知数据
      userName: "加载中...", // 用户名
      students: [], // 学生列表
      subjects: [], // 科目列表
      restSubjects: [], // 剩余科目列表
      selectedSubjects: [], // 选中的科目
      activeIndex: "home", // 当前激活的菜单索引
      currentPage: "home", // 当前页面
      selectedStudent: {}, // 选中的学生
      breadcrumb: ["主页"], // 面包屑导航
      newStudent: {
        name: "", // 新学生姓名
        age: null, // 新学生年龄
        grade: "", // 新学生年级
        subjects: [], // 新学生科目
        customerId: parseInt(localStorage.getItem("userId"), 10), // 客户ID
      },
      isAddingSubject: true, // 是否在添加科目
      selectedSubject: "", // 选中的科目
      chartData: [], // 图表数据
      recentExams: [], // 最近的考试数据
      passwordForm: {
        oldPassword: "", // 旧密码
        newPassword: "", // 新密码
      },
      deleteAccountForm: {
        password: "", // 注销账号的密码
        confirm: false, // 确认注销
      },
      isDeleteAccountSuccessVisible: false, // 控制注销账号成功通知的显示
    };
  },
  created() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!userId) {
      this.$router.push("/");
      return;
    }
    this.userName = userName || "未知用户";
    this.fetchStudents(userId);
    this.fetchSubjects();
  },
  methods: {
    // 获取学生列表
    async fetchStudents(userId) {
      try {
        const response = await axios.post(
          "/customer/getStudentsByCustomerId",
          { id: userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.students = response.data.data;
        } else {
          this.students = [];
        }
      } catch (error) {
        console.error("获取学生列表失败:", error);
        this.students = [];
      }
    },
    // 获取学生的科目列表
    async fetchStudentSubjects(studentId) {
      try {
        const response = await axios.post(
          "/customer/getSubjectsByStudentId",
          { id: studentId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.selectedStudent.subjects = response.data.data;
        } else {
          this.selectedStudent.subjects = [];
          console.warn("科目接口返回失败:", response.data.message);
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        this.selectedStudent.subjects = [];
      }
    },
    // 获取所有科目列表
    async fetchSubjects() {
      try {
        const response = await axios.get("/customer/getAllSubject");
        if (response.data.code === 200) {
          this.subjects = response.data.data;
          console.log("科目列表:", this.subjects);
        } else {
          this.subjects = [];
          console.warn("科目接口返回失败:", response.data.message);
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        this.subjects = [];
      }
    },
    // 获取剩余科目列表
    async fetchRestSubjects(studentId) {
      try {
        const response = await axios.post(
          "/customer/getRestSubjects",
          { id: studentId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.restSubjects = response.data.data;
        } else {
          this.restSubjects = [];
          console.warn("剩余科目接口返回失败:", response.data.message);
        }
      } catch (error) {
        console.error("获取剩余科目列表失败:", error);
        this.restSubjects = [];
      }
    },
    // 添加科目
    async addSubject() {
      try {
        const response = await axios.put(
          "/customer/addSubject",
          { id: this.selectedStudent.id, subjects: this.selectedSubjects },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.selectedStudent.subjects = response.data.data;
          this.$message.success("科目添加成功！");
          await this.fetchRestSubjects(this.selectedStudent.id);
        } else {
          this.$message.error("科目添加失败！");
        }
      } catch (error) {
        console.error("科目添加失败:", error);
        this.$message.error("科目添加失败！");
      }
    },
    // 删除科目
    async deleteSubject() {
      try {
        const response = await axios.put(
          "/customer/deleteSubjects",
          { id: this.selectedStudent.id, subjects: this.selectedSubjects },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.selectedStudent.subjects = response.data.data;
          this.$message.success("科目删除成功！");
        } else {
          this.$message.error("科目删除失败！");
        }
      } catch (error) {
        console.error("科目删除失败:", error);
        this.$message.error("科目删除失败！");
      }
    },
    // 获取图表数据
    async fetchChartData() {
      try {
        const response = await axios.post(
          "/customer/getCharts",
          {
            studentId: this.selectedStudent.id,
            subjectName: this.selectedSubject,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data.code === 200) {
          this.chartData = response.data.data;
          this.recentExams = this.chartData.slice(-5);
        } else {
          this.chartData = [];
          this.recentExams = [];
        }
      } catch (error) {
        console.error("获取图表数据失败:", error);
        this.chartData = [];
        this.recentExams = [];
      }
    },
    // 更新密码
    async updatePassword() {
      if (this.passwordForm.newPassword.length < 6) {
        this.$message.warning("新密码不能小于六位！");
        return;
      }
      try {
        const userId = parseInt(localStorage.getItem("userId"), 10);
        const response = await axios.put("/account/updatePassword", {
          id: userId,
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
        });
        if (response.data.code === 200) {
          this.$message.success(response.data.data);
        } else if (response.data.code === 401) {
          this.$message.error(response.data.data);
        }
      } catch (error) {
        console.error("修改密码失败:", error);
        this.$message.error("修改密码失败！");
      }
    },
    // 注销账号
    async deleteAccount() {
      try {
        const userId = parseInt(localStorage.getItem("userId"), 10);
        const response = await axios.delete("/account/deleteAccount", {
          data: {
            id: userId,
            password: this.deleteAccountForm.password,
          },
        });
        if (response.data.code === 200) {
          this.isDeleteAccountSuccessVisible = true;
        } else if (response.data.code === 401) {
          this.$message.error(response.data.data);
        }
      } catch (error) {
        console.error("注销账号失败:", error);
        this.$message.error("注销账号失败！");
      }
    },
    // 处理科目变化
    handleSubjectChange() {
      if (this.selectedSubject) {
        this.fetchChartData();
      } else {
        this.chartData = [];
        this.recentExams = [];
      }
    },
    // 处理菜单选择
    handleMenuSelect(index) {
      this.activeIndex = index;
      if (index === "home") {
        this.currentPage = "home";
        this.breadcrumb = ["主页"];
      } else if (index === "add-student") {
        this.currentPage = "add-student";
        this.breadcrumb = ["主页", "添加学生"];
        this.newStudent = {
          name: "",
          age: null,
          grade: "",
          subjects: [],
          customerId: parseInt(localStorage.getItem("userId"), 10),
        };
      } else if (index.startsWith("student-")) {
        const studentId = parseInt(index.split("-")[1], 10);
        this.selectedStudent = this.students.find(
          (student) => student.id === studentId,
        );
        this.currentPage = index;
        this.breadcrumb = ["主页", "学生管理", this.selectedStudent.name];
        this.fetchStudentSubjects(studentId);
        this.fetchRestSubjects(studentId);
      } else if (index === "account-management") {
        this.currentPage = "account-management";
        this.breadcrumb = ["主页", "账号信息管理"];
      }
    },
    // 切换科目管理模式
    toggleSubjectManagement() {
      this.isAddingSubject = !this.isAddingSubject;
      this.selectedSubjects = [];
    },
    // 提交添加学生表单
    async submitForm() {
      if (!this.newStudent.name) {
        this.$message.warning("请输入学生姓名！");
        return;
      }
      if (!this.newStudent.age) {
        this.$message.warning("请输入学生年龄！");
        return;
      }
      if (!this.newStudent.grade) {
        this.$message.warning("请选择年级！");
        return;
      }

      try {
        const response = await axios.post(
          "/customer/addStudent",
          this.newStudent,
        );
        if (response.data.code === 200) {
          this.students.push(response.data.data);
          this.$message.success("添加学生成功！");
          this.notificationData = response.data.data;
          this.isNotificationVisible = true;
          this.currentPage = "home";
          this.breadcrumb = ["主页"];
        }
      } catch (error) {
        console.error("添加学生失败:", error);
        this.$message.error("添加学生失败！");
      }
    },
  },
};
</script>
<style scoped>
/* 客户容器样式 */
.customer-container {
  min-height: 100vh;
  padding: 20px;
  background-image: url("@/assets/image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 侧边栏样式 */
.aside-panel {
  border-radius: 12px;
  margin-right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 确保侧边栏内容多时可以滚动 */
}

/* 隐藏侧边栏滚动条 */
.el-aside::-webkit-scrollbar {
  display: none;
}

/* 隐藏主面板滚动条 */
.el-main::-webkit-scrollbar {
  display: none;
}

/* 主面板样式 */
.main-panel {
  gap: 20px;
}

/* 头部面板样式 */
.header-panel {
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 主内容样式 */
.main-content {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
}

/* 科目网格样式 */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  justify-items: center;
  max-width: 800px;
  margin: 0 auto;
}

/* 科目卡片样式 */
.subject-card {
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  text-align: center;
}

/* 提交按钮容器样式 */
.submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 学生信息容器样式 */
.student-info-container {
  width: 30%;
  height: 40%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2); /* 更高的模糊效果 */
  backdrop-filter: blur(20px); /* 更高的模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 信息管理容器样式 */
.info-manage-container {
  display: flex;
  width: 100%;
  gap: 20px;
}

/* 学生信息标题样式 */
.student-info-title {
  color: #000; /* 黑色字体 */
}

/* 学生信息段落样式 */
.student-info-p {
  color: #333;
}

/* 科目管理容器样式 */
.subject-management-container {
  width: 60%;
  height: 50%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2); /* 更高的模糊效果 */
  backdrop-filter: blur(20px); /* 更高的模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 图表容器样式 */
.chart-container {
  width: 95%;
  height: 60%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2); /* 更高的模糊效果 */
  backdrop-filter: blur(20px); /* 更高的模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;
}

/* 科目列表样式 */
.subject-list {
  width: 70%;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 科目列表单选按钮样式 */
.subject-list .el-radio {
  margin: 0 10px;
}

/* 科目列表单选按钮悬停和选中样式 */
.subject-list .el-radio:hover,
.subject-list .el-radio.is-checked {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* 图表和详情样式 */
.chart-and-details {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 图表包装器样式 */
.chart-wrapper {
  flex: 1;
}

/* 考试详情样式 */
.exam-details {
  width: 200px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

/* 详情标题样式 */
.details-title {
  color: #000;
  margin-bottom: 10px;
}

/* 详情列表样式 */
.details-list {
  list-style: none;
  padding: 0;
}

/* 详情列表项样式 */
.details-list li {
  margin: 8px 0;
}

/* 考试名称样式 */
.exam-name {
  color: #333;
}

/* 分数样式 */
.score {
  color: #666;
  margin-left: 5px;
}

/* 账号管理容器样式 */
.account-management-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* 密码更改容器和账号删除容器样式 */
.password-change-container,
.account-deletion-container {
  width: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 提交按钮容器样式 */
.submit-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 菜单项和子菜单标题悬停样式 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.2);
}

/* 提交按钮样式 */
:deep(.submit-button-container .el-button) {
  padding: 12px 40px;
  font-size: 16px;
}

/* 菜单样式 */
:deep(.el-menu) {
  background: transparent;
  border-right: none;
  overflow-y: auto; /* 确保侧边栏内容多时可以滚动 */
  scrollbar-width: none; /* 隐藏滚动条 */
  -ms-overflow-style: none; /* IE and Edge 隐藏滚动条 */
}

/* 隐藏菜单滚动条 */
:deep(.el-menu::-webkit-scrollbar) {
  display: none; /* 隐藏滚动条 */
}

/* 活动菜单项样式 */
:deep(.el-menu-item.is-active) {
  background: #42b983;
  /* 绿色背景 */
  color: #000;
  /* 黑色字体 */
  font-weight: bold;
  /* 加粗 */
  font-size: 16px;
  /* 字体放大 */
}

/* 子菜单标题样式 */
:deep(.el-sub-menu__title) {
  color: #333;
}
</style>
