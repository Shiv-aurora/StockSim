import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useThemeStore } from '../store/themeStore';

interface ChartProps {
  data: {
    time: string;
    value: number;
  }[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const StockChart: React.FC<ChartProps> = ({ data, colors = {} }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartColors = {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      lineColor: '#2962FF',
      textColor: isDarkMode ? '#d1d5db' : '#4b5563',
      areaTopColor: '#2962FF',
      areaBottomColor: isDarkMode ? 'rgba(41, 98, 255, 0.04)' : 'rgba(41, 98, 255, 0.2)',
      ...colors,
    };

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: chartColors.backgroundColor },
        textColor: chartColors.textColor,
      },
      grid: {
        vertLines: { color: isDarkMode ? '#2a2a2a' : '#e5e7eb' },
        horzLines: { color: isDarkMode ? '#2a2a2a' : '#e5e7eb' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    const newSeries = chart.addAreaSeries({
      lineColor: chartColors.lineColor,
      topColor: chartColors.areaTopColor,
      bottomColor: chartColors.areaBottomColor,
    });
    newSeries.setData(data);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, colors, isDarkMode]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

export default StockChart;