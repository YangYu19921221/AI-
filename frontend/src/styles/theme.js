// 主题配置
export const theme = {
  // 主色调
  colors: {
    // 教师端主色调：稳重专业的蓝色系
    teacher: {
      primary: '#2563EB',      // 主要按钮、重点元素
      secondary: '#3B82F6',    // 次要按钮、链接
      accent: '#60A5FA',       // 强调色
      background: '#F8FAFC',   // 背景色
      sidebar: '#1E40AF',      // 侧边栏
      success: '#059669',      // 成功提示
      warning: '#D97706',      // 警告提示
      error: '#DC2626',        // 错误提示
      text: {
        primary: '#1F2937',    // 主要文字
        secondary: '#4B5563',  // 次要文字
        light: '#9CA3AF'       // 浅色文字
      }
    },
    
    // 学生端主色调：活力青春的绿色系
    student: {
      primary: '#059669',      // 主要按钮、重点元素
      secondary: '#10B981',    // 次要按钮、链接
      accent: '#34D399',       // 强调色
      background: '#F9FAFB',   // 背景色
      sidebar: '#047857',      // 侧边栏
      success: '#059669',      // 成功提示
      warning: '#D97706',      // 警告提示
      error: '#DC2626',        // 错误提示
      text: {
        primary: '#1F2937',    // 主要文字
        secondary: '#4B5563',  // 次要文字
        light: '#9CA3AF'       // 浅色文字
      }
    }
  },

  // 圆角
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem'
  },

  // 阴影
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },

  // 动画
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out'
  },

  // 响应式断点
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};
