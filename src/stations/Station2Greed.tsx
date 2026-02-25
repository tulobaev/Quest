import { useState } from "react";
import "./Station2GreedLadder.css";

interface Props {
  onSuccess: () => void;
}

const wishes = [
  { id: 4, text: "Царица" },
  { id: 1, text: "Новое корыто" },
  { id: 5, text: "Владычица морская" },
  { id: 2, text: "Новая изба" },
  { id: 3, text: "Дворянка" },
] as const;

const correctOrderIds = [1, 2, 3, 4, 5];

export default function Station2GreedLadder({ onSuccess }: Props) {
  const [order, setOrder] = useState<number[]>(() => wishes.map((w) => w.id));
  const [checked, setChecked] = useState(false);

  const isCorrect = JSON.stringify(order) === JSON.stringify(correctOrderIds);

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (checked) return;

    setOrder((prev) => {
      const newOrder = [...prev];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      return newOrder;
    });
  };

  const handleCheck = () => {
    if (checked) return;
    setChecked(true);
  };

  const getWishText = (id: number) => wishes.find((w) => w.id === id)!.text;

  return (
    <div className="station2-greed">
      <h1>Лесенка жадности</h1>
      <p>
        Расположите желания старухи по степени жадности — от самого маленького к
        самому большому
      </p>

      <div className="ladder-container">
        <div className="ladder">
          {order.map((id, index) => (
            <div
              key={id}
              className={`step ${checked ? (isCorrect ? "correct" : "wrong") : ""}`}
              draggable={!checked}
              onDragStart={(e) => {
                if (checked) return;
                e.dataTransfer.setData("text/plain", index.toString());
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                if (checked) return;
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("text/plain"));
                moveItem(from, index);
              }}
            >
              <div className="number">{index + 1}</div>
              <div className="wish-text">{getWishText(id)}</div>

              <div className="controls">
                {index > 0 && (
                  <button
                    className="arrow up"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={checked}
                    aria-label="Поднять выше"
                  >
                    ↑
                  </button>
                )}
                {index < order.length - 1 && (
                  <button
                    className="arrow down"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={checked}
                    aria-label="Опустить ниже"
                  >
                    ↓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="control-panel">
        {!checked ? (
          <button
            className="btn check"
            onClick={handleCheck}
            disabled={checked}
          >
            Проверить
          </button>
        ) : isCorrect ? (
          <div className="success-area">
            <div className="big-letter">Л</div>
            <p>Молодцы! Вторая буква найдена!</p>

            <div className="question-block">
              <strong>Подумайте вместе:</strong>
              <br />
              На каком желании старухе лучше было остановиться?
              <br />
              Почему именно на этом?
            </div>

            <button className="btn next" onClick={onSuccess}>
              Дальше →
            </button>
          </div>
        ) : (
          <div className="error-area">
            <p>Есть ошибки… поправьте порядок и попробуйте снова</p>
            <button className="btn retry" onClick={() => setChecked(false)}>
              Ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
