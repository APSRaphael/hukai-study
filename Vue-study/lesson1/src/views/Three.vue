<template>
  <div class="three">
    <h1>This is an Three page</h1>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data: () => {
    return {
      aaa: 'jkjk',
    };
  },

};
</script>
