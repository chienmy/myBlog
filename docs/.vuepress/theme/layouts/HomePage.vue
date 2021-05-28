<template>
  <div>
    <div v-for="s in screenText" :key="s" style="white-space: pre;line-height: 20px">
      <span v-html="s"></span>
      <br/>
    </div>
    <span class="prefix" v-html="prefix"></span>
    <span> </span>
    <input type="text" id="input-text" v-model="inputText" style="width: 919px;">
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
      // 输入文本框文本
      inputText: ""
    }
  },
  computed: {

  },
  methods: {
  },
  created() {
    this.terminal = new Terminal(this.$site, this.$router);
    this.screenText = this.terminal.output;
    this.prefix = this.terminal.prefix;
  },
  mounted() {
    document.getElementById("input-text").onkeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // 输入命令
        this.terminal.inputCommand(this.inputText);
        // 更新屏幕内容
        this.screenText = this.terminal.output;
        this.prefix = this.terminal.prefix;
        // 清空输入行
        this.inputText = "";
      } else if (event.key == "ArrowUp") {
        this.inputText = this.terminal.getPreCommand(this.inputText);
      } else if (event.key == "ArrowDown") {
        this.inputText = this.terminal.getNextCommand(this.inputText);
      }
      // this.$forceUpdate();
    };
    console.log(this.$site.pages);
    document.getElementById("input-text").focus();
  }
});
</script>

<style>
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

