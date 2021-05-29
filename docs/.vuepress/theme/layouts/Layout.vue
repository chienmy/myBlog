<template>
  <div class="layout-body">
    <Content class="markdown-body"></Content>
    <footer v-if="isShown">
      <span>[q]: Exit</span><br/>
      <span :style="'color:' + (preLink.length > 0 ? '#EEE' : '#E00')">[p]: Pre Article</span><br/>
      <span :style="'color:' + (nextLink.length > 0 ? '#EEE' : '#E00')">[n]: Next Article</span><br/>
      <input type="text" id="input-footer" v-model="inputText">
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { MyPage } from "../type";

@Component
export default class Layout extends Vue {
  name: string = "Layout"
  isShown: boolean = false
  preLink: string = ""
  nextLink: string = ""
  inputText: string = ""

  mounted() {
    this.preLink = (<MyPage>this.$page).prePage;
    this.nextLink = (<MyPage>this.$page).nextPage;
    window.onkeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ":":
          this.isShown = true;
          this.$nextTick(() => {
            (<HTMLInputElement>document.getElementById("input-footer")).focus();
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
              this.$router.push({name: this.preLink});
              this.isShown = false;
              this.inputText = "";
            } else {
              this.inputText = ":";
            }
          } else if (command == ":n") {
            if (this.nextLink.length > 0) {
              this.$router.push({name: this.nextLink});
              this.isShown = false;
              this.inputText = "";
            } else {
              this.inputText = ":";
            }
          }
      }
    }
  }
}
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

#input-footer {
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
