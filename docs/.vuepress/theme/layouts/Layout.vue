<template>
  <div class="layout-body">
    <body>
      <Content class="markdown-body"></Content>
    </body>
    <footer v-if="isShown">
      <span>[q]: Exit</span><br/>
      <span :style="'color:' + (preLink.length > 0 ? '#EEE' : '#E00')">[p]: Pre Article</span><br/>
      <span :style="'color:' + (nextLink.length > 0 ? '#EEE' : '#E00')">[n]: Next Article</span><br/>
      <input type="text" id="input-text" v-model="inputText">
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Layout",
  data() {
    return {
      isShown: false,
      preLink: "",
      nextLink: "",
      inputText: "",
    }
  },
  methods: {
  },
  created() {
    for (const page of this.$site.pages) {
      if (page.key == this.$page.nextPage) {
        this.nextLink = page.path;
      }
      if (page.key == this.$page.prePage) {
        this.preLink = page.path;
      }
    }
  },
  mounted() {
    window.onkeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ":":
          this.isShown = true;
          this.$nextTick(() => {
            (<HTMLInputElement>document.getElementById("input-text")).focus();
            // this.inputText = ":";
          })
          break;
        case "Escape":
          this.isShown = false;
          this.inputText = "";
          break;
        case "Enter":
          const command = this.inputText;
          if (command == ":q") {
            this.$router.push("/");
          } else if (command == ":p") {
            if (this.preLink.length > 0) {
              this.$router.push(this.preLink);
            } else {
              this.inputText = ":";
            }
          } else if (command == ":n") {
            if (this.nextLink.length > 0) {
              this.$router.push(this.nextLink);
            } else {
              this.inputText = ":";
            }
          }
      }
    }
  }
});
</script>
<style>
.layout-body {
  font-family: Georgia, Palatino, serif;
  color: #EEE;
  font-weight: 600;
  font-size: 17px;
  line-height: 25px;
  background-color: #131416;
  max-width: 960px;
  padding: 20px 30px 40px 30px;
  margin: 0 auto;
}

footer {
  font-family: Monaco, Cutive Mono, Courier New, Consolas, monospace;
  font-size: 14px;
  line-height: 17px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  z-index: 10;
}

#input-text {
  display: inline-block;
  background-color: transparent;
  border: none;
  outline: 0;
  box-sizing: border-box;
  font-size: 15px;
  font-family: Monaco, Cutive Mono, Courier New, Consolas, monospace;
  font-weight: 600;
  color: #fff;
  width: 300px;
  padding-block-end: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>
