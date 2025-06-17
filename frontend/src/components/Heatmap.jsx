import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Heatmap = ({ heatmapData }) => {
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <CalendarHeatmap
      startDate={yearAgo}
      endDate={today}
      values={heatmapData}
      classForValue={value => {
        if (!value || value.count === 0) return 'color-empty';
        if (value.count < 2) return 'color-scale-1';
        if (value.count < 4) return 'color-scale-2';
        if (value.count < 6) return 'color-scale-3';
        return 'color-scale-4';
      }}
      tooltipDataAttrs={value =>
        value.date ? { 'data-tip': `${value.date} — ${value.count} submissions` } : {}
      }
      showWeekdayLabels
    />
  );
};

export default Heatmap;
