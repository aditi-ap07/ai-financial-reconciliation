import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js/auto';

export default function GapAnalysisChart({ summary }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const data = Object.entries(summary.exception_summary.byType).map(([key, count]) => ({ key, count }));
    if (!data.length) return;

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.key),
        datasets: [{ data: data.map((d) => d.count), backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#a78bfa'] }],
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
      },
    });

    return () => chart.destroy();
  }, [summary]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Gap Analysis Chart</h2>
      <canvas ref={canvasRef} width="400" height="250" />
    </div>
  );
}

GapAnalysisChart.propTypes = {
  summary: PropTypes.object.isRequired,
};
