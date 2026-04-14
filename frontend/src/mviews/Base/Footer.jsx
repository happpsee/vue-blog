import { defineComponent, computed } from "vue";
import footerClass from "./styls/footer.module.styl";
import { useRoute } from "vue-router";

const tabbarItems = [
  {
    id: 1,
    name: "home",
    title: "首页",
    icon: "wap-home-o",
    to: {name: "mHome"}
  },
  {
    id: 2,
    name: "category",
    title: "分类",
    icon: "records",
    to: {name: "mClassify" }
  },
  {
    id: 3,
    name: "userInfo",
    title: "我的",
    icon: "friends-o",
    to: {name: "mUserInfo"}
  },
];




const TabbarComp = defineComponent(() => {
  return () => (
      <van-tabbar
        route={true}>
        {
          tabbarItems.map(item =>
          (<van-tabbar-item
            name={item.name}
            icon={item.icon}
            key={item.id}
            to={item.to}
            style={{"--van-tabbar-item-text-color": "#4B5563"}}>
            {item.title}

          </van-tabbar-item>))
        }
      </van-tabbar>
  )
});

// const SearchToolComp = defineComponent(() => {
//   return () => (
//     <div class={footerClass.searchTool}>
//       <i class={[footerClass.toolItem, footerClass.imageIcon]}></i>
//       <i class={[footerClass.toolItem, footerClass.photoIcon]}></i>
//       <i class={[footerClass.toolItem, footerClass.fileIcon]}></i> 
//     </div>    
//   )
// });

const FooterCompMap = {
  "Tabbar": TabbarComp,
  "Blank": null,
};

const getFooterComp = (type) => {
  if (!(type && type in FooterCompMap)) {
    return FooterCompMap["Tabbar"];
  }
  return FooterCompMap[type];
};


export default defineComponent(() => {
  const route = useRoute();
  const type = computed(() => {
    return route.meta.footer;
  });

  return () => {
    const Comp = getFooterComp(type.value) ?? <p></p>;
    return (<Comp/>);
  }
})
