<template>
  <div id="app">
    <template v-if="!isCustomerView">
      <nav class="acrylic-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </nav>
      <div class="content">
        <router-view />
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    isCustomerView() {
      return this.$route.path === "/CustomerView";
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-image: url("@/assets/image.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #fff;
}

.acrylic-nav {
  position: sticky;
  top: 20px;
  /* 导航栏距离顶部的间距 */
  margin: 0 auto;
  /* 居中对齐 */
  width: fit-content;
  /* 自动调整宽度以适应内容 */
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  /* 半透明背景 */
  backdrop-filter: blur(10px);
  /* 模糊效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* 阴影提升层次感 */
  border-radius: 12px;
  /* 圆角 */
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* 边框增强视觉效果 */
  z-index: 10;
}

.acrylic-nav a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

/* 鼠标悬停动效 */
.acrylic-nav a:hover {
  color: #42b983;
  /* 颜色变化 */
  transform: scale(1.1);
  /* 放大文字 */
}

/* 下划线动画 */
.acrylic-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.acrylic-nav a:hover::after {
  width: 100%;
}

.acrylic-nav a.router-link-exact-active {
  color: #42b983;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
