<template>
  <div>
    <div v-for="s in screenText" :key="s" style="white-space: pre;line-height: 20px">
      <span v-html="s"></span>
      <br/>
    </div>
    <span class="prefix" v-html="prefix"></span>
    <span> </span>
    <input type="text" id="input-text" style="width: 919px;">
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Terminal } from "../components";

export default Vue.extend({
  name: "HomePage",
  data() {
    return {
      terminal: undefined,
      // 需要逐行显示的span标签
      screenText: [],
      // 输入行显示的前缀，之后会把其中的变量拆分出来
      prefix: "",
    }
  },
  computed: {

  },
  methods: {
  },
  created() {
    this.terminal = new Terminal(this.$site);
    this.screenText = this.terminal.outputText();
    this.prefix = this.terminal.outputPrefix();
  },
  mounted() {
    document.getElementById("input-text").onkeydown = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        // 输入命令
        const command = (<HTMLInputElement>document.getElementById("input-text")).value;
        this.terminal.inputCommand(command);
        // 更新屏幕内容
        this.screenText = this.terminal.outputText();
        this.prefix = this.terminal.outputPrefix();
        // 清空输入行
        (<HTMLInputElement>document.getElementById("input-text")).value = "";
      }
    };
    console.log(this.$site.pages)
  }
});
</script>

<style>
body {
  font-family: Monaco, Cutive Mono, Courier New, Consolas, monospace;
  font-weight: 600;
  font-size: 17px;
  line-height: 25px;
  color: #fff;
  background-color: #131416;
  padding: 5px;
  margin: 0;
}

#input-text {
  display: inline-block;
  background-color: transparent;
  border: none;
  outline: 0;
  box-sizing: border-box;
  font-size: 17px;
  font-family: Monaco, Cutive Mono, Courier New, Consolas, monospace;
  font-weight: 600;
  color: #fff;
  width: 300px;
  padding-block-end: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>

