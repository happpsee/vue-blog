
import {
  Tabbar,
  TabbarItem,
  Search,
  List,
  Cell,
  Image,
  TextEllipsis,
  Divider,
  PullRefresh,
  Skeleton,
  Icon,
  Tabs,
  Tab,
  Form,
  Field,
  Button,
  CellGroup,
  Empty
} from "vant";


const components = [
  Tabbar,
  TabbarItem,
  Search,
  List,
  Cell,
  Image,
  TextEllipsis,
  Divider,
  PullRefresh,
  Skeleton,
  Icon,
  Tabs,
  Tab,
  Form,
  Field,
  Button,
  CellGroup,
  Empty,
];

export const setupVant = (app) => {
  for (let i = 0, item; item = components[i]; i++) {
    app.component(item.name, item);
  }
};