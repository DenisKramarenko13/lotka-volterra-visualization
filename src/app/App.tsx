import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './App.scss';

function App() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvas) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6],
          datasets: [
            {
              label: 'Хищник',
              data: [2, 3, 4, 2, 2, 5],
              borderColor: 'red',
            },
            {
              label: 'Жертва',
              data: [5, 4, 3, 5, 5, 2],
              borderColor: 'blue',
            },
          ],
        },
      });
    }
  }, [canvas]);

  return (
    <>
      <h1>Визуализация модели Лотки–Вольтерры</h1>
      <canvas ref={setCanvas}></canvas>
    </>
  );
}

export default App;
