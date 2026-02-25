import { useState } from "react";
import "./Station1Sea.css";

interface Props {
  onSuccess: () => void;
}

const desires = [
  { id: 1, text: "Новое корыто", correct: "слегка взволновалось" },
  { id: 2, text: "Новая изба", correct: "помутнело" },
  { id: 3, text: "Дворянка", correct: "неспокойное" },
  { id: 4, text: "Царица", correct: "почернело" },
  { id: 5, text: "Владычица морская", correct: "буря" },
] as const;

const seaStates = [
  "слегка взволновалось",
  "помутнело",
  "неспокойное",
  "почернело",
  "буря",
] as const;

type SeaState = (typeof seaStates)[number];
type DragItem = { id: number; text: string };

export default function Station1Sea({ onSuccess }: Props) {
  const [placements, setPlacements] = useState<
    Record<SeaState, DragItem | null>
  >(() =>
    seaStates.reduce(
      (acc, s) => ({ ...acc, [s]: null }),
      {} as Record<SeaState, DragItem | null>,
    ),
  );

  const [feedback, setFeedback] = useState<
    Record<SeaState, "ok" | "wrong" | null>
  >(() =>
    seaStates.reduce(
      (acc, s) => ({ ...acc, [s]: null }),
      {} as Record<SeaState, "ok" | "wrong" | null>,
    ),
  );

  const [checked, setChecked] = useState(false);

  const allFilled = seaStates.every((s) => placements[s] !== null);

  const isAllCorrect =
    checked &&
    seaStates.every((s) => {
      const p = placements[s];
      return p && desires.find((d) => d.id === p.id)?.correct === s;
    });

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: DragItem,
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: SeaState) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      const item: DragItem = JSON.parse(data);

      setPlacements((prev) => ({ ...prev, [target]: item }));

      const isCorrect =
        desires.find((d) => d.id === item.id)?.correct === target;

      setFeedback((prev) => ({
        ...prev,
        [target]: isCorrect ? "ok" : "wrong",
      }));

      if (!isCorrect) {
        setTimeout(() => {
          setFeedback((prev) => ({ ...prev, [target]: null }));
        }, 900);
      }
    } catch (err) {
      console.warn("Drag parse error", err);
    }
  };

  const getStyle = (state: SeaState) => {
    const f = feedback[state];
    if (f === "ok")
      return { backgroundColor: "#e8f5e9", borderColor: "#4caf50" };
    if (f === "wrong")
      return { backgroundColor: "#ffebee", borderColor: "#ef5350" };
    return {};
  };

  const handleCheck = () => {
    if (!allFilled) return;
    setChecked(true);
  };

  const handleRetry = () => {
    setChecked(false);
    // Полный сброс размещений
    setPlacements(
      seaStates.reduce(
        (acc, s) => ({ ...acc, [s]: null }),
        {} as Record<SeaState, DragItem | null>,
      ),
    );
    // Полный сброс обратной связи
    setFeedback(
      seaStates.reduce(
        (acc, s) => ({ ...acc, [s]: null }),
        {} as Record<SeaState, "ok" | "wrong" | null>,
      ),
    );
  };

  return (
    <div className="station1-sea">
      <h1>Море волнуется</h1>
      <p>Перетащите каждое желание к нужному состоянию моря</p>

      <div className="board">
        <div className="left-column">
          <h2>Желания старухи</h2>
          <div className="desire-list">
            {desires.map((item) => {
              const used = Object.values(placements).some(
                (p) => p?.id === item.id,
              );
              if (used) return null;
              return (
                <div
                  key={item.id}
                  className="card desire"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                >
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className="right-column">
          <h2>Состояние моря</h2>
          <div className="targets">
            {seaStates.map((state) => (
              <div
                key={state}
                className="card target"
                style={getStyle(state)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, state)}
              >
                <div className="state-name">{state}</div>
                {placements[state] && (
                  <div className="placed">{placements[state]?.text}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="control-panel">
        {!checked ? (
          <button
            className="btn check"
            onClick={handleCheck}
            disabled={!allFilled}
          >
            Проверить
          </button>
        ) : isAllCorrect ? (
          <div className="success">
            <div className="big-letter">Б</div>
            <p>Отлично! Первая буква найдена</p>
            <button className="btn next" onClick={onSuccess}>
              Дальше →
            </button>
          </div>
        ) : (
          <div className="error">
            <p>Есть ошибки… поправьте и попробуйте снова</p>
            <button className="btn retry" onClick={handleRetry}>
              Ещё раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
