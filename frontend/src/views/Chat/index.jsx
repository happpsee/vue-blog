import { ref, defineComponent, onMounted, Teleport, resolveComponent, onBeforeUnmount, nextTick, watch, reactive, withKeys } from "vue";
import io from "socket.io-client";
import styles from "./index.module.styl";
import store from "store";
import { Plus } from "@element-plus/icons-vue";
import { useLoginStore } from "@/stores/modules/login.js";
import {v4 as uuid} from "uuid";

import { ElNotification, ElButton, ElInput, ElScrollbar, ElLoading, ElDialog } from "element-plus";
const chatTypeMap = {
  //用户进入
  USERENTER: 1 << 0,
  [1 << 0]: "USERENTER",
  //用户离开
  USERLEAVE: 1 << 1,
  [1 << 1]: "USERLEAVE",
  //修改昵称
  CHANGEINFO: 1 << 2,
  [1 << 2]: "CHANGEINFO",
  //用户没进入房间
  USER_NOT_FOUND: 1 << 3,
  [1 << 3]: "USER_NOT_FOUND",
  //发送消息
  SENDMESSAGE: 1 << 4,
  [1 << 4]: "SENDMESSAGE",
  //发送聊天信息
  CHATHISTORY: 1 << 5,
  [1 << 5]: "CHATHISTORY",
};

const tools = [
  { type: "nickname", title: "修改昵称", placeholder: "请输入新昵称" },
  { type: "avatar", title: "修改头像", placeholder: "请输入新头像链接" }
];
let shouldScrollTop = 0;
let isLoadingHistory = false;
//这个是输入框组件
let isSubmitMsg = true;


const resetStatus = () => {
  shouldScrollTop = 0;
  isLoadingHistory = false;
  isSubmitMsg = true;
};

const connectSocket = () => {
  const socket = io(import.meta.env.VITE_WS_BASE_URL, { transports: ['websocket'], reconnectionAttempts: 3 });
  socket.on("connect", () => {
    console.log("连接成功");
  });

  return {
    socket,
    disConnectSocket: () => socket.disconnect()
  };
};

let lastTime = 0;

const throttle = (fn, wait = 300, showNotify = true) => {
  let now = Date.now();
  const effect = (...args) => {
    now = Date.now();
    let diff = (now - lastTime) < wait;
    if (diff) {
      showNotify && ElNotification.info({
        message: "操作频繁~~, 请稍后继续",
        duration: 1000,
        showClose: false,
      });
      return false;
    }
    fn(...args);
    lastTime = Date.now();
  };
  return effect;
};


//收集聊天室的名称
const ChangeDialog = defineComponent({
  emits: ["changeInfo"], setup: (_, { expose, emit }) => {
    const aboutInfo = reactive({
      type: "",
      val: "",
      title: "",
      visible: false,
    });

    const openDialog = (data) => {
      Object.assign(aboutInfo, data);
      aboutInfo.val = data.initVal ?? "";
      aboutInfo.visible = true;
      console.log("为什么又条用了");
    }
    const closeDialog = () => aboutInfo.visible = false;

    const sendChangeInfo = (e) => {
      e.preventDefault();//阻止默认行为
      e.stopPropagation();//阻止冒泡
      emit("changeInfo", {
        type:aboutInfo.type, 
        val:aboutInfo.val
      });
      closeDialog();
    }

    expose({
      openDialog,
      closeDialog,
    });

    return () => (
      <Teleport to="body">
        <ElDialog
          width="30%"
          v-model={aboutInfo.visible}
          title={aboutInfo.title}
          close-on-click-modal={false}
        >
          {aboutInfo.type === "avatar" ?
            (<ElInput
              placeholder={aboutInfo.placeholder}
              v-model={aboutInfo.val}
              onKeydown={sendChangeInfo}
            ></ElInput>) :
            (<ElInput
              placeholder={aboutInfo.placeholder}
              v-model={aboutInfo.val}
              onKeydown={withKeys(sendChangeInfo, ["enter"])}
            ></ElInput>)}
          <div class="mt-4 flex justify-end">
            <ElButton type="primary" style="margin-top: 10px;" onClick={sendChangeInfo}>确认修改</ElButton>
          </div>
        </ElDialog>
      </Teleport>
    );
  }
});




const InputComp = defineComponent({
  emits: ["submitMsg"], setup: (_, { emit }) => {
    const input = ref("");

    const sendMsg = throttle(() => {
      if (input.value < 10) {
        ElNotification.info({
          message: "输入消息过短",
          duration: 200
        });
      }

      isSubmitMsg = true;
      emit("submitMsg", input.value);
      input.value = "";
    });
    const handleKeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMsg();
      }
    }

    return () => (
      <div class={styles.inputWrap}
      >
        <textarea
          resize="none"
          class={styles.input}
          v-model={input.value}
          placeholder="请输入消息 (Enter发送, Shift + Enter 换行)"
          onKeydown={handleKeydown}
        >
        </textarea>
      </div>);
  }
});

const chatItemCardMap = {
  "info": (item) => {
    return (
      <p class="text-xs text-gray-500 flex flex-col items-center">
        <p>日期:&nbsp;&nbsp; <span class="text-sm text-gray-500">{item.date} </span> </p>
        <p>用户:&nbsp;&nbsp; <span class="text-sm text-gray-500">{item.nickname} </span></p>
        <p>{item.isLeave ? "离开了" : "进入了"}聊天室</p>
      </p>)
  },
  "isMe": (item) => {
    return (<div class="flex  justify-end items-center gap-x-1">
      <div class={[styles.msgBox, "flex flex-col gap-y-2"]}>
        <p class="text-wrap text-right text-sm text-gray-500">{item.nickname} </p>
        <p class="text-base" style="color: #09090B;">{item.message}</p>
      </div>
      <el-avatar src={item.avatar}></el-avatar>
    </div>)
  },
  "changeUserInfo": (item) => {
    return (<div class="text-xs text-gray-500 flex flex-col items-center gap-y-2">
        <p>日期:&nbsp; <span class="text-sm text-gray-500">{item.date}</span></p>
        <p>用户:&nbsp; <span class="text-sm text-gray-500">{item.oldNickname} 修改了用户信息</span></p>
        <p class="text-sm text-gray-500 flex items-center gap-x-2">
          <span class="text-sm text-gray-500 mr-3">{item.nickname} </span>
          <el-avatar src={item.avatar} size="small"></el-avatar>
        </p>
      </div>);
  },
  "message": (item) => {
    return  (<div class="flex  justify-start items-center gap-x-2">
      <el-avatar src={item.avatar}></el-avatar>
      <div class={[styles.msgBox, "flex flex-col gap-y-2"]}>
        <p class="text-wrap text-left text-sm text-gray-500">{item.nickname} </p>
        <p class="text-base" style="color: #09090B;">{item.message}</p>
      </div>
    </div>)
  }
};

const ChatITem = defineComponent({
  props: ["item"], setup: (props) => {
    return () => (
      <li style={{ margin: "10px" }}>
        {chatItemCardMap[ props.item.type ?? (props.item.isMe ? "isMe" : "message")](props.item)}
      </li>
    );
  }
});


const DisplayChats = defineComponent({
  props: ["socket"], directives: {loading: ElLoading}, setup: (props, { expose, emit }) => {
    const chatList = ref([]);
    const socket = props.socket;
    const msgListRef = ref();
    let cur = 0;
    let finished = ref(false);
    const loading = ref(false);

    expose({
      msgListRef,
    });

    watch(() => chatList.value.length, (newVal, oldVal) => {
      if (isSubmitMsg) {
        nextTick(() => {
          if (!msgListRef.value?.wrapRef?.scrollHeight ) {
            return false;
          }
          let scrollTop = Math.max(0, msgListRef.value.wrapRef.scrollHeight - msgListRef.value.wrapRef.offsetHeight);
          msgListRef.value.setScrollTop(scrollTop);
          isSubmitMsg = false;
        });
      }

      if (isLoadingHistory) {
        nextTick(() => {
          let totalHeight = msgListRef.value.wrapRef.scrollHeight;
          msgListRef.value.setScrollTop(totalHeight - shouldScrollTop);
          console.log(totalHeight - shouldScrollTop, "totalHeight, shouldScrollTop");
          isLoadingHistory = false;
        });
      }

      //如果是加载历史记录的则记录应该滚动的长度
    }, { deep: false });

    socket.on(chatTypeMap.USERENTER, (data) => {
      chatList.value.push({ type: "info", ...data });
    });
    socket.on(chatTypeMap.CHANGEINFO, (data) => {
      chatList.value.push({type: "changeUserInfo", ...data});
    });
    socket.on(chatTypeMap.USERLEAVE, (data) => {
      chatList.value.push({ type: "info", isLeave: true, ...data });
    });
    socket.on(chatTypeMap.SENDMESSAGE, (data) => {
      data._id || (data._id = uuid());
      console.log("chatList.value.push", data);
      chatList.value.push(data);
    });
    socket.on(chatTypeMap.CHATHISTORY, (data) => {
      if (data.length <= 0) {
        finished.value = true;
        loading.value = false;
        return false;
      }
      cur += 1;
      data.forEach((item) => {
        item._id ?? (item._id = uuid());
      });
      chatList.value.unshift(...data);
      console.log(chatList.value, "看看chatList.value");
      loading.value = false;
    });

    watch(finished, () => {
      if (!finished.value) {
        return false;
      }
      ElNotification.info({
        message: "没有更多内容了~~~",
        duration: 4000,
        showClose: false,
      });

    }, { once: true });

    const getChatHistory =  throttle(() => {
      if (loading.value || finished.value) {
        return false;
      }
      //加载更多
      loading.value = true;
      //记录总高度
      shouldScrollTop = msgListRef.value.wrapRef.scrollHeight;
      isLoadingHistory = true;
      socket.emit(chatTypeMap.CHATHISTORY, {
        cur
      });
    }, 2000, false);

    const handleScroll = (data) => {
      if (data.scrollTop > 30 || finished.value || loading.value) {
        return false;
      }
      getChatHistory();
    };


    return () => (
      <ElScrollbar 
      ref={msgListRef}
      onScroll={handleScroll}
      v-loading={loading.value}>
        <ul class={styles.chatList} >
          {
            chatList.value.map((item) => (
              <ChatITem item={item} key={item._id} />
            ))
          }
        </ul>
      </ElScrollbar>
    );
  }
});



const Tools = defineComponent({
  emits: ["openChangeDialog"], setup: (_, { emit }) => {
    return () => {  
    return (
      <div>
        <div class="flex flex-col  items-center gap-y-4 circle-tool absolute top-2 -right-20">
          {tools.map((tool) => (
            <ElButton
              onClick={() => emit("openChangeDialog", tool)}
              icon={Plus}
              style={{ width: "50px", height: "50px" }}
              class={ [styles.toolBtn, "flex flex-col gap-y-1"]}>
              <span
                style={{ fontSize: "8px" }}>{tool.title}</span>
            </ElButton>
          ))}
        </div>
      </div>
    )};
  }
});

const ChatComp = defineComponent(() => {
  const { socket, disConnectSocket } = connectSocket();
  const collectChatNameRef = ref();
  const { userInfo } = useLoginStore();
  const displayChatRef = ref();

  onBeforeUnmount(() => {
    disConnectSocket();
  });

  onMounted(() => {
    resetStatus();
    socket.emit(chatTypeMap.USERENTER, {
      token: userInfo.token,
      nickname: store.get(import.meta.env.VITE_CHAT_NICKNAME),
      avatar: store.get(import.meta.env.VITE_CHAT_AVATAR),
    });
  });

  const eventMap = {
    "submitMsg": (message) => {
      socket.emit(chatTypeMap.SENDMESSAGE, message);
    },
    "submitNickname": ({ nickname }) => {
      socket.emit(chatTypeMap.NICKNAME, nickname);
    },
    "openChangeDialog": (data) => {
      if (data.type === "nickname") {
        data.initVal = store.get(import.meta.env.VITE_CHAT_NICKNAME) ?? userInfo.nickname;
      } else if (data.type === "avatar") {
        data.initVal = store.get(import.meta.env.VITE_CHAT_AVATAR) ?? userInfo.avatar;
      }
      collectChatNameRef.value.openDialog(data)
    },
    "changeInfo": (data) => {
      if (data.type === "nickname") {
        store.set(import.meta.env.VITE_CHAT_NICKNAME, data.val);
      } else if (data.type === "avatar") {
        store.set(import.meta.env.VITE_CHAT_AVATAR, data.val);
      }
      socket.emit(chatTypeMap.CHANGEINFO, {name: data.type, value: data.val});
    }
  };

  const eventAgency = (type, event) => {
    eventMap[type] && eventMap[type](event);
  };

  return () => (<div class={[styles.chatWrap, "flex flex-col"]}>
    <Tools onOpenChangeDialog={(data) => eventAgency("openChangeDialog", data)} />
    <DisplayChats ref={displayChatRef} socket={socket} />
    <InputComp onSubmitMsg={(events) => eventAgency("submitMsg", events)} />
    <ChangeDialog ref={collectChatNameRef} onChangeInfo={(events) => eventAgency("changeInfo", events)} />
  </div>);
});


export default ChatComp;