import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

// 捕获所有可能的错误
try {
  // 确保DOM元素存在
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  // 渲染应用
  const root = createRoot(rootElement);
  
  // 包装在try-catch中以捕获渲染错误
  try {
    // 使用HashRouter替代BrowserRouter以解决GitHub Pages路由问题
    root.render(
      <StrictMode>
        <HashRouter>
          <App />
          <Toaster />
        </HashRouter>
      </StrictMode>
    );
  } catch (renderError) {
    console.error("渲染错误:", renderError);
    // 如果渲染失败，显示友好的错误信息
    rootElement.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <i class="fa-solid fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
        <h1 class="text-2xl font-bold mb-2">应用加载失败</h1>
        <p class="text-gray-300 mb-6 text-center">抱歉，应用无法正常加载。这可能是由于网络问题或浏览器兼容性问题导致的。</p>
        <button 
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          onclick="location.reload()">
          刷新页面重试
        </button>
      </div>
    `;
  }
} catch (error) {
  console.error("应用初始化错误:", error);
  // 如果连DOM元素都找不到，使用document.body
  document.body.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <i class="fa-solid fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
      <h1 class="text-2xl font-bold mb-2">应用无法初始化</h1>
      <p class="text-gray-300 mb-6 text-center">遇到严重错误，无法启动应用。</p>
      <button 
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
        onclick="location.reload()">
        刷新页面重试
      </button>
    </div>
  `;
}

// 增加页面加载完成检测
window.addEventListener('load', () => {
  console.log('页面加载完成');
  // 检查root元素是否有内容
  const rootElement = document.getElementById('root');
  if (rootElement && rootElement.innerHTML.trim() === '') {
    console.warn('Root元素为空，可能存在渲染问题');
    // 如果root元素为空，尝试重新渲染
    try {
      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          <HashRouter>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
              <h1 className="text-2xl font-bold mb-4">页面内容加载中...</h1>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          </HashRouter>
        </StrictMode>
      );
    } catch (error) {
      console.error('重新渲染失败:', error);
    }
  }
});

// 确保在Hash变化时也能正确加载页面
window.addEventListener('hashchange', () => {
  console.log('Hash变化:', window.location.hash);
  // 延迟一小段时间后检查页面内容
  setTimeout(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.innerHTML.trim() === '') {
      console.warn('Hash变化后页面内容为空，尝试刷新');
      location.reload();
    }
  }, 500);
});
