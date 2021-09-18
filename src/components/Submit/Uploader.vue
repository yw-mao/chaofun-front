<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover && !moving
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <UploadList
      v-model="files"
      :disabled="disabled"
      :handleRemove="handleRemove"
      :handleMove="onMove"
      :handlePreview="onPreview"
      :handleClick="handleClick"
      :listType="listType"
      v-if="files.length > 0"
    >
    </UploadList>
    <div class="image-uploader-free" @click="handleClick" v-else>
      <p>
        将文件拖到此处，或 <el-button round>点击上传</el-button>
      </p>
    </div>
    <input class="el-upload__input" type="file" ref="input" :name="name" @change="handleChange" :multiple="multiple" :accept="accept" />
  </div>
</template>

<script>
import ajax from 'element-ui/packages/upload/src/ajax';
import UploadList from './UploadList';
import EXIF from 'exif-js';

function noop() {}

export default {
  components: {
    UploadList,
  },
  model: {
    prop: 'fileList',
  },
  mounted() {
    // 拖拽更改Hover样式
    document.addEventListener('dragover', () => {
      this.isDrag = true;
    });
    document.addEventListener('dragleave', () => {
      this.isDrag = false;
    });
  },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {};
      }
    },
    data: Object,
    multiple: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      default: 'file'
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'picture' // text,picture,picture-card
    },
    httpRequest: {
      type: Function,
      default: ajax
    },
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    }
  },
  data() {
    return {
      dragover: false,
      moving: false,
      files: [],
      fileList: [],
      draging: false,
      isDrag: false,
      tempIndex: 1,
      reqs: {},
    };
  },
  watch: {
    fileList: {
      immediate: true,
      handler(fileList) {
        this.files = fileList.map(item => {
          item.uid = item.uid || (Date.now() + this.tempIndex++);
          item.status = item.status || 'success';
          return item;
        });
      }
    }
  },
  methods: {
    // === Drag ===
    onDragover() {
      if (!this.disabled) {
        this.dragover = true;
      }
    },
    onDrop(e) {
      this.dragover = false;
      if (!this.accept) {
        this.uploadFiles(e.dataTransfer.files);
        return;
      }
    },
    onMove(movingStatus) {
      if (!this.disabled) {
        this.moving = movingStatus;
      }
    },

    // === Upload ===
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }
      if (postFiles.length === 0) { return; }

      // 检测图片
      for (let index = 0; index < postFiles.length; index++) {
        const rawFile = postFiles[index];
        const data = EXIF.getData(rawFile, function() {
          const Model = EXIF.getAllTags(this);
          console.log(Model);
        });
        console.log(data);
      }

      postFiles.forEach(rawFile => {
        this.handleStart(rawFile);
        if (this.autoUpload) this.upload(rawFile);
      });
    },
    upload(rawFile) {
      this.$refs.input.value = null;
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }
      const before = this.beforeUpload(rawFile);
      if (before && before.then) {
        before.then(processedFile => {
          const fileType = Object.prototype.toString.call(processedFile);
          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], rawFile.name, {
                type: rawFile.type
              });
            }
            for (const p in rawFile) {
              if (rawFile.hasOwnProperty(p)) {
                processedFile[p] = rawFile[p];
              }
            }
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) {
        this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
    },
    post(rawFile) {
      const { uid, name } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: {
          ...this.data,
          fileName: name,
        },
        filename: this.name,
        action: this.action,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          this.handleSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },

    // === Main ===
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++;
      let file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      };
      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error('[Element Error][Upload]', err);
          return;
        }
      }
      this.files.push(file);
      this.onChange(file, this.files);
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile);
      this.onProgress(ev, file, this.files);
      file.status = 'uploading';
      file.percentage = ev.percent || 0;
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile);
      if (file) {
        file.status = 'success';
        file.response = res;
        console.log(file);
        this.onSuccess(res, file, this.files);
        this.onChange(file, this.files);
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile);
      const fileList = this.files;
      file.status = 'fail';
      fileList.splice(fileList.indexOf(file), 1);
      this.onError(err, file, this.files);
      this.onChange(file, this.files);
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw);
      }
      let doRemove = () => {
        console.log(file);
        this.abort(file);
        let fileList = this.files;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      };
      if (!this.beforeRemove) {
        doRemove();
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.files);
        if (before && before.then) {
          before.then(() => {
            doRemove();
          }, noop);
        } else if (before !== false) {
          doRemove();
        }
      }
    },
    handleClick() {
      console.log(1);
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown(e) {
      if (e.target !== e.currentTarget) return;
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    },
    getFile(rawFile) {
      let fileList = this.files;
      let target;
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null;
        return !target;
      });
      return target;
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    clearFiles() {
      this.uploadFiles = [];
    },
  },
}
</script>

<style lang="scss" scoped>
.el-upload-dragger {
  width: 100%;
  height: auto;
  cursor: auto;
  &:hover {
    border-color: #d9d9d9;
  }
}
.image-uploader-free {
  min-height: 280px;
  display: flex;
  justify-content: center;
  flex-flow: column nowrap;
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
}
</style>