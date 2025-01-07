# Tutor 项目接口文档

## 概述

该项目是一个基于 Spring Boot 的教育管理系统，提供了用户管理、学生管理、考试管理等功能。本文档详细描述了各个接口的功能、请求方法、请求路径、请求参数和响应格式。

## 目录

1. 用户管理
    - 添加用户
    - 用户登录
2. 学生管理
    - 添加学生
    - 添加学生科目
    - 删除学生科目
    - 根据客户ID获取学生
3. 考试管理
    - 获取考试成绩
4. 科目管理
    - 获取所有科目

## 用户管理

### 添加用户

- **请求方法**: POST
- **请求路径**: `/account/add`
- **请求参数**:
    - `name` (String): 用户名
    - `password` (String): 密码
    - `email` (String): 邮箱
    - `userType` (String): 用户类型 (customer, teacher, admin)
- **请求示例**:
    ```json
    {
        "name": "John Doe",
        "password": "password123",
        "email": "john.doe@example.com",
        "userType": "customer"
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "id": 1,
            "name": "John Doe",
            "password": "password123",
            "userType": "customer"
        }
    }
    ```

### 用户登录

- **请求方法**: POST
- **请求路径**: `/account/login`
- **请求参数**:
    - `id` (int): 用户ID
    - `password` (String): 密码
- **请求示例**:
    ```json
    {
        "id": 1,
        "password": "password123"
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "id": 1,
            "name": "John Doe",
            "password": "password123",
            "userType": "customer"
        }
    }
    ```

## 学生管理

### 添加学生

- **请求方法**: POST
- **请求路径**: `/customer/addStudent`
- **请求参数**:
    - `name` (String): 学生姓名
    - `age` (int): 学生年龄
    - `subjects` (List<String>): 学生科目
    - `grade` (String): 学生年级
    - `customerId` (int): 客户ID
- **请求示例**:
    ```json
    {
        "name": "Jane Doe",
        "age": 16,
        "subjects": ["Math", "Science"],
        "grade": "高一",
        "customerId": 1
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "id": 1,
            "name": "Jane Doe",
            "age": 16,
            "grade": "高一",
            "customerId": 1
        }
    }
    ```

### 添加学生科目

- **请求方法**: PUT
- **请求路径**: `/customer/addSubject`
- **请求参数**:
    - `subjects` (List<String>): 科目列表
    - `stuId` (int): 学生ID
- **请求示例**:
    ```json
    {
        "subjects": ["Math", "Science"],
        "stuId": 1
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": ["Math", "Science"]
    }
    ```

### 删除学生科目

- **请求方法**: PUT
- **请求路径**: `/customer/deleteSubject`
- **请求参数**:
    - `subjects` (List<String>): 科目列表
    - `stuId` (int): 学生ID
- **请求示例**:
    ```json
    {
        "subjects": ["Math"],
        "stuId": 1
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": ["Science"]
    }
    ```

### 根据客户ID获取学生

- **请求方法**: GET
- **请求路径**: `/customer/getStudentsByCustomerId`
- **请求参数**:
    - `id` (int): 客户ID
- **请求示例**:
    ```json
    {
        "id": 1
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": [
            {
                "id": 1,
                "name": "Jane Doe",
                "age": 16,
                "grade": "高一",
                "customerId": 1
            }
        ]
    }
    ```

## 考试管理

### 获取考试成绩

- **请求方法**: GET
- **请求路径**: `/customer/getCharts`
- **请求参数**:
    - `studentId` (int): 学生ID
    - `subjectName` (String): 科目名称
- **请求示例**:
    ```json
    {
        "studentId": 1,
        "subjectName": "Math"
    }
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": [
            [95.0, 88.0, 92.0],
            [85.0, 80.0, 90.0]
        ]
    }
    ```

## 科目管理

### 获取所有科目

- **请求方法**: GET
- **请求路径**: `/customer/getAllSubject`
- **请求参数**: 无
- **请求示例**:
    ```json
    {}
    ```
- **响应示例**:
    ```json
    {
        "code": 200,
        "message": "success",
        "data": ["Math", "Science", "English"]
    }
    ```
