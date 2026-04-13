import { useTemplateRef, ref, computed, onBeforeMount, h } from "vue";
import { ElNotification, ElText } from "element-plus";
import { router } from "@/router";

//处理element-plus 表单的相关逻辑
export const useEditForm = ({useApi,  valueHtml, showSubmitDialog}) => {
  const uploadArticleCoverRef = useTemplateRef("uploadArticleCover");
  const classifyFormRef = useTemplateRef("classifyForm");
  //表单数据
  const submitForm = ref({
    title: "",
    cover: [],
    column: "",
    summary: ""
  });
  const columns = ref([]);

  const articleCoverUrl = computed(() => {
    if (!submitForm.value.cover || submitForm.value.cover.length <= 0) {
      return false;
    }

    let coverURL = URL.createObjectURL(submitForm.value.cover[0]?.raw);
    return coverURL;
  });
  
  const handleExceed = (rawFile) => {
    uploadArticleCoverRef.value.clearFiles();
    uploadArticleCoverRef.value.handleStart(rawFile[0]);
  };

  const btnAgency = async (type) => {
    if (type === 'close') {
      showSubmitDialog.value = false;
      return false;
    }

    

    const coverFormdata = new FormData();

    coverFormdata.append("file", submitForm.value.cover[0].raw);
    let coverURL = "";
    try {
      const ans = await useApi('uploadArticleCover', coverFormdata);
      coverURL = ans.fileUrl;
    } catch (err) {
      console.log(err, 'error');
      ElNotification.error({
        title: '上传封面失败!',
        duration: 2000,
        showClose: false,
        message: '请检查封面是否符合要求'
      });
      return false;
    }
    try {
      await useApi('articleAdd', {
        title: submitForm.value.title,
        cover: coverURL,
        content: valueHtml.value,
        column: submitForm.value.column,
        summary: submitForm.value.summary
      });
      ElNotification.success({
        title: '发布文章成功!',
        duration: 2000,
        showClose: false,
        message: '文章发布成功'
      });
      showSubmitDialog.value = false;
      uploadArticleCoverRef.value.clearFiles();
      router.push("/")
    } catch (err) {
      console.log(err, 'err');
      ElNotification.error({
        title: '发布文章失败!',
        duration: 2000,
        showClose: false,
        message: '请检查文章内容是否有误'
      });
      return false;
    }
  };

  const updateClassify = async () => {
    const { data } = await useApi("column");
    columns.value = data;
  };

  onBeforeMount(async () => {
    await updateClassify();
    if (columns.value.length  <= 0) {
      let notification = ElNotification.warning({
        title: '没有文章分类!',
        duration: 3000,
        showClose: false,
        onClick: () => {
          classifyFormRef.value.openAddDialog();
          notification.close();
        },
        message: () => h(ElText, { type: 'primary', size: 'small', style: {cursor: "pointer"} }, () => '请点击这里创建文章分类!')
      });
    }

  });

  return {
    submitForm,
    columns,
    articleCoverUrl,
    handleExceed,
    btnAgency,
    updateClassify
  };
};