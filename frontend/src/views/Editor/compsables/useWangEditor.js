import { onBeforeUnmount, shallowRef, ref } from 'vue';

//wangeditor的模板部分
export const useWangEditor = ({useApi}) => {
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()

  // 内容 HTML
  const valueHtml = ref(null)


  const toolbarConfig = {

  };
  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: "/api/upload",
        async customUpload(file, insertFn) {
          const formData = new FormData();
          formData.append('file', file);
          const ans = await useApi("uploadArticleCover", formData);
          insertFn(ans.fileUrl);
        }
      }
    }
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }

  return {
    editorRef,
    valueHtml,
    toolbarConfig,
    editorConfig,
    handleCreated
  }
};