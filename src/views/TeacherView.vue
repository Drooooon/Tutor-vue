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
      </el-menu>
    </el-aside>
  </el-container>
</template>
