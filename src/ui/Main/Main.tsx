import { memo, useCallback, useMemo } from 'react';
import mainS from './mainS.module.scss';
import { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function Main() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [canvasPhase, setCanvasPhase] = useState<HTMLCanvasElement | null>(null);
  const [preyEquation, setPreyEquation] = useState<HTMLDivElement | null>(null);
  const [predatorEquation, setPredatorEquation] = useState<HTMLDivElement | null>(null);

  // prey population
  const [x, setX] = useState<number | null>(10);
  // predator population
  const [y, setY] = useState<number | null>(2);
  // prey birth rate
  const [alpha, setAlpha] = useState<number | null>(1.1);
  // predator death rate
  const [gamma, setGamma] = useState<number | null>(0.4);
  // killing prey coefficient
  const [beta, setBeta] = useState<number | null>(0.4);
  // reproduction predator coefficient
  const [delta, setDelta] = useState<number | null>(0.1);

  useEffect(() => {
    if (!preyEquation || !predatorEquation) return;

    katex.render(`\\frac{dx}{dt} = (${alpha === null ? '\\alpha' : alpha} - ${beta === null ? '\\beta' : beta} * ${y === null ? 'y' : y}) * ${x === null ? 'x' : x}`, preyEquation, {
      throwOnError: false,
    });
    katex.render(`\\frac{dy}{dt} = (-${gamma === null ? '\\gamma' : gamma} + ${delta === null ? '\\delta' : delta} * ${x === null ? 'x' : x}) * ${y === null ? 'y' : y}`, predatorEquation, {
      throwOnError: false,
    });
  }, [preyEquation, predatorEquation, y, x, beta, alpha, gamma, delta]);

  const data = useMemo<[number[], number[], number[]]>(() => {
    if (x === null || y === null || alpha === null || beta === null || gamma === null || delta === null) return [[0], [0], [0]];

    const xArr: number[] = [x];
    const yArr: number[] = [y];

    let xCurr = x;
    let yCurr = y;

    const lengthArr: number[] = [0];

    const dt = 0.01;

    for (let i = 0; i < 3000; i++) {
      const dx1 = (alpha - beta * yCurr) * xCurr;
      const dy1 = (-gamma + delta * xCurr) * yCurr;

      const x2 = xCurr + 0.5 * dx1 * dt;
      const y2 = yCurr + 0.5 * dy1 * dt;
      const dx2 = (alpha - beta * y2) * x2;
      const dy2 = (-gamma + delta * x2) * y2;

      const x3 = xCurr + 0.5 * dx2 * dt;
      const y3 = yCurr + 0.5 * dy2 * dt;
      const dx3 = (alpha - beta * y3) * x3;
      const dy3 = (-gamma + delta * x3) * y3;

      const x4 = xCurr + dx3 * dt;
      const y4 = yCurr + dy3 * dt;
      const dx4 = (alpha - beta * y4) * x4;
      const dy4 = (-gamma + delta * x4) * y4;

      xCurr += (dt / 6) * (dx1 + 2 * dx2 + 2 * dx3 + dx4);
      yCurr += (dt / 6) * (dy1 + 2 * dy2 + 2 * dy3 + dy4);

      xArr.push(xCurr);
      yArr.push(yCurr);

      lengthArr.push(i + 1);
    }

    console.log(xArr);
    console.log(yArr);
    console.log(lengthArr);

    return [xArr, yArr, lengthArr];
  }, [y, x, beta, alpha, gamma, delta]);

  useEffect(() => {
    let chartInstance: Chart | null = null;
    if (canvas) {
      chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
          labels: data[2],
          datasets: [
            {
              label: 'Хищник',
              data: data[1],
              backgroundColor: 'rgba(180, 82, 82, 1)',
              borderColor: 'rgba(180, 82, 82, 0.5)',
              pointRadius: 0,
            },
            {
              label: 'Жертва',
              data: data[0],
              borderColor: 'rgba(82, 180, 103, 0.5)',
              backgroundColor: 'rgba(82, 180, 103, 1)',
              pointRadius: 0,
            },
          ],
        },
        options: {
          animation: false,
          normalized: true,
          elements: {
            line: {
              tension: 0,
            },
          },
          scales: {
            x: {
              type: 'linear',
              grid: {
                color: 'rgb(77, 77, 77)',
              },
              ticks: {
                font: {
                  family: 'Geist',
                },
                stepSize: 300,
              },
            },
            y: {
              grid: {
                color: 'rgb(77, 77, 77)',
              },
              ticks: {
                font: {
                  family: 'Geist',
                },
                stepSize: 1,
              },
              suggestedMin: 0,
            },
          },

          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Geist',
                },
                color: 'white',
              },
            },
            tooltip: {
              titleFont: {
                family: 'Geist',
              },
              bodyFont: {
                family: 'Geist',
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [canvas, data]);

  useEffect(() => {
    if (canvasPhase && data[0].length > 0) {
      const phaseData = data[0].map((xVal, index) => ({
        x: xVal,
        y: data[1][index],
      }));

      const chartInstance = new Chart(canvasPhase, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Фазовый портрет',
              data: phaseData,
              borderColor: 'rgba(180, 150, 255, 0.8)',
              backgroundColor: 'rgba(180, 150, 255, 1)',
              pointRadius: 0,
            },
          ],
        },
        options: {
          animation: false,
          elements: {
            line: {
              tension: 0,
            },
          },
          scales: {
            x: {
              type: 'linear',
              grid: {
                color: 'rgb(77, 77, 77)',
              },
              ticks: {
                font: {
                  family: 'Geist',
                },
              },
              title: {
                display: true,
                text: 'Жертва (x)',
                color: 'white',
                font: {
                  family: 'Geist',
                },
              },
            },
            y: {
              grid: {
                color: 'rgb(77, 77, 77)',
              },
              ticks: {
                font: {
                  family: 'Geist',
                },
                stepSize: 1,
              },
              title: {
                display: true,
                text: 'Хищник (y)',
                color: 'white',
                font: {
                  family: 'Geist',
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Geist',
                },
                color: 'white',
              },
            },
            tooltip: {
              titleFont: {
                family: 'Geist',
              },
              bodyFont: {
                family: 'Geist',
              },
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [canvasPhase, data]);

  return (
    <>
      <div className={mainS.container}>
        <div className={mainS.equationContainer}>
          <div
            className={mainS.equation}
            ref={setPreyEquation}
          ></div>
          <div
            className={mainS.equation}
            ref={setPredatorEquation}
          ></div>
        </div>
        <div className={mainS.containerMainContent}>
          <div className={mainS.canvasContainer}>
            <div className={mainS.canvasCover}>
              <canvas
                className={mainS.canvas}
                ref={setCanvas}
              ></canvas>
            </div>
            <div className={mainS.canvasCover}>
              <canvas
                className={mainS.canvas}
                ref={setCanvasPhase}
              ></canvas>
            </div>
          </div>
          <div className={mainS.actionsContainer}>
            <div className={mainS.variables__group}>
              <div className={mainS.variables}>
                <h3 className={mainS.variables__heading}>Популяция:</h3>
                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    x (Количество жертв)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setX(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={x}
                  />
                </div>
                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    y (Количество хищников)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setY(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={y}
                  />
                </div>
              </div>

              <div className={mainS.variables}>
                <h3 className={mainS.variables__heading}>Коэффициенты:</h3>

                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    α (Коэффициент рождаемости жертв)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setAlpha(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={alpha}
                  />
                </div>
                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    β (Коэффициент убийства жертвы хищником)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setBeta(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={beta}
                  />
                </div>
                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    γ (Коэффициент убыли хищников)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setGamma(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={gamma}
                  />
                </div>
                <div className={mainS.variableContainer}>
                  <label
                    className={mainS.variable__label}
                    htmlFor=''
                  >
                    δ (Коэффициент способности воспроизводства хищников)
                  </label>
                  <input
                    className={mainS.variable__input}
                    type='number'
                    name=''
                    id=''
                    onChange={(e) => setDelta(e.target.value.length === 0 ? null : Number(e.target.value))}
                    value={delta}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(Main);
