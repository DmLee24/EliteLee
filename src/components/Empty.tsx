import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

// 增强版Empty组件，确保在任何情况下都能显示内容
export function Empty() {
  return (
    <motion.div 
      className={cn("flex min-h-screen items-center justify-center text-gray-500 p-4")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <i className="fa-solid fa-box-open text-6xl mb-4 text-gray-400"></i>
        <h3 className="text-xl font-medium mb-2">暂无内容</h3>
        <p className="text-gray-400">该页面目前没有可用内容</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          onClick={() => window.history.back()}
        >
          返回上一页
        </button>
      </div>
    </motion.div>
  );
}