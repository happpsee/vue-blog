import { defineComponent, ref, onUnmounted, onBeforeMount } from "vue";

const useDelayedLoading = (delay = 300) => {
  //pending, delay, fulfilled
  const status = ref("pending");
  let timer = null;

  //设置为pending，表示开始加载
  const start = () => {
    status.value = "pending";
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      status.value = "delay";
    }, delay);
  }

  //完毕，显示最终内容
  const done = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    status.value = "fulfilled";
  };

  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  });

  return {
    status,
    start,
    done
  }
};

export default defineComponent({props: ["loadFnc"], setup(props, {slots}){
  const {status, start, done} = useDelayedLoading();
  const result = ref({});
  onBeforeMount(async () => {
    start();
    const ans = await props.loadFnc();
    result.value = ans;
    done();
  });

  return () => (<div style={{height: "100%"}}>
    {
    status.value === "fulfilled" ? slots.default(result.value) : (
      status.value === "delay" ? 
      (<van-skeleton style="--van-skeleton-paragraph-background: #FAFAFA; " row="8" />)  
      : 
      <p> </p>)
    }
    </div>);
}});