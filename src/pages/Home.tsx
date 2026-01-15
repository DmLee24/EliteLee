import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

// 增强版错误边界，提供更强大的错误捕获和恢复能力
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 捕获全局错误
    const errorHandler = (event: ErrorEvent) => {
      console.error("捕获到全局错误:", event.error);
      setError(event.error);
      setHasError(true);
      event.preventDefault();
    };

    // 捕获未处理的Promise拒绝
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("捕获到未处理的Promise拒绝:", event.reason);
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);
    
    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  // 重置错误状态的函数
  const resetError = () => {
    setHasError(false);
    setError(null);
    // 可选：刷新页面
    // window.location.reload();
  };

  if (hasError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/90 z-50 p-4">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
          <div className="text-center">
            <i className="fa-solid fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <h2 className="text-2xl font-bold mb-2 text-white">页面加载过程中遇到问题</h2>
            <p className="text-red-400 mb-4">{error?.message || "未知错误"}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white font-medium"
                onClick={resetError}
              >
                重试
              </button>
              <button 
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors text-white font-medium"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const performanceData = [{
    name: "日间场景",
    标准版: 60,
    增强版: 150
}, {
    name: "夜间场景",
    标准版: 40,
    增强版: 90
}, {
    name: "复杂城市",
    标准版: 50,
    增强版: 130
}, {
    name: "荒野地区",
    标准版: 70,
    增强版: 160
}];

const mainModules = [{
    title: "NVE + RTGI + ENB 光追视觉体系",
    icon: "fa-eye",
    description: "打造次世代光追画质，实现物理级光影效果，重构游戏视觉渲染管线",

    details: [
        "NaturalVision Evolved 全局重制",
        "ReShade RTGI 全局光照模拟",
        "ENBSeries 底层光影与色彩调校",
        "车辆与光源渲染系统性修复",
        "粒子效果重置引擎"
    ]
}, {
    title: "新版自由城",
    icon: "fa-city",
    description: "完美融合传说中的 Liberty City Preservation Project，开启双城传奇体验",
    details: ["双世界并行技术", "便捷跨世界交通网络", "AI高清材质重铸", "完整都市生态系统", "界面适配增强"]
}, {
    title: "执法与战术AI",
    icon: "fa-shield-alt",
    description: "拟真智能调度执法与战术AI增强系统",

    details: [
        "10星通缉与渐进式战术响应",
        "高级犯罪现场调查",
        "Aggressive AI战术压制增强",
        "全面革新的执法机构体系",
        "活跃动态世界生态"
    ]
}, {
    title: "终极犯罪体验",
    icon: "fa-gem",
    description: "完美整合多个大型劫案模组，在单人故事中即可体验豪华抢劫",
    details: ["太平洋标准银行劫案", "卡尤佩里科岛劫案", "联合储蓄劫案", "皇宫珠宝劫案", "与RDE+PEV系统深度融合的挑战"]
}, {
    title: "真实化场景",
    icon: "fa-building",
    description: "标志性建筑与商业街头真实化，深化游戏世界可信度",
    details: ["洛杉矶地标与系统化标识", "真实道路标识系统", "细节化街道道具", "商业景观与街头文化现实化", "关键任务资产视觉升级"]
}, {
    title: "载具系统扩充",
    icon: "fa-car",
    description: "精选高质量载具模型，涵盖执法、民用、军事等多种类型",

    details: [
        "执法、政府与公共服务载具",
        "品牌车型系列（国产、JDM、德系、超跑等）",
        "特殊用途及大型载具",
        "高精度纹理车牌扩展（支持自定义车牌、真实车牌样式）",
        "警笛灯光系统扩展"
    ]
}, {
    title: "物理与交互系统",
    icon: "fa-cubes",
    description: "生物力学系统重铸与沉浸式载具交互系统，提供更真实的物理体验",
    details: ["战术移动与身法", "拟真角色状态管理", "核心创伤反馈机制", "环境交互物理重构", "动态拟真第一人称驾驶视角"]
}, {
    title: "角色扮演与社交",
    icon: "fa-users",
    description: "深度角色扮演菜单、动态职业模拟与社交关系网络系统",
    details: ["真实消费系统", "场景化行为动画", "动态社交舞蹈", "营利活动系统", "动态社交关系网络"]
}, {
    title: "地形与生态",
    icon: "fa-tree",
    description: "城市与荒野植被系统，构建全境生态环境",

    details: [
        "城市精细化植被与街景系统",
        "荒野与生态过渡带森林系统",
        "Lively World Expansion植被系统",
        "植被反射修复",
        "草地模型与渲染系统性优化"
    ]
}];

const comparisonData = [{
    category: "版本与更新",
    common: "多基于v1.58、1.68等陈旧游戏版本，内容与技术过时，且无后续更新。",
    elite: "基于新版v1.71/3586离线构建，并持续更新，让玩家体验始终处于前沿。另外提供画质性能增强版，内容一致。"
}, {
    category: "核心玩法",
    common: "仅提供基础游戏内容，缺乏深度扩展。",
    elite: "独家集成多个劫案（太平洋银行、卡尤佩里科岛等）。"
}, {
    category: "模组与稳定",
    common: "模组混杂、冲突频发，崩溃率高，极不稳定，并且无法集成『新版自由城』。",
    elite: "以'真实沉浸'为核心独家严选与深度调校，数百模组协同如一，稳定如原生。『新版自由城』的无缝集成便是典范。"
}, {
    category: "画面表现",
    common: "滥用滤镜导致色彩失真，或沿用'负优化'方案导致帧数暴跌，且存在植被无反射等漏洞。",
    elite: "NVE+RTGI+ENB 次世代光追画质，世界全局重制，实现物理级光影，并独家修复反射漏洞，画质完整且帧数优化。"
}, {
    category: "世界生态",
    common: "世界空洞，生态单一，城市与荒野缺乏细节与过渡。",
    elite: "构建全境生态，为城市、沙漠、森林、山脉、荒野等新增超过数十万个精细植被与道具实体，世界饱满且连续逼真。"
}];

const physicsInteractionData = [{
    title: "生物力学系统重铸",
    description: "对游戏基础操控、角色物理及世界交互规则进行底层修复与增强",

    items: [{
        subtitle: "战术移动与身法",

        points: [
            "长按潜行键可进入蹲伏姿态，降低轮廓，提升射击稳定性",
            "禁用原版路径辅助与磁吸效应，提供精准操作反馈",
            "解除室内禁止奔跑限制，允许在建筑物内部自由冲刺",
            "可控边缘交互，实现符合物理直觉的跑酷式抓取动作"
        ]
    }, {
        subtitle: "拟真角色状态管理",
        points: ["动态清洁系统，角色身上的血迹与污渍会随时间流逝", "部位伤害系统，防弹衣仅保护躯干，提升战斗策略性"]
    }, {
        subtitle: "核心创伤反馈机制",
        points: ["动态生理应激，受创未死者会呈现平衡维持行为", "高级生命状态，可能诱发创伤性休克，跪姿濒死状态"]
    }]
}, {
    title: "沉浸式载具交互系统",
    description: "对车辆的基础物理与交互逻辑进行大量拟真化调整",

    items: [{
        subtitle: "拟真驾驶物理与状态细节",

        points: [
            "真实空中动力学，腾空后的运动完全遵循物理惯性",
            "合理碰撞判定，车辆损毁与否完全基于碰撞物理与部件伤害",
            "IV式熄火逻辑，短按下车键引擎保持运转，长按关闭引擎",
            "动态车辆清洁，车辆表面污垢随雨水冲刷、高速行驶而变淡"
        ]
    }, {
        subtitle: "动态拟真第一人称驾驶视角",

        points: [
            "物理化动态镜头系统，根据车辆运动产生符合物理规律的晃动",
            "动态水平线锁定，确保车辆倾斜时天地线保持相对稳定",
            "智能操作与视角映射，支持多种视角操控模式",
            "高度可定制化配置，所有参数均可实时调整并保存"
        ]
    }, {
        subtitle: "便捷功能扩展",

        points: [
            "自动转向灯与危险警告灯系统，符合现实驾驶逻辑",
            "吹口哨召唤载具，按\\键召唤最后驾驶的载具至召唤点",
            "拟真安全带模拟系统，可视化3D安全带模型与动画音效"
        ]
    }]
}];

const roleplaySystemData = [{
    title: "深度角色扮演菜单",
    icon: "fa-user",
    description: "提供丰富的角色扮演功能，增强游戏沉浸感",

    features: [
        "真实消费系统：购买烟酒实时扣款，并产生醉酒或眩晕视觉特效",
        "场景化行为动画：一键使用长椅、健身器材、手机等环境元素",
        "动态社交舞蹈：内置多种半随机舞蹈风格，按A或ENTER切换舞步",
        "营利活动系统：街头艺人、瑜伽导师、私人司机、观光飞行员等"
    ]
}, {
    title: "动态职业模拟",
    icon: "fa-briefcase",
    description: "体验各种职业角色，感受不同的游戏人生",

    features: [
        "出租车工作：独家汉化完整的出租车计价系统，实时计费，费率可调",
        "钓鱼系统：需前往特定钓点或驾船出海，渔获可出售",
        "狩猎委托：接受\"懒散猎人\"的请求，寻找并捕获指定猎物以换取报酬",
        "抢劫模式：用武器瞄准NPC可迫使其投降并掉落现金"
    ]
}, {
    title: "动态社交关系网络系统",
    icon: "fa-comments",
    description: "建立和维护社交关系，体验丰富的人际交往",

    features: [
        "关系建立：通过手机\"Lifeinvader\"添加行人联系人，安排约会",
        "尊重值系统：成功活动提升尊重值，不当行为降低尊重值",
        "沉浸式活动：携手散步、相拥而坐、瑜伽、休息、举办派对等",
        "伙伴控制：可指令伙伴驾驶、前往地点、待命、跟随或攻击目标"
    ]
}];

const terrainEcosystemData = [{
    title: "城市精细化植被与街景系统",
    description: "为洛圣都及周边城镇注入极度精细的环境细节",

    details: [
        "总计新增13,421个高质量静态道具",
        "主体植被包括5,024棵树木、3,423棵棕榈树及1,188处灌木丛",
        "补充247株仙人掌、137株约书亚树、269处农作物及大量盆栽",
        "新增468套座椅与桌子、123处岩石以及1,468个其他街景道具"
    ],

    image: "https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/6_20260112112720.jpg"
}, {
    title: "荒野与生态过渡带森林系统",
    description: "塑造圣安地列斯州广袤的荒野、国家公园、山地及沙漠边缘地区的森林景观",

    details: [
        "总计新增13,766个环境实体",
        "北部森林区新增5,538个实体，以4,998棵各类树木为核心",
        "南部过渡区新增8,228个实体，实现从森林到沙漠的自然生态渐变",
        "动态流式加载，根据玩家位置动态调度不同细节层次的模型"
    ],

    image: "https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/9_20260112112720.jpg"
}, {
    title: "草地模型与渲染系统性优化",
    description: "全面替换与优化原版游戏草地系统",

    details: [
        "模型高清化与色彩校准，使草地色调更加鲜艳、生动",
        "全面增加了所有地形上的草地密度，优化草地模型缩放比例",
        "显著扩展了草地的渲染绘制距离，消除突兀的\"草地消失线\"",
        "性能平衡版本，在几乎不损失视觉整体效果的前提下，确保无额外性能开销"
    ],

    image: "https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/LWE2.8_9_20260112112720.jpg"
}];

const policeModData = {
    title: "警察模组：终极大乱斗系统",
    version: "v1.0.8内容",
    description: "由EliteLee玩家仓库独家汉化、独家整合，专注于呈现高强度、快节奏的警匪战斗与大规模NPC对抗场面",

    features: [{
        name: "更衣室、军械库与车库",
        description: "为你的角色配备最佳装备、武器和载具，以应对任何任务"
    }, {
        name: "自动支援系统",
        description: "通缉星级系统现在成了你的盟友！增援将根据支援等级自动呼叫——星级越高，支援越强"
    }, {
        name: "超过24种增援单位类型",
        description: "洛圣都警察局巡逻队、县警巡逻队、高速公路巡警队、FIB小队、战术反应组等"
    }, {
        name: "实时犯罪模式",
        description: "使用警用电脑菜单查看实时犯罪，运作方式类似于IV中的\"义警\"支线任务"
    }, {
        name: "12种实时犯罪类型",
        description: "步行嫌犯、驾车扫射活动、帮派驾车扫射活动、毒品交易、现金箱抢劫等"
    }, {
        name: "生存模式",
        description: "城市被围困了！召集五星级增援，在压倒性的威胁面前坚守阵地"
    }, {
        name: "8种生存场景类型",
        description: "暴乱、外星入侵、帮派战争入侵、末日掠夺者、杀手小丑入侵等"
    }, {
        name: "坚守防线模式",
        description: "保卫关键地点，抵御一波又一波relentless的敌人"
    }],

    controls: [{
        key: "O + N",
        function: "同时按下以启动模组"
    }, {
        key: "N",
        function: "打开主菜单"
    }, {
        key: "G",
        function: "访问警用电脑"
    }, {
        key: "B",
        function: "打开增援菜单"
    }],

    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=action%20packed%20police%20battle%20scene%20with%20multiple%20officers%20and%20vehicles%2C%20explosions%2C%20ultra%20HD%20graphics&sign=86e98e09a7639643d964fcdcc4479f59"
};

const updateLogs = [{
    version: "v1.0.7",
    date: "最新版本",
    highlights: "视觉底层校正与世界沉浸感的系统性构建",

    details: [
        "修正贴图闪烁、LOD加载异常问题",
        "执法AI系统升级：RDE更新，使用PEV增强AI行为",
        "玩法升级：新增多个劫案模组",
        "视觉核心修复：重构车辆光源物理参数，修复仪表盘过曝与失真光晕",
        "洛杉矶深度还原：全面替换地标建筑、真实路牌、商业广告与街头涂鸦",
        "环境与生态：集成城市与荒野两套植被系统，共新增超2.7万环境实体"
    ]
}, {
    version: "v1.0.6",
    date: "2025年末",
    highlights: "世界生态与视觉细节的系统性增强",

    details: [
        "执法体系定制：精选集成RDE及RDE Expanded & Enhanced官方可选组件",
        "全域视觉升级：引入4K血液贴图，并为自由城地图适配高清电台与武器图标",
        "主角外观高清重塑：为故事模式主角崔佛与迈克尔集成专属面部材质优化模组",
        "世界细节统一：集成最新UnitedPlates车牌模组，提供300+种真实美国车牌样式",
        "世界细节统一：集成最新UnitedPlates车牌模组"
    ]
}, {
    version: "v1.0.5",
    date: "2025年中",
    highlights: "沉浸体验调优",

    details: [
        "驾驶视角：第一人称是叫更换为动态拟真驾驶视角和物理惯性反馈",
        "全局光照：微调RTGI间接光照与阴影强度细节",
        "性能优化：针对『新版自由城』及新增功能，进一步优化内存与渲染负载"
    ]
}, {
    version: "v1.0.4",
    date: "2025年初",
    highlights: "无缝整合『新版自由城』模组",

    details: [
        "双世界并行：革命性技术实现IV自由城与洛圣都的零冲突共存",
        "便捷穿梭：通过洛圣都指定地点的传送阵，或按F11使用快捷菜单瞬间往返",
        "完整汉化：自由城全部地图图标、地点名称已完成深度汉化",
        "独家优化：针对该超大型模组进行独家稳定性优化"
    ]
}, {
    version: "v1.0.3",
    date: "2024年末",
    highlights: "特效重铸与安全防护升级",

    details: [
        "引入粒子效果重置引擎，彻底重构了游戏内烟雾、尘埃、火星及爆炸等粒子系统",
        "实施\"水印溯源\"系统，为保护正版用户权益与社区健康",
        "人工智能（AI）行为优化，微调了警方与普通市民的AI逻辑"
    ]
}];

const pricingPlans = [{
    title: "买断版",
    price: "168",
    description: "包含整合包本体，不含后续更新",
    features: ["整合包本体 (v1.0.7)", "基础技术支持", "远程服务40元/次", "更新补丁需另购 (60元/个)"],
    buttonText: "立即购买"
}, {
    title: "订阅版",
    price: "198",
    description: "永久包更新，包含整合包本体及后续所有更新",
    features: ["整合包本体 (v1.0.7)", "永久免费更新", "每月2次免费远程服务", "优先获取新内容"],
    buttonText: "立即订阅",
    isPopular: true
}];

export default function Home() {
    const {
        theme,
        toggleTheme
    } = useTheme();

    const [activeSection, setActiveSection] = useState("hero");
    const [scrollPosition, setScrollPosition] = useState(0);

  const sectionRefs = {
  hero: useRef<HTMLDivElement>(null),
  modules: useRef<HTMLDivElement>(null),
  nve: useRef<HTMLDivElement>(null),
  libertyCity: useRef<HTMLDivElement>(null),
  terrain: useRef<HTMLDivElement>(null),
  performance: useRef<HTMLDivElement>(null),
  physics: useRef<HTMLDivElement>(null),
  roleplay: useRef<HTMLDivElement>(null),
  rdePev: useRef<HTMLDivElement>(null),
  police: useRef<HTMLDivElement>(null),
  updates: useRef<HTMLDivElement>(null),
  modifiers: useRef<HTMLDivElement>(null),
  pricing: useRef<HTMLDivElement>(null),
  payment: useRef<HTMLDivElement>(null)
};

     useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            setScrollPosition(window.scrollY);
            
            let currentSection = "hero";

            Object.entries(sectionRefs).forEach(([section, ref]) => {
                if (ref.current && scrollPosition >= ref.current.offsetTop) {
                    currentSection = section;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (section: string) => {
        const ref = sectionRefs[section as keyof typeof sectionRefs];

        if (ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 80,
                behavior: "smooth"
            });
        }
    };

  return (
    <ErrorBoundary>
      <div
        className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
            {}
            <header
                className="fixed w-full z-50 backdrop-blur-md bg-opacity-80 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
                        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
                            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                                  <img 
                                      src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/图片1_20260114154943.png" 
                                      alt="EliteLee" 
                                      className="h-12 md:h-14 object-contain"
                                  />
                            </div>
                            <div className="flex items-center space-x-4 w-full md:w-auto justify-center">
                                <nav className="hidden md:flex items-center space-x-4">
                                    {Object.keys(sectionRefs).map(section => {
              const getSectionTitle = (sectionKey: string) => {
                  const titles: Record<string, string> = {
                      hero: "首页",
                      modules: "核心功能",
                      nve: "次世代重置与光追",
                      libertyCity: "新版自由城",
                      terrain: "地形生态",
                      performance: "性能",
                      physics: "物理交互",
                      roleplay: "角色扮演",
                      rdePev: "RDE+PEV",
                      police: "警察模组",
                      updates: "更新",
                      pricing: "订阅",
                      modifiers: "修改器",
                      payment: "支付与协议"
                  };

                                            return titles[sectionKey] || sectionKey;
                                        };

                                        return (
                                                <button
                                                    key={section}
                                                    onClick={() => scrollToSection(section)}
                                                    className={`text-sm font-medium transition-all duration-300 relative group ${activeSection === section ? "text-amber-500" : "text-gray-600 dark:text-gray-300 hover:text-amber-400"}`}>
                                                    {activeSection === section && (
                                                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full shadow-md shadow-amber-500/50"></span>
                                                    )}
                                                    {getSectionTitle(section)}
                                                </button>
                                        );
                                    })}
                                </nav>
                                <motion.div
                                    className="mx-2"
                                    initial={{
                                        opacity: 0,
                                        y: 30
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.5
                                    }}>
                                        <a
                                            href="https://www.bilibili.com/video/BV1EeB9BVEuD/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors duration-300 shadow-lg shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/40 relative group">
                                            <span className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-300"></span>
                                            <span className="relative z-10"><i className="fa-solid fa-play mr-2 text-xs"></i>观看视频</span>
                                        </a>
                                </motion.div>
                            </div>
                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                                    <i className={theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
                                </button>
                                        <button
                                            onClick={() => scrollToSection("payment")}
                                            className="hidden sm:flex items-center px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 relative group">
                                            <span className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-300"></span>
                                            <span className="relative z-10">立即购买</span>
                                            <span className="relative z-10"><i className="fa-solid fa-arrow-right ml-2 text-sm"></i></span>
                                        </button>
                                <button className="md:hidden text-gray-700 dark:text-gray-200">
                                    <i className="fa-solid fa-bars text-xl"></i>
                                </button>
                            </div>
                        </div>
            </header>
            <main className="flex-grow pt-16">
                {}
                <section
                    ref={sectionRefs.hero}
                    className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    {}
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-amber-500/20 rounded-full filter blur-[100px]"></div>
                        <div
                            className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-blue-500/20 rounded-full filter blur-[100px]"></div>
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `url("https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=california%20palm%20trees%20silhouette%20pattern%20summer%20vibe&sign=721d264ccfb3e7b5138252e389fc8a71")`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}></div>
                    </div>
                    <div className="container mx-auto px-4 py-20 z-10 relative">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 30
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 0.6
                                    }}>
                                    <h1
                                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                                        <span className="inline-block align-middle">
                                            <img 
                                                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/图片1_20260114145636.png" 
                                                alt="EliteLee" 
                                                className="w-auto h-auto max-h-[2.2em] object-contain inline-block align-middle"
                                            />
                                        </span>
                                        <span className="text-amber-500 font-black tracking-wider drop-shadow-lg text-shadow-amber">典藏级</span><br />
                                        <span
                                            className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-shadow">现实整合包·传承版
                                        </span>
                                    </h1>
                                    <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">基于《侠盗猎车手V》v1.71版本构建，通过独家筛选、深度调校、兼容性重构与稳定性优化，将数百项模组整合为一个协同运作的沉浸式拟真系统。
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </p>
                                    <div
                                        className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={() => scrollToSection("payment")}
                                        className="px-8 py-3 rounded-full bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 relative group">
                                        <span className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-opacity duration-300"></span>
                                        <span className="relative z-10">立即购买</span>
                                    </button>
                                    <button
                                        onClick={() => scrollToSection("modules")}
    className="px-8 py-3 rounded-full bg-transparent border-2 border-gray-400 text-white font-bold text-lg hover:border-white hover:text-white transition-all duration-300 relative group">
    <span className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
    <span className="relative z-10">了解更多</span>
                                    </button>
                                    <a
                                        href="https://space.bilibili.com/94583869?spm_id_from=333.1007.0.0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 rounded-full bg-transparent border-2 border-amber-500 text-white font-bold text-lg hover:bg-amber-500/20 transition-all duration-300 relative group">
                                        <span className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></span>
                                        <span className="relative z-10">获取白皮书</span>
                                    </a>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 30
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.3
                                    }}
                                    className="mt-12 flex flex-wrap justify-center lg:justify-start gap-4">
                                    <div className="flex items-center text-gray-300">
                                        <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                                        <span>210GB极致整合</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                                        <span>一键安装，解压即玩</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                                        <span>完整支持故事模式</span>
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div
                                className="lg:w-1/2"
                                initial={{
                                    opacity: 0,
                                    scale: 0.8
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.2
                                }}>
                                <div className="relative">
                                    {}
                                    <div
                                        className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=realistic%20GTA%20V%20Los%20Santos%20city%20scene%20with%20skyscrapers%2C%20sunset%2C%20traffic%2C%20high%20quality%20graphics%2C%20game%20screenshot&sign=e7ad69845d0616259a962c3535442c04"
                                            alt="EliteLee整合包展示 - GTA5洛圣都场景"
                                            className="w-full h-auto" />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    {}
                                    <div
                                        className="absolute -top-5 -left-5 rounded-xl overflow-hidden shadow-xl w-40 h-24 transform -rotate-6 hover:rotate-0 transition-transform duration-500 border-2 border-gray-800">
                                        <img
                                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=realistic%20GTA%20Liberty%20City%20rainy%20night%20scene%20with%20neon%20lights%2C%20wet%20streets%2C%20high%20quality%20graphics&sign=7f9cb27900c0dff6c6266336466569b9"
                                            alt="自由城雨夜效果"
                                            className="w-full h-full object-cover" />
                                    </div>
                                    {}
                                    <div
                                        className="absolute -bottom-5 -right-5 rounded-xl overflow-hidden shadow-xl w-40 h-24 transform rotate-6 hover:rotate-0 transition-transform duration-500 border-2 border-gray-800">
                                        <img
                                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=realistic%20GTA%20V%20car%20with%20detailed%20reflections%20and%20high%20quality%20textures&sign=390756a6326f3b83e8ae57ae24c43843"
                                            alt="高品质车辆效果"
                                            className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    {}
                    <motion.div
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                        onClick={() => scrollToSection("modules")}
                        animate={{
                            y: [0, 10, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2
                        }}>
                        <span className="text-gray-400 mb-2 text-sm">向下滚动探索更多</span>
                        <i className="fa-solid fa-chevron-down text-gray-400"></i>
                    </motion.div>
                </section>
                {}
                <section
                    ref={sectionRefs.modules}
                    className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>核心功能模块
                                                                                                                                                                                                                                                                                                                                                                                                              </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>《EliteLee典藏级现实整合包·传承版》拥有九大核心功能模块，全方位提升您的游戏体验</motion.p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mainModules.map((module, index) => <motion.div
                                key={module.title}
                                className={`rounded-2xl p-6 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"} hover:shadow-xl transition-all duration-300 group`}
                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}
                                whileHover={{
                                    y: -5
                                }}>
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-amber-500/20 text-amber-500 text-2xl`}>
                                    <i className={`fa-solid ${module.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{module.title}</h3>
                                <p
                                    className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    {module.description}
                                </p>
                                <ul className="space-y-2">
                                    {module.details.map((detail, idx) => <li key={idx} className="flex items-start">
                                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                                        <span
                                            className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                            {detail}
                                        </span>
                                    </li>)}
                                </ul>
                            </motion.div>)}
                        </div>
                    </div>
                </section>
    <section
      ref={sectionRefs.nve}
      className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}>
            <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6 inline-block"
                initial={{
                    opacity: 0,
                    y: 20
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.5
                }}>
                <span>NVE + RTGI + ENB 光追视觉体系</span>
            </motion.h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>本整合包的视觉体系以 NaturalVision Evolved (NVE) 为核心引擎，并深度融合 RTGI ReShade 全局光照和独家ENBSeries光追、底层光影、色彩调校，共同构建了一套追求摄影测量级真实感的现代渲染管线
                                                          </p>
        </motion.div>
         {}
        {/* 改为三个分开的图片展示部分，类似地形生态章节 */}
        <div className="space-y-16">
            {/* 第一张图片 - 光追视觉效果 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/image_20260112113933.png"
                            alt="NVE + RTGI + ENB 光追视觉效果"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">次世代光追视觉效果</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        这张图片展示了NVE + RTGI + ENB技术的全面视觉表现，实现了物理级的光影效果与前所未有的真实感。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                基于最新版本的NaturalVision Evolved引擎构建
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                ReShade RTGI技术提供全局光照模拟
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                ENBSeries进行底层光影与色彩调校
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
            
            {/* 第二张图片 - 高品质光照效果 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2 md:order-2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/111PixPin_2025-12-26_00-54-11_20260114204654.png"
                            alt="NVE + RTGI + ENB 高品质光照效果"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">高品质水面反射与光照效果</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        此图展示了本整合包在水面反射与环境光照方面的卓越表现，打造出电影级的视觉体验。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                真实的水面物理反射效果，捕捉周围环境细节
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                全局光照系统确保阴影与光照过渡自然
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                材质表面细节在不同光照条件下的精确呈现
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
            
            {/* 第三张图片 - 雨夜都市光影效果 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/封面_20260114202756.png"
                            alt="NVE + RTGI + ENB 雨夜都市光影效果"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">雨夜都市光影艺术</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        这张图片呈现了雨夜中都市霓虹与雨水反射的绝美视觉效果，展现了光影系统的深度与层次感。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                雨水特效与地面湿滑效果的真实模拟
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                霓虹灯效在潮湿环境中的扩散与反射
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                车辆灯光系统的精确渲染与光晕效果
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-16">
            <motion.div
                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"}`}
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.1
                }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <i className="fa-solid fa-mountain-sun text-amber-500 mr-3"></i>NaturalVision Evolved
                                                                        </h3>
                <p
                    className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>以美国南加州（洛杉矶与索尔顿海地区）的真实摄影资料为蓝本，对游戏的环境天气、物理光照、环境色彩、世界纹理、建筑模型等进行全方位系统性重制
                                                                        </p>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>环境天气系统</strong><strong data-inspector-line="830" data-inspector-column="44" data-inspector-relative-path="src/pages/Home.tsx">环境天气系统</strong>：动态体积化云层系统，彻底取代原版贴图天空，实现真实的云层流动。集成极光（Aurora Borealis）效果</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>照明系统</strong>：基于物理的体积雾效果，增强场景氛围与光线体积感，精确模拟日出日落的色温变化
                                                                                    </span>
                    </li>
                    <></>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>世界纹理与建筑模型</strong>：视差道路与路面重制，显著提升几何细节感，为建筑、街道、地标注入南加州特色
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>植被系统</strong>：根据真实地理分布重新设计植被类型与密度，确保生态合理性与视觉美感
                                                                                    </span>
                    </li>
                    <></>
                </ul>
            </motion.div>
            <motion.div
                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"}`}
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.2
                }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <i className="fa-solid fa-lightbulb text-purple-500 mr-3"></i>ReShade RTGI 全局光照
                                                                        </h3>
                <p
                    className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>在传统光栅化渲染管线中，实时模拟柔和的间接光照、精确的镜面反射与体积阴影，极大提升环境天气、照明系统与环境色彩的真实度
                                                                        </p>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>环境色彩优化</strong>：有效消除原版生硬的暗部区域，填充自然的环境光，使色彩过渡更加平滑
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>世界纹理增强</strong>：通过精确的光照计算，突显建筑模型、道具与植被的纹理细节，增强立体感
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>照明系统提升</strong>：大幅增强场景的视觉连贯性与立体纵深感，模拟光线在不同材质间的真实反弹
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>环境天气响应</strong>：与NVE天气系统深度集成，光照效果随天气变化，雨天、雾天呈现不同的光线散射效果
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>兼容性优化</strong>：兼容非RTX显卡，所有玩家均可体验，且针对不同硬件配置提供多级画质预设
                                                                                    </span>
                    </li>
                </ul>
            </motion.div>
            <motion.div
                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"}`}
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.3
                }}>
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <i className="fa-solid fa-palette text-blue-500 mr-3"></i>ENBSeries 色彩调校
                                                                        </h3>
                <p
                    className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>作为游戏光追渲染与次世代画面的"色彩大师"，对色调映射、环境色彩、世界纹理表现进行了大量独家调校工作
                                                                        </p>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>色调映射优化</strong>：采用电影级色彩分级技术，实现HDR级别的色彩表现力，同时保持自然观感
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>环境色彩融合</strong><strong data-inspector-line="954" data-inspector-column="44" data-inspector-relative-path="src/pages/Home.tsx">环境色彩融合</strong>：重构ENB参数，使其与NVE的天气色彩、RTGI的全局光照无缝融合</span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>世界纹理与建筑模型表现</strong>：增强建筑细节、街道纹理和道具质感，通过精心调校的色彩配置突显材质特性
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>照明系统细节</strong>：修复原版阴影锯齿、水体反射不自然等问题，优化光源衰减与色散效果
                                                                                    </span>
                    </li>
                    <li className="flex items-start">
                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                            <strong>植被与材质增强</strong><strong data-inspector-line="972" data-inspector-column="44" data-inspector-relative-path="src/pages/Home.tsx">植被与材质增强</strong>：增强车辆漆面的多层清漆质感与材质的次表面散射效果</span>
                    </li>
                </ul>
            </motion.div>
        </div>
        {}
        <motion.div
            className={`p-8 rounded-2xl ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}
            initial={{
                opacity: 0,
                y: 30
            }}
            whileInView={{
                opacity: 1,
                y: 0
            }}
            viewport={{
                once: true
            }}
            transition={{
                duration: 0.5
            }}>
            <h3 className="text-2xl font-bold mb-6 text-center">视觉技术亮点</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                      <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-amber-500/20 text-amber-500`}>
                          <i className="fa-solid fa-car-side text-2xl"></i>
                      </div>
                      <h4 className="text-xl font-bold mb-2">车辆光源渲染修复</h4>
                      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>解决仪表盘过曝问题，重构车内光照系统的强度梯度与衰减曲线，确保所有仪表信息在夜间清晰可辨
                                                                              </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                      <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-purple-500/20 text-purple-500`}>
                          <i className="fa-solid fa-fire text-2xl"></i>
                      </div>
                      <h4 className="text-xl font-bold mb-2">粒子效果重置引擎</h4>
                      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>对游戏内所有动态粒子系统（如爆炸、烟雾、火焰、火星）进行物理级重建，注入电影级的视觉冲击力
                                                                              </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                      <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-500/20 text-blue-500`}>
                          <i className="fa-solid fa-tint-slash text-2xl"></i>
                      </div>
                      <h4 className="text-xl font-bold mb-2">植被反射修复</h4>
                      <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>解决原版游戏中植被在反射表面缺失的重大漏洞，确保树木、灌木等在所有反射表面中正确显示
                                                                              </p>
                  </div>
              </div>
        </motion.div>
      </div>
    </section>
    {}
    <section
      ref={sectionRefs.libertyCity}
      className={`py-20 ${theme === "dark" ? "bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800" : "bg-gradient-to-b from-white via-gray-50 to-white"} relative overflow-hidden`}>
      {}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-blue-500/10 rounded-full filter blur-[100px]"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-amber-500/10 rounded-full filter blur-[100px]"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.5
          }}>
             <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block">
                <motion.span
                    className="flex items-center"
                    whileHover={{
                        scale: 1.02
                    }}>
                    <motion.i
                        className="fa-solid fa-palm-tree text-amber-500 mr-3"
                        animate={{
                            rotate: [0, 10, -10, 10, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 5
                        }}>
                    </motion.i>
                  <span>新版自由城</span>
              </motion.span>
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>完美融合传说中的 Liberty City Preservation Project，开启您的双城传奇
              </p>
        </motion.div>
        
        {/* 改为三个分开的图片展示部分，类似地形生态章节 */}
        <div className="space-y-16">
            {/* 第一张图片 - 自由城雨夜场景 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/logo-自由城1_20260114204414.png"
                            alt="新版自由城雨夜场景"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">自由城雨夜街头</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        展示新版自由城的高质量视觉效果，雨中霓虹灯映照的繁华街道。完美重现了 Liberty City Preservation Project 的精髓。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                基于最新版本的 Liberty City Preservation Project 引擎构建
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                高精度纹理与模型重制，提升城市细节与真实感
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                独特的天气系统与光照效果，营造真实都市氛围
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
            
            {/* 第二张图片 - 自由城街景 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2 md:order-2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/image7_20260112112808.png"
                            alt="自由城街景"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">双世界传奇体验</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        完美融合传说中的 Liberty City Preservation Project，让您在一个游戏中同时体验两个经典城市的魅力。这一技术突破实现了IV自由城与洛圣都的零冲突共存。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                解决了地图模组覆盖或破坏原版世界的技术瓶颈
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                自由城的加载无损于洛圣都、北扬克顿或佩里科岛的原版内容
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-purple-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                针对v1.71版本的独家适配与优化，有效避免内存溢出导致的闪退
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
            
            {/* 第三张图片 - 自由城建筑 */}
            <motion.div
                className="flex flex-col md:flex-row gap-8 items-center"
                initial={{
                    opacity: 0,
                    y: 30
                }}
                whileInView={{
                    opacity: 1,
                    y: 0
                }}
                viewport={{
                    once: true
                }}
                transition={{
                    duration: 0.7
                }}>
                <div className="md:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/imagen1_20260112112808.png"
                            alt="自由城建筑"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-4">完整都市生态</h3>
                    <p
                        className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                        新版自由城不仅拥有精致的建筑和街道，还具备完整的都市生态系统，让整个城市充满活力和真实感。
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                全地图图标、地点名称、兴趣点已完成深度中文汉化
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                可运作的地铁系统，可刷卡进站、候车、搭乘
                            </span>
                        </li>
                        <li className="flex items-start">
                            <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                            <span
                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                超过4,500个动态事件，如街头警匪火拼、行人雨天撑伞等
                            </span>
                        </li>
                    </ul>
                </div>
            </motion.div>
        </div>
        
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-16"
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.7,
            staggerChildren: 0.1
          }}>
          <motion.div
            className={`p-8 rounded-2xl ${theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white shadow-xl"}`}
            whileHover={{
              y: -5
            }}
            transition={{
              type: "spring",
              stiffness: 300
            }}>
            <div
              className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-6">
              <motion.i
                className="fa-solid fa-road text-amber-500 text-2xl"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
              </motion.i>
            </div>
            <h3 className="text-2xl font-bold mb-4">跨世界交通网络</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  <strong>定点传送阵：</strong>在洛圣都特定码头区域或国际机场，开车进入传送点，按 E 抵达自由城
                                                                                                                                                                                                                                                                                                                                                                                                          </span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  <strong>快捷菜单直达：</strong>按 F11 可瞬间传送至自由城、北扬克顿、佩里科岛或洛圣都
                                                                                                                                                                                                                                                                                                                                                                                                          </span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            className={`p-8 rounded-2xl ${theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white shadow-xl"}`}
            whileHover={{
              y: -5
            }}
            transition={{
              type: "spring",
              stiffness: 300
            }}>
            <div
              className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <motion.i
                className="fa-solid fa-radio text-green-500 text-2xl"
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}>
              </motion.i>
            </div>
            <h3 className="text-2xl font-bold mb-4">电台图标更新</h3>
            <p
              className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              当玩家进入自由城后，电台选单将整合该城市的专属电台，并对电台图标进行视觉优化
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>专属自由城电台内容</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>全新视觉风格的电台图标</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            className={`p-8 rounded-2xl ${theme === "dark" ? "bg-gray-800/80 border border-gray-700" : "bg-white shadow-xl"}`}
            whileHover={{
              y: -5
            }}
            transition={{
              type: "spring",
              stiffness: 300
            }}>
            <div
              className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
              <motion.i
                className="fa-solid fa-crosshairs text-blue-500 text-2xl"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
              </motion.i>
            </div>
            <h3 className="text-2xl font-bold mb-4">武器图标统一替换</h3>
            <p
              className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              全局替换所有武器的库存界面图标，采用更具写实风格的设计
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>增强游戏的视觉一致性</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-3"></i>
                <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>提高武器辨识度与操作便捷性</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

      </div>
    </section>
    {}
    <section
      ref={sectionRefs.terrain}
      className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5
            }}>地形与生态系统
                                                                                                                                                                                                                                                                                                                                                                                                              </motion.h2>
          <motion.p
            className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}>城市与荒野植被系统，构建全境生态环境，打造更真实、更丰富的游戏世界
                                                                                                                                                                                                                                                                                                                                                                                                              </motion.p>
        </div>
        <div className="space-y-16">
          {terrainEcosystemData.map((system, index) => <motion.div
            key={system.title}
            className="flex flex-col md:flex-row gap-8 items-center"
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1
            }}>
            <div className={`md:w-1/2 ${index % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={system.image} alt={system.title} className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-out" />
              </div>
            </div>
            <div className={`md:w-1/2 ${index % 2 === 1 ? "md:order-1" : ""}`}>
              <h3 className="text-2xl font-bold mb-4">{system.title}</h3>
              <p
                className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {system.description}
              </p>
              <ul className="space-y-3">
                {system.details.map((detail, idx) => <li key={idx} className="flex items-start">
                  <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                  <span
                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {detail}
                  </span>
                </li>)}
              </ul>
            </div>
          </motion.div>)}
        </div>

      </div>
    </section>
    {}
    <section
      ref={sectionRefs.performance}
      className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5
            }}>性能表现
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           </motion.h2>
          <motion.p
            className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}>Visual PerformanceBoost 版本，在2K分辨率、32G、9800X3D与RTX 5080平台上的实测数据</motion.p>
        </div>
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.7
            }}>
            <div
              className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}>
              <h3 className="text-xl font-bold mb-4">帧数提升对比</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5
                    }}>
                    <XAxis dataKey="name" stroke={theme === "dark" ? "#cbd5e1" : "#475569"} />
                    <YAxis
                      stroke={theme === "dark" ? "#cbd5e1" : "#475569"}
                      label={{
                        value: "帧率 (FPS)",
                        angle: -90,
                        position: "insideLeft",

                        style: {
                          fill: theme === "dark" ? "#cbd5e1" : "#475569"
                        }
                      }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                        borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                        color: theme === "dark" ? "#f3f4f6" : "#111827"
                      }} />
                    <Bar dataKey="标准版" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="增强版" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          <div
            className="lg:w-1/2 lg:pl-16"
            initial={{
              opacity: 0,
              x: 30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.7,
              delay: 0.2
            }}>
            <h3 className="text-2xl font-bold mb-6">Visual PerformanceBoost<br />
              <span className="text-amber-500">无损画质性能增强版本</span>
            </h3>
            <div
              className={`p-6 rounded-2xl mb-6 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}>
              <h4 className="text-lg font-bold mb-3">技术原理：实现这一突破的关键在于 "选择性降负" 策略：</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    <strong>细节管理：</strong>不影响主体观感，优化植被密度、阴影及部分反射的渲染精度。
                                                                                                                                              </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    <strong>着色器与光照重构：</strong>重写了部分高性能消耗的着色器单元与全局光照（GI）计算路径。
                                                                                                                                             </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                  <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                    <strong>内存与显存优化：</strong>调整了纹理流送与模型LOD（细节层次）切换策略。
                                                                                                                                             </span>
                </li>
              </ul>
            </div>
            <div
              className={`p-6 rounded-2xl ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}>
              <h4 className="text-lg font-bold mb-3">性能表现：帧数成倍释放（对比整合包标准版）</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fa-solid fa-arrow-trend-up text-amber-500 mt-1 mr-2"></i>
                  <span className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
                    <strong>日间场景：</strong>帧率提升幅度达80-100帧，复杂城市街区的画面从此如丝般顺滑。
                                                                                                                                             </span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-arrow-trend-up text-amber-500 mt-1 mr-2"></i>
                  <span className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
                    <strong>夜间与高负载场景：</strong>帧率提升同样显著，达到40-60帧，有效杜绝卡顿。
                                                                                                                                             </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    {}
                {}
                {}
                <section
                    ref={sectionRefs.physics}
                    className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>物理与交互系统
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>生物力学系统重铸与沉浸式载具交互系统，提供更真实、更符合直觉的物理体验
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.p>
                        </div>
                        <div className="space-y-12">
                            {physicsInteractionData.map((system, index) => <motion.div
                                key={system.title}
                                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}
                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}>
                                <h3 className="text-2xl font-bold mb-4">{system.title}</h3>
                                <p
                                    className={`mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    {system.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {system.items.map((item, idx) => <div
                                        key={item.subtitle}
                                        className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"}`}>
                                        <h4 className="text-lg font-bold mb-4">{item.subtitle}</h4>
                                        <ul className="space-y-3">
                                            {item.points.map((point, pointIdx) => <li key={pointIdx} className="flex items-start">
                                                <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                                                <span
                                                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                                    {point}
                                                </span>
                                            </li>)}
                                        </ul>
                                    </div>)}
                                </div>
                            </motion.div>)}
                        </div>
                    </div>
                </section>
                {}
                <section
                    ref={sectionRefs.roleplay}
                    className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>角色扮演与社交系统
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>深度角色扮演菜单、动态职业模拟与社交关系网络系统，打造丰富的虚拟人生体验
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {roleplaySystemData.map((system, index) => <motion.div
                                key={system.title}
                                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"}`}
                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}
                                whileHover={{
                                    y: -5
                                }}>
                                <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-amber-500/20 text-amber-500 text-2xl`}>
                                    <i className={`fa-solid ${system.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{system.title}</h3>
                                <p
                                    className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    {system.description}
                                </p>
                                <ul className="space-y-4">
                                    {system.features.map((feature, idx) => <li key={idx} className="flex items-start">
                                        <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                                        <span
                                            className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                            {feature}
                                        </span>
                                    </li>)}
                                </ul>
                            </motion.div>)}
                        </div>
                        <motion.div
                            className={`mt-12 p-8 rounded-2xl ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.3
                            }}>
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <i className="fa-solid fa-info-circle text-amber-500 mr-2"></i>动态社交关系网络系统特色
                                                                                                                                                                                                                                                                                                                                                                                                             </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold mb-2">关系建立与维护</h4>
                                    <ul
                                        className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>通过手机"Lifeinvader"添加行人联系人</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>通过短信安排约会，提升关系</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>尊重值系统：成功活动提升，不当行为降低</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">沉浸式活动</h4>
                                    <ul
                                        className={`space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>携手散步、相拥而坐、瑜伽、休息</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>在海滩或营地用吉他演奏MP3</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fa-solid fa-circle text-xs mt-1 mr-2"></i>
                                            <span>前往布莱恩郡指定露营点露营</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                 {}
                {}
                {}

                {}
                <section
                    ref={sectionRefs.rdePev}
                    className={`py-20 ${theme === "dark" ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-b from-gray-50 via-white to-gray-50"} relative overflow-hidden`}>
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full filter blur-[100px]"></div>
                        <div
                            className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-red-500/10 rounded-full filter blur-[100px]"></div>
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className="text-center mb-16"
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5
                            }}>
                               <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block">
                                  <span>RDE + PEV 执法与战术AI系统</span>
                              </h2>
                            <p
                                className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>本整合包集成了当今最先进的执法AI与战术系统，彻底革新游戏中的对抗体验
                                                            </p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: -30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.7
                                }}
                                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800/90 border border-gray-700" : "bg-white shadow-xl"}`}>
                                <div className="flex items-center mb-6">
                                    <div
                                        className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                                        <i className="fa-solid fa-shield-alt text-blue-500 text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold">RDE</h3>
                                </div>
                                <p
                                    className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>RDE 是一套全面的执法与驾驶行为模拟系统，为游戏带来前所未有的真实感与挑战性。
                                                                    </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">10星通缉与渐进式战术响应</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>通缉等级上限延伸至10星，根据不同通缉等级部署不同规模的执法力量，从普通巡警到直升机和特警
                                                                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">全面革新的执法机构体系</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>整合了洛圣都警察局、县治安官、高速公路巡逻、FIB等多个执法机构，每个机构都有独特的装备和响应模式
                                                                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-blue-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">活跃动态世界生态</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>警察会执行日常巡逻、交通检查、紧急响应等任务，创造一个充满活力的游戏世界
                                                                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.7
                                }}
                                className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-800/90 border border-gray-700" : "bg-white shadow-xl"}`}>
                                <div className="flex items-center mb-6">
                                    <div
                                        className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                                        <i className="fa-solid fa-user-secret text-red-500 text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold">PEV</h3>
                                </div>
                                <p
                                    className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>PEV 是一套高级的警察AI增强模组，专注于提供沉浸式搜索与潜行体验。
                                                                    </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-red-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">沉浸式执法搜索系统</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>引入IV风格的通缉半径机制，执法人员会在玩家最后已知位置进行搜查，一段时间后搜索范围会向周边扩展
                                                                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-red-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">功能完整的潜行机制</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>AI拥有符合现实逻辑的感知能力，消音武器与近战武器能如其设定般发挥作用，仅限"目击者"能够报案
                                                                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-red-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">Aggressive AI - PEV战术压制增强</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>将普通警察升级为战术响应员，特警升级为军事化突击队，实现侧翼包抄、持续火力压制与冲锋等战术行为
                                                                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <i className="fa-solid fa-circle text-red-500 text-xs mt-2 mr-2"></i>
                                        <div>
                                            <span className="font-bold">更具活力的洛圣都世界生态</span>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-1`}>增强了行人互动、驾驶行为及随机事件频率，使洛圣都日夜充满生机
                                                                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                        <motion.div
                            className={`rounded-2xl p-8 mb-16 ${theme === "dark" ? "bg-gray-800/90 border border-gray-700" : "bg-white shadow-xl"}`}
                            initial={{
                                opacity: 0,
                                y: 30
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.7
                            }}>
                            <h3 className="text-2xl font-bold mb-6 text-center">RDE + PEV 深度集成优势</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                        <i className="fa-solid fa-sitemap text-purple-500 text-2xl"></i>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">协同作战系统</h4>
                                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>RDE与PEV的AI系统无缝协作，形成多层次、立体化的执法网络，提供前所未有的挑战性
                                                                            </p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                        <i className="fa-solid fa-brain text-green-500 text-2xl"></i>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">智能决策引擎</h4>
                                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>执法单位会根据环境、玩家行为和可用资源做出动态决策，每次遭遇都独一无二
                                                                            </p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                                        <i className="fa-solid fa-gamepad text-amber-500 text-2xl"></i>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">沉浸式体验</h4>
                                    <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>从无线电通讯到战术手势，每个细节都经过精心设计，让玩家感觉置身于真实的执法环境中
                                                                            </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section
                    ref={sectionRefs.police}
                    className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">{policeModData.title}</h2>
                                <span
                                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-6 ${theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                                    {policeModData.version}
                                </span>
                            </motion.div>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>
                                {policeModData.description}
                            </motion.p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <motion.div
                                className="lg:w-1/2"
                                initial={{
                                    opacity: 0,
                                    x: -30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>
                                <div className="rounded-2xl overflow-hidden shadow-xl">
                                    <img
                                        src={policeModData.image}
                                        alt={policeModData.title}
                                        className="w-full h-auto" />
                                </div>
                                <motion.div
                                    className={`mt-8 p-6 rounded-2xl ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-lg"}`}
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    viewport={{
                                        once: true
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3
                                    }}>
                                    <h3 className="text-xl font-bold mb-4">操作说明</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {policeModData.controls.map((control, index) => <div
                                            key={index}
                                            className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                                            <div
                                                className={`font-mono font-bold ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}>
                                                {control.key}
                                            </div>
                                            <div
                                                className={`mt-1 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                                {control.function}
                                            </div>
                                        </div>)}
                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="lg:w-1/2"
                                initial={{
                                    opacity: 0,
                                    x: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>
                                <div
                                    className={`rounded-2xl p-8 h-full ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-xl"}`}>
                                    <h3 className="text-2xl font-bold mb-6">主要功能</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {policeModData.features.map((feature, index) => <motion.div
                                            key={index}
                                            className={`p-5 rounded-xl ${theme === "dark" ? "bg-gray-700 hover:bg-gray-650" : "bg-gray-50 hover:bg-gray-100"} transition-colors`}
                                            initial={{
                                                opacity: 0,
                                                y: 10
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            viewport={{
                                                once: true
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05
                                            }}>
                                            <h4 className="font-bold mb-2">{feature.name}</h4>
                                            <p
                                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                                {feature.description}
                                            </p>
                                        </motion.div>)}
                                    </div>
                                    <motion.div
                                        className={`mt-8 p-5 rounded-xl ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}
                                        initial={{
                                            opacity: 0,
                                            y: 20
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        viewport={{
                                            once: true
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.5
                                        }}>
                                        <h4 className="font-bold mb-2 flex items-center">
                                            <i className="fa-solid fa-lightbulb text-amber-500 mr-2"></i>模组特色
                                                                                                                                                                                                                            </h4>
                                        <p
                                            className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>与追求真实性的警察模拟模组不同，本模组以"混乱"为核心主题，旨在提供电影式的激烈交火体验。所有内容均由EliteLee玩家仓库独家汉化、独家整合。
                                                                                                                                                                                                                            </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
                {}
                <section
                    ref={sectionRefs.updates}
                    className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>版本更新日志
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>每一次更新，均致力于系统性调优、内容扩充与体验深化，确保您所获得的整合包始终处于最佳状态
                                                                                                                                                                                                                                                                                                                                                                                                             </motion.p>
                        </div>
                        <div className="space-y-8 max-w-4xl mx-auto">
                            {updateLogs.map((update, index) => <motion.div
                                key={update.version}
                                className={`rounded-2xl overflow-hidden ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white shadow-lg"}`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1
                                }}>
                                <div
                                    className={`p-4 flex justify-between items-center ${index === 0 ? theme === "dark" ? "bg-amber-900/30" : "bg-amber-50" : theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                                    <div className="flex items-center">
                                        <span
                                            className={`text-lg font-bold ${index === 0 ? theme === "dark" ? "text-amber-400" : "text-amber-600" : ""}`}>
                                            {update.version}
                                        </span>
                                        {index === 0 && <span
                                            className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${theme === "dark" ? "bg-amber-500 text-black" : "bg-amber-500 text-white"}`}>最新
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       </span>}
                                    </div>
                                    <></>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold mb-4">{update.highlights}</h4>
                                    <ul className="space-y-2">
                                        {update.details.map((detail, idx) => <li key={idx} className="flex items-start">
                                            <i className="fa-solid fa-circle text-amber-500 text-xs mt-2 mr-2"></i>
                                            <span
                                                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                                {detail}
                                            </span>
                                        </li>)}
                                    </ul>
                                </div>
                            </motion.div>)}
                        </div>
                        <motion.div
                            className={`mt-12 text-center`}
                            initial={{
                                opacity: 0
                            }}
                            whileInView={{
                                opacity: 1
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5
                            }}>
                            <p
                                className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>这只是持续更新计划的一部分。选择EliteLee典藏级现实整合包，意味着您的游戏世界将不断变得更好、更真实、更稳定。
                                                                                                                                                                                                                                                                                                                                                                                                             </p>
                            <></>
                        </motion.div>
                    </div>
                </section>
                {}
                <section
                    ref={sectionRefs.modifiers}
                    className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>内置修改器支持
                                                                                                                                                                                                                                                                                                                                                                                                              </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-6`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>为确保功能扩展的便捷性与体验的完整性，本整合包已内置多款经过深度汉化与兼容性调校的实用修改器。</motion.p>
                        </div>
                        <div
                            className={`p-6 rounded-2xl max-w-3xl mx-auto ${theme === "dark" ? "bg-blue-900/10 border border-blue-700/30" : "bg-blue-50 border border-blue-100"}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                 <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">QV修改器</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>默认快捷键F3
                                                                              </p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>对天气进行自定义修改
                                                                              </p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">真实车牌使用</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                                                                </p>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>通过 F8 呼出Menyoo修改器
                                                                                </p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>自定载具-车牌 使用
                                                                                </p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">NT修改器</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>默认快捷键F4
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>主要用于刷取整合包内新增的载具
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">幽灵修改器</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>默认快捷键F5</p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>提供更多载具与功能修改选项
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">横冲直撞修改器</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>默认快捷键F7
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>提供多种游戏功能与行为修改</p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2">Menyoo修改器</h4>
                                    <p
                                        className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>默认快捷键F8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </p>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>提供强大世界编辑与角色自定义</p>
                                </div>
                            </div>
                            {}
                        </div>
                    </div>
                </section>

                <section
                    ref={sectionRefs.pricing}
                    className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5
                                }}>订阅方案
                                                                                                                                                                                                                                                                                                                                                                                                              </motion.h2>
                            <motion.p
                                className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-6`}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2
                                }}>EliteLee玩家仓库持续发布更新与内容扩展，推荐订阅版，可确保您游戏体验始终更丰富、更稳定</motion.p>
                            <div className="flex justify-center items-center">
                                <motion.div
                                    className={`px-6 py-3 rounded-full ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white shadow-md"}`}
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    viewport={{
                                        once: true
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.3
                                    }}>
                                    <span className="text-sm font-medium">当前版本: v1.0.7</span>
                                    <span className="mx-2 text-amber-500">•</span>
                                    <span className="text-sm text-amber-500">下版本: v1.0.8 (2026年2月)</span>
                                </motion.div>
                            </div>
                        </div>
                        <div
                            className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
                            {pricingPlans.map((plan, index) => <motion.div
                                key={plan.title}
                                className={`flex-1 rounded-2xl overflow-hidden relative ${plan.isPopular ? `${theme === "dark" ? "bg-gray-800 ring-2 ring-amber-500" : "bg-white shadow-xl"}` : `${theme === "dark" ? "bg-gray-800" : "bg-white shadow-lg"}`} transition-all duration-300`}
                                initial={{
                                    opacity: 0,
                                    y: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0
                                }}
                                viewport={{
                                    once: true
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.2
                                }}
                                whileHover={{
                                    y: -5
                                }}>
                                {plan.isPopular && <div
                                    className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">推荐
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>}
                                <div className="p-8">
                                    <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                                    <p
                                        className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{plan.description}</p>
                                    <div className="mb-8">
                                        <span className="text-4xl font-bold">¥{plan.price}</span>
                                        <span className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                            {plan.isPopular ? " / 永久" : " / 一次性"}
                                        </span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, idx) => <li key={idx} className="flex items-start">
                                            <i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
                                            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                                                {feature}
                                            </span>
                                        </li>)}
                                    </ul>
                                    <button
                                        onClick={() => scrollToSection("payment")}
                                        className={`w-full py-3 rounded-xl font-bold text-white relative group ${plan.isPopular ? "bg-amber-500 hover:bg-amber-600 transition-colors duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40" : `${theme === "dark" ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600 text-white"} transition-colors duration-300`}`}>
                                        <span className={`absolute inset-0 rounded-xl blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-300 ${plan.isPopular ? "bg-amber-500" : (theme === "dark" ? "bg-blue-700" : "bg-blue-500")}`}></span>
                                        <span className="relative z-10">{plan.buttonText}</span>
                                    </button>
                                </div>
                            </motion.div>)}
                        </div>
                        <div
                            className={`mt-16 p-6 rounded-2xl max-w-3xl mx-auto ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}>
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <i className="fa-solid fa-shield-alt text-amber-500 mr-2"></i>购买保障
                                                                                                                                                                                                                                                                                                                                                                                                              </h3>
                            <p
                                className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>由整合包作者EliteLee玩家仓库直接提供远程协助，确保可玩，可根据硬件进行性能优化。
                                                                                                                                                                                                                                                                                                                                                                                                              </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2 flex items-center">
                                        <i className="fa-solid fa-handshake text-amber-500 mr-2"></i>支付方式
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </h4>
                                    <ul
                                        className={`space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        <li className="flex items-center">
                                            <i className="fa-solid fa-circle text-xs mr-2"></i>
                                            <span>扫码支付</span>
                                        </li>
                                        <li className="flex items-center">
                                            <i className="fa-solid fa-circle text-xs mr-2"></i>
                                            <span>闲鱼平台交易</span>
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-white shadow-sm"}`}>
                                    <h4 className="font-bold mb-2 flex items-center">
                                        <i className="fa-solid fa-headset text-amber-500 mr-2"></i>售后服务
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </h4>
                                    <ul
                                        className={`space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                        <li className="flex items-center">
                                            <i className="fa-solid fa-circle text-xs mr-2"></i>
                                            <span>技术支持：EliteLee24（微信）</span>
                                        </li>
                                        <li className="flex items-center">
                                            <i className="fa-solid fa-circle text-xs mr-2"></i>
                                            <span>订阅用户专属QQ频道</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <section
                ref={sectionRefs.payment}
                className={`py-20 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0
                        }}
                        viewport={{
                            once: true
                        }}
                        transition={{
                            duration: 0.5
                        }}>
                         <h2 className="text-3xl md:text-4xl font-bold mb-4">支付与协议</h2>
                    </motion.div>
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            className={`rounded-2xl p-8 mb-10 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.1
                            }}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="flex flex-col items-center text-center">
                                    <h4 className="text-xl font-bold mb-4">扫码支付</h4>
                                    <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                                        <img
                                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/image_20260112122145.png"
                                            alt="支付宝支付码"
                                            className="w-full h-auto" />
                                    </div>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>支付宝扫码支付</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <h4 className="text-xl font-bold mb-4">扫码支付</h4>
                                    <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                                        <img
                                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/image_20260112122149.png"
                                            alt="微信支付码"
                                            className="w-full h-auto" />
                                    </div>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>微信扫码支付</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <h4 className="text-xl font-bold mb-4">QQ频道</h4>
                                    <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                                        <img
                                            src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/image_20260112122152.png"
                                            alt="QQ频道二维码"
                                            className="w-full h-auto" />
                                    </div>
                                    <p
                                        className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>订阅版用户专属QQ频道</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center w-full">
                                <h4 className="text-xl font-bold mb-4">平台交易</h4>
                                <div
                                    className={`p-6 rounded-xl w-full ${theme === "dark" ? "bg-blue-900/20 border border-blue-700/30" : "bg-blue-50 border border-blue-100"} shadow-md`}>
                                    <p
                                        className={`${theme === "dark" ? "text-blue-200" : "text-blue-800"} font-medium`}>手机前往"闲鱼"APP，搜索整合包作者 EliteLee玩家仓库 进行下单购买</p>
                                </div>
                                <div
                                    className={`mt-6 text-center w-full p-6 rounded-xl ${theme === "dark" ? "bg-amber-900/20 border border-amber-700/30" : "bg-amber-50 border border-amber-100"} shadow-md`}>
                                    <p className={theme === "dark" ? "text-amber-200" : "text-amber-800"}>扫描上方二维码完成支付，添加作者个人微信 EliteLee24，并备注来意。交易完成后，订阅版用户凭订单号入"EliteLee典藏级现实整合包"QQ频道，确保及时获取更新</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className={`rounded-2xl p-8 ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-100"}`}
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.2
                            }}>
                            <h3 className="text-2xl font-bold mb-6">《EliteLee玩家仓库服务协议》</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xl font-bold mb-3">前言</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>感谢您选用 EliteLee玩家仓库 的产品与服务。为确保您在清晰知晓各方权利与责任的前提下获得优质体验，请您在完成订阅/购买前，务必审慎阅读并理解本协议的全部内容。您的订阅/购买行为即被视为对本协议的完全接受与同意。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">一、知识产权声明</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>EliteLee玩家仓库 所提供的整合包、模组及相关资源，其内所含的全部游戏素材、代码及内容的著作权、商标权等一切知识产权，均归属于其各自的原始创作者（包括但不限于Rockstar Games）所有。EliteLee玩家仓库 作为技术服务提供方，对其基于原始作品进行的资源整合、编译优化、适配支持及独创性设计享有相应权益。本产品仅限于个人离线模式下的学习与技术交流，不得用于任何商业用途。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">二、产品性质与退款政策</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>本产品属于一经交付即无法退货的数字化虚拟商品。鉴于其电子属性与可复制性，您在完成订阅/购买后，将无法办理退款。请您在支付前务必确认个人设备满足运行要求并与自身需求相符。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">三、技术规范与支持边界</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>本整合包已在主流硬件与Windows 10/11系统环境下进行充分测试，旨在确保稳定运行。若出现无法进入游戏等情况，通常与系统环境（如缺少运行库、.Net框架或系统版本过低）有关。在复杂多样的用户环境中，可能出现的偶发性闪退、卡顿或性能波动属于软件领域的已知现象，我将提供合理的技术支持以协助排查，但无法保证绝对的、无间断的稳定性。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">四、使用许可与责任豁免</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>本产品严格限定于单人离线模式使用。整合包已内置防护机制以防止误入线上模式。若用户擅自修改、绕过限制并进入线上模式，因此引发的一切后果（包括但不限于账号封禁、数据丢失）须由用户自行承担。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">五、隐私与数据安全</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>我郑重承诺：本整合包内所有模组均在设计上隔绝网络连接，不存在任何主动收集、传输或上传用户个人信息与本地文件数据的行为。为保障您的权益，请务必通过 EliteLee玩家仓库 官方指定页面或授权平台获取。任何非官方渠道的版本均属非法，无法保证其安全性，并强烈警示其中存在植入恶意代码的风险。</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">六、违约与责任追究</h4>
                                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>严禁任何形式的二次售卖、重新打包及未经授权的分发行为。本产品已内置相应的版权保护技术措施。对于任何侵权行为，保留追究其法律责任并索赔全部损失的权利。</p>
                                </div>
                                <div
                                    className={`p-4 rounded-xl ${theme === "dark" ? "bg-amber-500/10 border border-amber-500/30" : "bg-amber-50 border border-amber-100"}`}>
                                    <h4 className="text-xl font-bold mb-2">最终确认</h4>
                                    <p className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>当您完成订阅/购买，即代表您已透彻理解并同意接受本协议所有条款的法律约束。感谢支持与信任！</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
             <footer
                className={`py-10 border-t ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-1 mb-4 md:mb-0">
                            <img 
                                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/337367286018/attachment/图片1_20260114171033.png" 
                                alt="EliteLee" 
                                className="h-7 md:h-8 object-contain"
                            />
                            <span className="text-lg font-bold">玩家仓库</span>
                        </div>
                        <div
                            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-center md:text-right`}>
                            <p>《EliteLee典藏级现实整合包·传承版》官网</p>
                            <p className="mt-1">© 2026 EliteLee玩家仓库. 保留所有权利。</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        {/* 回到顶部按钮 */}
        <motion.button
          className={`fixed right-6 bottom-6 p-3 rounded-full shadow-lg z-50 ${
            theme === "dark" 
              ? "bg-amber-500 text-white hover:bg-amber-600" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-all duration-300`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: scrollPosition > 500 ? 1 : 0,
            scale: scrollPosition > 500 ? 1 : 0.5,
            pointerEvents: scrollPosition > 500 ? "auto" : "none"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="回到顶部"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </motion.button>
    </ErrorBoundary>
  );
}