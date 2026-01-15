import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { Empty } from "@/components/Empty";

// 应用主组件
export default function App() {
  return (
    <Routes>
      {/* 确保所有路由都能正确匹配 */}
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/runtime/" element={<Home />} />
      <Route path="/other" element={<Empty />} />
      
      {/* 通配符路由，确保任何未匹配的路径都返回首页 */}
      <Route path="*" element={<Home />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}
