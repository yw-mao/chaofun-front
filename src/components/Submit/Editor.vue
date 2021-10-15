<template>
  <div class="editor-wrapper">
    <editor
      v-loading="loading"
      :initialValue="content"
      initialEditType="wysiwyg"
      :options="editorOptions"
      @change="onEditorChange"
      height="auto"
      ref="editor"
    />
    <el-button class="switch-mode" @click="switchMode" round>
      {{editType === 'wysiwyg' ? 'Markdown模式' : '切换传统编辑器'}}
    </el-button>
  </div>
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import { Editor } from '@toast-ui/vue-editor';

export default {
  components: {
    editor: Editor
  },
  data() {
    return {
      content: "",
      loading: false,
      editType: 'wysiwyg',
      editorOptions: {
        language: 'zh-CN',
        hideModeSwitch: true,
        toolbarItems: [
          ['bold', 'italic', 'link', 'strike', 'code'],
          ['heading', 'ul', 'ol', 'quote', 'codeblock'],
          ['table', 'image'],
        ],
        hooks: {
          addImageBlobHook: (blob, callback) => {
            this.upload(blob).then(url => callback(url, blob.name));
          }
        },
        placeholder: '写点什么吧~',
        minHeight: '300px',
      },
    };
  },
  methods: {
    onEditorChange() {
      this.content = this.$refs.editor.invoke('setHtml');
    },
    set() {

    },
    get() {
      return this.$refs.editor.invoke('getHTML');
    },
    switchMode() {
      this.editType = this.editType === 'wysiwyg' ? 'markdown' : 'wysiwyg';
      this.$refs.editor.invoke('changeMode', this.editType);
    },
    // 图片上传
    async upload(file) {
      this.loading = true;
      const formdata = new FormData();
      formdata.append('file', file);
      formdata.append('fileName', file.name);
      const result = await uploadImage(formdata);
      this.loading = false;
      if (!result.success) {
        this.$message.error(res.errorMessage);
        return;
      }
      return `${this.imgOrigin}${result.data}`;
    },
  }
}
</script>

<style lang="scss">
.editor-wrapper {
  position: relative;
  .switch-mode {
    position: absolute;
    right: 5px;
    top: 10px;
    border: none;
    color: #ff2d20;
    background-color: transparent;
    font-weight: bold;
    padding: 4px 8px;
    line-height: 16px;
    &:hover {
      background-color: rgba(28, 28, 28, 0.08);
    }
  }
}
.toastui-editor-defaultUI {
  .toastui-editor-toolbar {
    .toastui-editor-defaultUI-toolbar {
      padding: 0;
    }
  }
  .ProseMirror {
    padding: 8px 16px;
  }
}
</style>