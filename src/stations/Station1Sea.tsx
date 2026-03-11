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

  const [selectedDesire, setSelectedDesire] = useState<number | null>(null);

  const allFilled = seaStates.every((s) => placements[s] !== null);

  const isAllCorrect =
    checked &&
    seaStates.every((s) => {
      const p = placements[s];
      return p && desires.find((d) => d.id === p.id)?.correct === s;
    });

  // Выбор желания (первый клик)
  const handleSelectDesire = (id: number) => {
    if (selectedDesire === id) {
      setSelectedDesire(null); // отменить выбор
    } else {
      setSelectedDesire(id);
    }
  };

  // Второй клик — размещение
  const handlePlace = (target: SeaState) => {
    if (selectedDesire === null) return;

    const item = desires.find((d) => d.id === selectedDesire);
    if (!item) return;

    // Если в ячейке уже что-то есть — ничего не делаем (или можно заменить)
    if (placements[target] !== null) return;

    setPlacements((prev) => ({
      ...prev,
      [target]: { id: item.id, text: item.text },
    }));

    const isCorrect = item.correct === target;

    setFeedback((prev) => ({
      ...prev,
      [target]: isCorrect ? "ok" : "wrong",
    }));

    if (!isCorrect) {
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [target]: null }));
      }, 900);
    }

    // Снимаем выбор после размещения
    setSelectedDesire(null);
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
    setPlacements(
      seaStates.reduce(
        (acc, s) => ({ ...acc, [s]: null }),
        {} as Record<SeaState, DragItem | null>,
      ),
    );
    setFeedback(
      seaStates.reduce(
        (acc, s) => ({ ...acc, [s]: null }),
        {} as Record<SeaState, "ok" | "wrong" | null>,
      ),
    );
    setSelectedDesire(null);
  };

  return (
    <div className="station1-sea">
      <h1>Море волнуется</h1>
      <p>Кликните на желание, потом на состояние моря</p>

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
                  className={`card desire ${selectedDesire === item.id ? "selected" : ""}`}
                  onClick={() => handleSelectDesire(item.id)}
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
                className={`card target ${selectedDesire !== null ? "selectable" : ""}`}
                style={getStyle(state)}
                onClick={() => selectedDesire !== null && handlePlace(state)}
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
