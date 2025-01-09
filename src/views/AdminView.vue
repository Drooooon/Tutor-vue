<template>
  <el-container class="admin-container">
    <el-aside width="200px" class="aside-panel">
      <el-menu :default-active="activeMenu" @select="handleMenuSelect">
        <el-menu-item index="home"
          ><template #title
            ><i class="el-icon-check"></i><span>主页</span></template
          ></el-menu-item
        >
        <el-menu-item index="teacher-review"
          ><template #title
            ><i class="el-icon-check"></i><span>教师审核</span></template
          ></el-menu-item
        >
        <el-menu-item index="student-teacher-allocation"
          ><template #title
            ><i class="el-icon-user"></i><span>学生教师分配</span></template
          ></el-menu-item
        >
        <el-menu-item index="subject-price-modification"
          ><template #title
            ><i class="el-icon-edit"></i><span>修改科目价格</span></template
          ></el-menu-item
        >
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header-panel"><h2>管理系统</h2></el-header>
      <el-main class="main-content">
        <div v-if="currentPage === 'teacher-review'">
          <h3>教师审核</h3>
          <el-table
            :data="teachers"
            border
            style="
              width: 100%;
              backdrop-filter: blur(10px);
              background: rgba(255, 255, 255, 0.3);
              border-radius: 12px;
            "
          >
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column
              prop="name"
              label="名字"
              width="150"
            ></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="120"
            ></el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button
                  type="success"
                  size="small"
                  @click="processTeacher(scope.row.id, 'APPROVED')"
                  >同意</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="processTeacher(scope.row.id, 'REJECTED')"
                  >拒绝</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page="page"
            :total="totalElements"
            @current-change="fetchTeachers"
            class="custom-pagination"
          />
        </div>
        <div v-if="currentPage === 'student-teacher-allocation'">
          <h3>学生教师分配</h3>
          <el-table
            :data="students"
            border
            style="
              width: 100%;
              backdrop-filter: blur(10px);
              background: rgba(255, 255, 255, 0.3);
              border-radius: 12px;
            "
          >
            <el-table-column
              prop="studentId"
              label="学号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="150"
            ></el-table-column>
            <el-table-column prop="grade" label="年级"></el-table-column>
            <el-table-column prop="subject" label="报名科目"></el-table-column>
            <el-table-column label="老师" width="250">
              <template #default="scope">
                <el-select
                  v-model="scope.row.selectedTeacher"
                  placeholder="请选择老师"
                  @focus="fetchTeachersForSubject(scope.row)"
                >
                  <el-option
                    v-for="item in scope.row.availableTeachers"
                    :key="item.teacherId"
                    :label="item.teacherName"
                    :value="item.teacherId"
                  ></el-option>
                </el-select>
                <el-button
                  type="primary"
                  size="small"
                  @click="assignTeacher(scope.row)"
                  >确认分配</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page="studentPage"
            :total="totalStudentElements"
            @current-change="fetchStudents"
            class="custom-pagination"
          />
        </div>
        <div v-if="currentPage === 'subject-price-modification'">
          <h3>修改科目价格</h3>
          <el-table
            :data="subjects"
            border
            style="
              width: 100%;
              backdrop-filter: blur(10px);
              background: rgba(255, 255, 255, 0.3);
              border-radius: 12px;
            "
          >
            <el-table-column
              prop="subjectId"
              label="科目ID"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="subjectName"
              label="科目名称"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="price"
              label="当前价格"
              width="250"
            ></el-table-column>
            <el-table-column label="价格修改" min-width="250">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.newPrice"
                  :min="0"
                  :precision="2"
                  :step="100"
                  style="width: 150px"
                ></el-input-number>
                <el-button
                  type="primary"
                  size="small"
                  @click="updatePrice(scope.row, scope.row.newPrice)"
                  style="margin-left: 10px"
                  >确定</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="subjectPageSize"
            :current-page="subjectPage"
            :total="totalSubjectElements"
            @current-change="fetchSubjects"
            class="custom-pagination"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "../api/axios";

export default {
  data() {
    return {
      activeMenu: "home",
      currentPage: "home",
      teachers: [],
      students: [],
      subjects: [],
      page: 1,
      studentPage: 1,
      subjectPage: 1,
      pageSize: 6,
      subjectPageSize: 5,
      totalElements: 0,
      totalStudentElements: 0,
      totalSubjectElements: 0,
    };
  },
  methods: {
    handleMenuSelect(index) {
      this.currentPage = index;
      if (index === "teacher-review") {
        this.fetchTeachers(this.page);
      } else if (index === "student-teacher-allocation") {
        this.fetchStudents(this.studentPage);
      } else if (index === "subject-price-modification") {
        this.fetchSubjects(1);
      }
    },
    async fetchTeachers(page) {
      try {
        const response = await axios.post("/admin/getTeachersByStatus", {
          status: "PENDING",
          page,
          size: this.pageSize,
        });
        const { content, totalElements } = response.data.data;
        this.teachers = content;
        this.totalElements = totalElements;
        this.page = page;
      } catch (error) {
        console.error("获取教师数据失败", error);
      }
    },
    async processTeacher(id, status) {
      try {
        await axios.put("/admin/processTeacher", { id, status });
        this.fetchTeachers(this.page);
      } catch (error) {
        console.error("处理教师审核失败", error);
      }
    },
    async fetchStudents(page) {
      try {
        const response = await axios.post("/admin/getStudents", {
          page,
          size: this.pageSize,
        });
        const { content, totalElements } = response.data.data;
        this.students = content.map((student) => ({
          ...student,
          availableTeachers: [],
          selectedTeacher: null,
        }));
        this.totalStudentElements = totalElements;
        this.studentPage = page;
      } catch (error) {
        console.error("获取学生数据失败", error);
      }
    },
    async fetchSubjects(page) {
      try {
        const response = await axios.post("/admin/getSubjectInfo", {
          page,
          size: this.subjectPageSize,
        });
        const { content, totalElements } = response.data.data;
        this.subjects = content;
        this.totalSubjectElements = totalElements;
        this.subjectPage = page;
      } catch (error) {
        this.$message.error("获取科目数据失败");
      }
    },
    async updatePrice(subject, newPrice) {
      try {
        const response = await axios.post("/admin/updatePrice", {
          id: subject.subjectId,
          price: newPrice,
        });
        this.$message.success(response.data.data);
        this.fetchSubjects(this.subjectPage);
      } catch (error) {
        this.$message.error("更新价格失败");
      }
    },
    async fetchTeachersForSubject(student) {
      try {
        const response = await axios.post(
          "/admin/getTeacherBySubjectAndGrade",
          { subject: student.subject, grade: student.grade },
        );
        student.availableTeachers = response.data.data;
      } catch (error) {
        console.error("获取老师列表失败", error);
      }
    },
    async assignTeacher(student) {
      if (!student.selectedTeacher) {
        this.$message.error("请选择老师");
        return;
      }
      try {
        await axios.put("/admin/assignTeacher", {
          teacherId: student.selectedTeacher,
          studentId: student.studentId,
          subject: student.subject,
        });
        this.$message.success("分配成功");
        this.fetchStudents(this.studentPage);
      } catch (error) {
        console.error("分配老师失败", error);
        this.$message.error("分配失败");
      }
    },
  },
  mounted() {
    this.currentPage = "home";
    this.fetchTeachers(this.page);
  },
};
</script>

<style lang="scss" scoped>
/* 管理系统容器样式 */
.admin-container {
  min-height: 100vh;
  padding: 20px;
  background-image: url("@/assets/image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  gap: 20px; /* 侧边栏和主区域间距 */
}

/* 侧边栏样式 */
.aside-panel {
  width: 200px;
  border-radius: 12px;
  margin-right: 20px;
  background: rgba(255, 255, 255, 0.1); /* 透明效果 */
  backdrop-filter: blur(20px); /* 模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
  overflow-y: auto; /* 滚动条处理 */
}

/* 隐藏滚动条 */
.el-aside::-webkit-scrollbar {
  display: none;
}

/* 菜单样式 */
:deep(.el-menu) {
  background: transparent;
  border-right: none;
  overflow-y: auto; /* 支持滚动 */
}

/* 菜单项和子菜单标题悬停样式 */
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.2);
}

/* 菜单项文字颜色及活动状态样式 */
:deep(.el-menu-item) {
  color: #fff; /* 白色文字 */
}

:deep(.el-menu-item.is-active) {
  background: #42b983; /* 激活项绿色背景 */
  color: #fff; /* 白色文字 */
  font-weight: bold; /* 加粗 */
}

/* 子菜单标题样式 */
:deep(.el-sub-menu__title) {
  color: #fff; /* 白色文字 */
}

/* 隐藏菜单滚动条 */
:deep(.el-menu::-webkit-scrollbar) {
  display: none;
}

/* 上边栏样式 */
.header-panel {
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3); /* 透明背景 */
  backdrop-filter: blur(10px); /* 模糊效果 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px; /* 增加上边栏和主区域的距离 */
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 确保内容可滚动 */
}

/* 隐藏主内容滚动条 */
.main-content::-webkit-scrollbar {
  display: none;
}

/* 让标题居中显示 */
h3 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
}

/* 表格整体透明化样式 */
::v-deep .el-table,
::v-deep .el-table__expanded-cell {
  background-color: transparent;
}

::v-deep .el-table tr {
  background-color: transparent !important;
}

::v-deep .el-table__body td,
::v-deep .el-table__header th,
::v-deep .el-table .cell {
  background-color: transparent;
}

/* 去除表格底部白线 */
::v-deep .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}

/* 表头样式 */
::v-deep .el-table__header th {
  font-weight: bold;
  font-size: 16px;
  color: #000; /* 黑色文字 */
  text-align: center;
}

/* 表格内容单元格文字样式 */
::v-deep .el-table__body td {
  color: #333; /* 深灰色文字 */
  text-align: center;
}

/* 鼠标悬停高亮行 */
::v-deep .el-table tr:hover {
  background: rgba(255, 255, 255, 0.1); /* 微亮的背景 */
}

/* 分页样式 */
.el-pagination {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.3); /* 透明背景 */
  border-radius: 12px; /* 圆角 */
  margin-top: 20px; /* 增加分页项和表格之间的距离 */
}

/* 自定义滚动条 */
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5); /* 滚动条滑块 */
  border-radius: 4px;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent; /* 滚动条轨道 */
}

/* 其他辅助样式 */
h3 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
}

.page-jump {
  margin-top: 20px; /* 离表格更远 */
}

.page-jump:hover {
  color: #42b983; /* 悬浮的绿色 */
}

.teacher-audit {
  color: #000; /* 教师审核改为黑色字体 */
}

/* 鼠标悬停高亮行 - 修改为绿色 */
::v-deep .el-table tr:hover > td {
  background-color: rgba(76, 175, 80, 0.1) !important;
}

/* 分页样式 */
.custom-pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

::v-deep .custom-pagination .el-pager li,
::v-deep .custom-pagination .el-pagination__jump {
  margin: 0 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

::v-deep .custom-pagination .el-pager li.active {
  background-color: #42b983;
  color: white;
}

::v-deep .custom-pagination button {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 5px;
}
</style>
