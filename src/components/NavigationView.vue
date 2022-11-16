<template>
  <header class="container add-city">
    <nav>
      <span>Add City</span>
      <div class="right">
        <i class="far fa-edit"></i>
        <i @click="reloadApp" class="fas fa-sync"></i>
        <i @click="addCity" class="fas fa-plus"></i>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "NavigationView",
  methods: {
    addCity() {
      this.$emit('add-city')
    },
    reloadApp() {
      location.reload()
    }
  },
};
</script>

<style lang="scss" scoped>
.add-city {
  background-color: #313640;
}
header {
  z-index: 99;
  position: fixed;
  max-width: 1024px;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  nav {
    display: flex;
    color: #fff;
    padding: 30px 0;
    justify-content: space-between;
  }
  .right {
    i {
      font-size: 20px;
    }
    i:nth-child(2),
    i:nth-child(3) {
      margin-left: 16px;
    }
  }
  span {
    font-weight: 600;
  }
}
</style>