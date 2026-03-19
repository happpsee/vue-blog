import { useTemplateRef, ref, computed, onBeforeMount } from "vue";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import { router } from "src/router";
//处理element-plus 表单的相关逻辑
export const useEditForm = ({useApi,  valueHtml, showSubmitDialog}) => {
  const uploadArticleCoverRef = useTemplateRef("uploadArticleCover");
  //表单数据
  const submitForm = ref({
    title: "",
    cover: "",
    column: "",
    summary: ""
  });
  const columns = ref(null);

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
  onBeforeMount(async () => {
    const { data } = await useApi("column");
    columns.value = data;
  });

  return {
    submitForm,
    columns,
    articleCoverUrl,
    handleExceed,
    btnAgency
  };
};