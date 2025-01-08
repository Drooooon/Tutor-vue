<template>
  <el-container class="teacher-container">
    <el-aside width="200px" class="aside-panel">
      <el-menu :default-active="activeIndex" @select="handleMenuSelect">
        <el-menu-item index="home">
          <template #title>
            <i class="el-icon-house"></i>
            <span>主页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="create-exam">
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>发布考试</span>
          </template>
        </el-menu-item>
        <el-menu-item index="view-exams">
          <template #title>
            <i class="el-icon-notebook-2"></i>
            <span>查看考试</span>
          </template>
        </el-menu-item>
        <el-menu-item index="view-students">
          <template #title>
            <i class="el-icon-user"></i>
            <span>查看学生</span>
          </template>
        </el-menu-item>
        <el-menu-item index="account-management">
          <template #title>
            <i class="el-icon-setting"></i>
            <span>账号信息管理</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>
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
        <div v-if="currentPage === 'create-exam'">
          <h2>发布考试</h2>
          <el-form :model="newExam" label-position="top" class="exam-form">
            <el-form-item label="考试科目">
              <el-select
                v-model="newExam.subjectId"
                placeholder="请选择考试科目"
              >
                <el-option
                  v-for="subject in subjects"
                  :key="subject.subjectId"
                  :label="subject.subjectName"
                  :value="subject.subjectId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年段">
              <el-select v-model="newExam.grade" placeholder="请选择考试年段">
                <el-option
                  v-for="(grade, index) in ['高一', '高二', '高三']"
                  :key="index"
                  :label="grade"
                  :value="grade"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="newExam.startTime"
                type="datetime"
                placeholder="Select date and time"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DDTHH:mm:ss "
              />
            </el-form-item>
            <el-form-item class="submit-button-container">
              <el-button type="primary" @click="createExam">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="currentPage === 'view-exams'">
          <h2 class="section-title">查看考试</h2>
          <el-table :data="exams" style="width: 100%" class="exam-table">
            <el-table-column
              label="考试科目"
              prop="subject"
              class="table-column"
            ></el-table-column>
            <el-table-column
              label="开始时间"
              prop="examDate"
              class="table-column"
            ></el-table-column>
            <el-table-column label="操作" width="200" class="table-column">
              <template #default="{ row }">
                <el-button
                  @click="toggleExpand(row)"
                  size="mini"
                  class="expand-button"
                >
                  {{ row.expanded ? "收起" : "查看学生" }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="参考学生"
              prop="students"
              class="table-column"
            >
              <template #default="{ row }">
                <el-collapse v-if="row.expanded" style="margin-top: 10px">
                  <el-collapse-item
                    v-for="detail in row.examDetails"
                    :key="detail.id"
                    :title="detail.name"
                    class="exam-collapse-item"
                  >
                    <div><strong>学号：</strong>{{ detail.id }}</div>
                    <div><strong>分数：</strong>{{ detail.score }}</div>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="currentPage === 'view-students'">
          <h2>查看学生</h2>
          <el-table :data="students" style="width: 100%">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="学号" prop="studentId"></el-table-column>
            <el-table-column label="年级" prop="grade"></el-table-column>
            <el-table-column label="班级" prop="class"></el-table-column>
          </el-table>
        </div>
        <div v-if="currentPage === 'account-management'">
          <h2>账号信息管理</h2>
          <el-form :model="passwordForm" label-position="top">
            <el-form-item label="旧密码">
              <el-input
                type="password"
                v-model="passwordForm.oldPassword"
                placeholder="请输入旧密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                type="password"
                v-model="passwordForm.newPassword"
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
            <el-form-item class="submit-button-container">
              <el-button type="primary" @click="updatePassword"
                >修改密码</el-button
              >
            </el-form-item>
          </el-form>
          <el-form :model="deleteAccountForm" label-position="top">
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="deleteAccountForm.password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="deleteAccountForm.confirm">
                我确认注销账号</el-checkbox
              >
            </el-form-item>
            <el-form-item class="submit-button-container">
              <el-button
                type="danger"
                @click="deleteAccount"
                :disabled="!deleteAccountForm.confirm"
              >
                注销账号</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "../api/axios"; // 引入 axios
export default {
  name: "TeacherView",
  data() {
    return {
      userName: "加载中...",
      userId: "",
      activeIndex: "home",
      currentPage: "home",
      breadcrumb: ["主页"],
      drawerVisible: false,
      selectedExam: null,
      exams: [],
      students: [],
      subjects: [],
      newExam: {
        subjectId: "",
        startTime: "",
        grade: "",
      },
      // selectedExam: {},
      newQuestion: {
        type: "",
        content: "",
        options: [],
        answer: "",
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
      },
      deleteAccountForm: {
        password: "",
        confirm: false,
      },
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
    this.userId = userId;
    this.fetchSubjects(userId);
    this.fetchExams(userId);
    this.fetchStudents();
  },
  methods: {
    // 创建考试
    async createExam() {
      console.log("createExam", this.newExam);
      try {
        console.log(1111111);
        const response = await axios.post(
          "/teacher/createExam",
          {
            id: this.userId,
            subjectId: this.newExam.subjectId,
            examDate: this.newExam.startTime,
            grade: this.newExam.grade,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.code === 200) {
          this.$message.success("创建考试成功！");
          this.fetchExams();
          this.currentPage = "view-exams";
        } else {
          this.$message.error("创建考试失败");
        }
      } catch (error) {
        console.error("创建考试失败", error);
        this.$message.error("创建考试失败");
      }
    },
    // 获取科目列表
    async fetchSubjects(userId) {
      try {
        const response = await axios.post(
          "/teacher/getAllSubject",
          { id: userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.data.code === 200) {
          // console.log(response.data);
          this.subjects = response.data.data;
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        this.$message.error("获取科目列表失败");
      }
    },
    // 获取考试列表
    async fetchExams(userId) {
      try {
        const response = await axios.get("/teacher/getExams?userId=" + userId);
        // console.log("答复" + response.data);
        if (response.data.code === 200) {
          this.exams = response.data.data.map((dto) => ({
            examId: dto.exam.examId,
            subject: dto.exam.examName,
            examDate: dto.exam.examDate,
            expanded: false,
            examDetails: [],
          }));
        }
      } catch (error) {
        // console.error("获取考试列表失败：", error);
        // this.$message.error("获取考试列表失败");
      }
    },
    async fetchExamDetails(examId, exam) {
      try {
        const response = await axios.get(
          "/teacher/getExamDetails?examId=" + examId,
        );
        if (response.data.code === 200) {
          exam.examDetails = response.data.data.map((detail) => ({
            id: detail.id,
            name: detail.name,
            score: detail.score,
          })); // 确保这里映射的是 detail 对象中的属性
          console.log(exam.examDetails);
        }
      } catch (error) {
        console.error(`获取考试ID为 ${examId} 的考试详情失败`, error);
      }
    },
    toggleExpand(exam) {
      exam.expanded = !exam.expanded;
      (this.drawerVisible = true),
        (this.selectedExam = exam),
        console.log(exam.expanded);
      if (
        exam.expanded &&
        (!exam.examDetails || exam.examDetails.length === 0)
      ) {
        this.fetchExamDetails(exam.examId, exam);
      }
    },
    // 获取学生列表
    async fetchStudents() {
      try {
        const response = await axios.get("/teacher/getAllStudents");
        if (response.data.code === 200) {
          this.students = response.data.data;
        }
      } catch (error) {
        // console.error("获取学生列表失败", error);
        // this.$message.error("获取学生列表失败");
      }
    },

    //查看考试详情
    // async viewExamDetail(examId) {
    //   console.log("viewExamDetail", examId);
    //   try {
    //     const response = await axios.post("/teacher/getExamDetail", {
    //       id: examId,
    //     });
    //     if (response.data.code === 200) {
    //       this.selectedExam = response.data.data;
    //       this.selectedExam.subject = this.subjects.find(
    //         (subject) => subject.id === this.selectedExam.subjectId,
    //       )?.name;
    //       this.currentPage = "exam-detail";
    //       this.breadcrumb.push(this.selectedExam.name);
    //     }
    //   } catch (error) {
    //     // console.error("获取考试详情失败:", error);
    //     // this.$message.error("获取考试详情失败！");
    //   }
    // },
    //修改密码
    async updatePassword() {
      console.log("updatePassword:", this.passwordForm);
      try {
        const response = await axios.put(
          "/teacher/updatePassword",
          this.passwordForm,
        );
        if (response.data.code === 200) {
          this.$message.success("修改密码成功！");
        } else {
          this.$message.error("修改密码失败");
        }
      } catch (error) {
        // console.error("修改密码失败", error);
        // this.$message.error("修改密码失败");
      }
    },
    // 注销账号
    async deleteAccount() {
      console.log("deleteAccount:", this.deleteAccountForm);
      try {
        const response = await axios.delete("/teacher/deleteAccount", {
          data: this.deleteAccountForm,
        });
        if (response.data.code === 200) {
          this.$message.success("注销账号成功！");
        } else {
          this.$message.error("注销账号失败");
        }
      } catch (error) {
        console.error("注销账号失败", error);
        this.$message.error("注销账号失败");
      }
    },

    handleMenuSelect(index) {
      this.activeIndex = index;
      if (index === "home") {
        this.currentPage = "home";
        this.breadcrumb = ["主页"];
      } else if (index === "create-exam") {
        this.currentPage = "create-exam";
        this.breadcrumb = ["主页", "创建考试"];
        this.newExam = {
          subjectId: "",
          startTime: null,
        };
      } else if (index === "view-exams") {
        this.currentPage = "view-exams";
        this.breadcrumb = ["主页", "查看考试"];
      } else if (index === "view-students") {
        this.currentPage = "view-students";
        this.breadcrumb = ["主页", "查看学生"];
      } else if (index === "account-management") {
        this.currentPage = "account-management";
        this.breadcrumb = ["主页", "账号信息管理"];
      }
    },
  },
};
</script>
<style scoped>
/* 教师容器样式 */
.teacher-container {
  min-height: 100vh;
  padding: 20px;
  background-image: url("@/assets/image.png");
  /* 替换为实际背景图 */
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
  overflow-y: auto;
  /* 确保侧边栏内容多时可以滚动 */
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
  overflow-y: auto;
  /* 确保侧边栏内容多时可以滚动 */
  scrollbar-width: none;
  /* 隐藏滚动条 */
  -ms-overflow-style: none;
  /* IE and Edge 隐藏滚动条 */
}

/* 隐藏菜单滚动条 */
:deep(.el-menu::-webkit-scrollbar) {
  display: none;
  /* 隐藏滚动条 */
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

/* 考试详情样式 */
.exam-detail {
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 10px;
}

/* 样式增强 */
.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.exam-table {
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-column {
  padding: 12px;
  text-align: center;
}

.expand-button {
  background-color: #409eff;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.expand-button:hover {
  background-color: #66b1ff;
}

.exam-collapse-item {
  background-color: #f5f7fa;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
}

.exam-collapse-item div {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.exam-collapse-item strong {
  color: #333;
}

/* 美化表格边框和头部 */
.el-table th {
  background-color: #f4f6f9;
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.el-table .el-table__body td {
  font-size: 14px;
  color: #666;
}

.el-table .el-table__body tr:hover {
  background-color: #f0f9ff;
}

.el-collapse {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
