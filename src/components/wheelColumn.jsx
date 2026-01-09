import React, { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';

/**
 * 滚轮选择列组件配置常量（集中管理，便于后续修改）
 * 核心配置说明：
 * 1. 单个选项的固定高度
 * 2. 可视区域内显示的选项数量
 * 3. 上下填充区域的选项数量（用于实现滚动到首尾项时的缓冲效果）
 * 4. 滚动事件节流延迟（减少高频触发，平衡响应速度和性能）
 */
const ITEM_HEIGHT = 40; // 单个选项高度：40px
const VISIBLE_COUNT = 5; // 可视区域显示5个选项
const PADDING_ITEM_COUNT = 2; // 上下各填充2个选项高度的空白区域
const SCROLL_THROTTLE_DELAY = 100; // 滚动节流延迟：100毫秒

/**
 * 滚轮选择列组件（单列滚动选择器，支持值回显和滚动回调）
 * @param {Array} data - 选择数据源（数组格式，默认空数组）
 * @param {*} value - 当前选中值（用于回显和状态同步）
 * @param {Function} onChange - 选中值变化时的回调函数（返回新选中值）
 * @returns {React.Element} 渲染后的滚轮选择列组件
 */
const WheelColumn = ({ data = [], value, onChange }) => {
  // 1. 容器DOM引用：用于获取/操作滚动容器的DOM属性（scrollTop等）
  // 作用：通过ref.current访问真实DOM，实现手动控制滚动位置和获取滚动状态
  const ref = useRef(null);

  // 2. 节流计时器引用：用于保存滚动节流的setTimeout标识，便于后续清理
  // 作用：避免多次触发滚动事件时，产生多个未执行的计时器，导致回调混乱
  const scrollTimerRef = useRef(null);

  // 3. 滚动事件处理函数（使用useCallback缓存，避免重渲染时创建新函数）
  // 核心实现：滚动时计算选中项，通过节流减少onChange高频触发
  const handleScroll = useCallback(() => {
    // 3.1 清理上一次未执行的节流计时器（防抖+节流结合，确保只有最后一次滚动生效）
    // 原理：如果滚动还在持续，清除之前未执行的计时器，只保留最新的
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    // 3.2 开启新的节流计时器，延迟执行核心逻辑
    scrollTimerRef.current = setTimeout(() => {
      // 边界防护：容器不存在或数据源为空时，直接终止执行，避免报错
      if (!ref.current || !data.length) return;

      // 3.3 获取并处理滚动距离（scrollTop），避免越界
      const scrollTop = ref.current.scrollTop; // 获取当前容器滚动的垂直距离（顶部隐藏的高度）
      const maxScrollTop = (data.length - 1) * ITEM_HEIGHT; // 计算最大可滚动距离（最后一项对应的scrollTop）
      // 边界限制：确保scrollTop在0 ~ maxScrollTop之间，避免出现负数或超过最大值
      const clampedScrollTop = Math.max(0, Math.min(scrollTop, maxScrollTop));

      // 3.4 计算当前选中项的索引（核心逻辑）
      // 原理：每个选项高度固定为ITEM_HEIGHT，滚动距离 ÷ 单个选项高度 = 对应的选项索引
      // 使用Math.round()四舍五入：滚动到选项中间位置时，自动对齐到最近的选项（配合scrollSnapAlign生效）
      let index = Math.round(clampedScrollTop / ITEM_HEIGHT);
      // 二次边界限制：确保索引在0 ~ 数据长度-1之间，避免访问data[index]时出现undefined
      index = Math.max(0, Math.min(index, data.length - 1));

      // 3.5 避免无意义的onChange触发（性能优化）
      // 原理：只有当计算出的新值与当前传入的value不一致时，才执行回调
      if (data[index] !== value) {
        // 可选链调用（?.）：兼容onChange未传入的场景，避免"无法调用未定义的函数"报错
        onChange?.(data[index]);
      }

      // 3.6 清理计时器标识：标记当前计时器已执行完成
      scrollTimerRef.current = null;
    }, SCROLL_THROTTLE_DELAY); // 延迟100毫秒执行，减少高频滚动时的回调触发次数
  }, [data, value, onChange]); // useCallback依赖数组：仅当这三个值变化时，才重新创建函数

  // 4. 生命周期钩子：监听value和data变化，实现选中值的自动滚动回显（核心回显逻辑）
  // 触发时机：组件挂载时、value变化时、data变化时
  useEffect(() => {
    // 边界防护：容器未挂载、数据不是数组、数据为空时，直接终止执行
    if (!ref.current || !Array.isArray(data) || data.length === 0) return;

    // 4.1 查找当前value在data中的索引（用于定位滚动位置）
    const targetIndex = data.indexOf(value);

    // 4.2 仅当value在data中存在（索引有效）时，才执行滚动定位
    if (targetIndex >= 0 && targetIndex < data.length) {
      // 计算目标滚动距离：索引 × 单个选项高度（精准定位到该选项的位置）
      const targetScrollTop = targetIndex * ITEM_HEIGHT;

      // 4.3 避免无效滚动操作（性能优化）
      // 原理：当前滚动位置与目标位置一致时，不执行滚动，减少DOM操作
      if (ref.current.scrollTop !== targetScrollTop) {
        // 手动设置容器的scrollTop，实现滚动到目标选项的效果
        ref.current.scrollTop = targetScrollTop;
      }
    }
  }, [value, data]); // 依赖数组：仅当value或data变化时，触发该钩子

  // 5. 生命周期钩子：组件卸载时清理节流计时器（防止内存泄漏）
  // 触发时机：组件从DOM树中移除时
  useEffect(() => {
    // 返回清理函数：React会在组件卸载时自动执行该函数
    return () => {
      // 清理未执行的节流计时器，避免组件卸载后，计时器到期执行无效的回调逻辑
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []); // 空依赖数组：仅在组件挂载时执行一次，返回的清理函数在卸载时执行

  // 6. 统一样式定义（抽离复用，便于维护，减少内联样式冗余）
  // 6.1 滚动容器样式
  const containerSx = {
    height: ITEM_HEIGHT * VISIBLE_COUNT, // 容器高度：可视选项数量 × 单个选项高度（固定可视区域）
    overflowY: 'auto', // 垂直方向滚动（超出容器高度的内容隐藏，可滚动查看）
    scrollSnapType: 'y mandatory', // 滚动吸附类型：垂直方向，强制吸附（核心滚动对齐特性）
    textAlign: 'center', // 文本居中对齐
    overscrollBehavior: 'contain', // 滚动边界行为：包含（避免滚动到顶部/底部时，触发页面整体滚动）
    // 隐藏滚动条（美观优化，不影响滚动功能）：兼容不同浏览器
    '&::-webkit-scrollbar': { display: 'none' }, // 兼容Chrome、Safari等webkit内核浏览器
    msOverflowStyle: 'none', // 兼容IE、Edge浏览器
    scrollbarWidth: 'none', // 兼容Firefox浏览器
  };

  // 6.2 上下填充区域样式（实现滚动缓冲效果，避免首尾项无法居中）
  const paddingBoxSx = {
    height: ITEM_HEIGHT * PADDING_ITEM_COUNT, // 填充区域高度：填充选项数量 × 单个选项高度
  };

  // 6.3 单个选项样式（接收当前item，实现选中态与未选中态的区分）
  const itemBoxSx = (item) => ({
    height: ITEM_HEIGHT, // 选项高度：与配置的单个选项高度一致
    lineHeight: `${ITEM_HEIGHT}px`, // 行高与高度一致，实现文本垂直居中
    scrollSnapAlign: 'center', // 滚动吸附对齐：居中对齐（核心！配合容器的scrollSnapType，实现滚动后选项居中）
    fontSize: 16, // 字体大小
    fontWeight: item === value ? 600 : 400, // 选中项加粗，未选中项常规粗细
    color: item === value ? 'primary.main' : 'text.secondary', // 选中项使用主题主色，未选中项使用次要文本色
    cursor: 'pointer', // 鼠标悬浮时显示手型，提升交互体验
    userSelect: 'none', // 禁止文本选中，避免滚动时误选文本，影响交互体验
  });

  // 7. 组件渲染结构（核心DOM结构，实现滚轮选择的视觉和交互载体）
  return (
    // 滚动容器：绑定ref（获取DOM）、绑定滚动事件（处理滚动逻辑）、应用容器样式
    <Box ref={ref} onScroll={handleScroll} sx={containerSx}>
      {/* 顶部填充区域：实现首项滚动居中的缓冲（无内容，仅占高度） */}
      <Box sx={paddingBoxSx} />

      {/* 选项列表：遍历data数据源，渲染所有可选项目 */}
      {data.map((item, index) => (
        <Box
          // 列表项key：优先使用item，若item有重复，需使用`${item}-${index}`保证唯一性
          key={item}
          // 应用选项样式，传入当前item判断是否为选中态
          sx={itemBoxSx(item)}
        >
          {/* 选项内容：渲染data中的当前项 */}
          {item}
        </Box>
      ))}

      {/* 底部填充区域：实现末项滚动居中的缓冲（无内容，仅占高度） */}
      <Box sx={paddingBoxSx} />
    </Box>
  );
};

// 导出组件，供其他模块引入使用
export default WheelColumn;