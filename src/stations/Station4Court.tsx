// Station4Court.tsx
import { useState } from "react";
import "./Station4Court.css";

interface Props {
  onSuccess: () => void;
}

const argumentsList = [
  { id: 1, text: "Она не знала меры в своих желаниях", side: "accusation" },
  {
    id: 2,
    text: "Она хотела лучшей жизни для себя и старика",
    side: "defense",
  },
  {
    id: 3,
    text: "Она не благодарила золотую рыбку и старика",
    side: "accusation",
  },
  { id: 4, text: "Она мечтала быть счастливой и богатой", side: "defense" },
  {
    id: 5,
    text: "Из-за её жадности старик остался у разбитого корыта",
    side: "accusation",
  },
  {
    id: 6,
    text: "Она просто не понимала, когда нужно остановиться",
    side: "defense",
  },
] as const;

type Side = "accusation" | "defense" | null;

export default function Station4Court({ onSuccess }: Props) {
  const [placements, setPlacements] = useState<Record<number, Side>>({});

  const allPlaced = argumentsList.every(
    (arg) => placements[arg.id] !== undefined,
  );

  const accusationCount = argumentsList.filter(
    (arg) => placements[arg.id] === "accusation",
  ).length;

  const defenseCount = argumentsList.filter(
    (arg) => placements[arg.id] === "defense",
  ).length;

  // Успех — если больше аргументов в защиту или поровну
  // (можно изменить логику на строгое большинство обвинения — если нужно)
  const isSuccess = allPlaced && defenseCount >= accusationCount;

  const handleDrop = (argId: number, side: Side) => {
    setPlacements((prev) => ({ ...prev, [argId]: side }));
  };

  const getArgsForSide = (side: Side) =>
    argumentsList.filter((arg) => placements[arg.id] === side);

  return (
    <div className="station4-court">
      <h1>Суд над старухой ⚖️</h1>
      <p>
        Перетащите каждый аргумент в колонку <strong>Обвинение</strong> или{" "}
        <strong>Защита</strong>
      </p>

      <div className="arguments-pool">
        <h2>Аргументы</h2>
        <div className="args-list">
          {argumentsList.map((arg) =>
            placements[arg.id] ? null : (
              <div
                key={arg.id}
                className="arg-card"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("argId", arg.id.toString());
                }}
              >
                {arg.text}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="court-board">
        <div className="column accusation">
          <h2>Обвинение</h2>
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const argId = Number(e.dataTransfer.getData("argId"));
              handleDrop(argId, "accusation");
            }}
          >
            {getArgsForSide("accusation").map((arg) => (
              <div key={arg.id} className="placed-arg accusation">
                {arg.text}
              </div>
            ))}
          </div>
        </div>

        <div className="column defense">
          <h2>Защита</h2>
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const argId = Number(e.dataTransfer.getData("argId"));
              handleDrop(argId, "defense");
            }}
          >
            {getArgsForSide("defense").map((arg) => (
              <div key={arg.id} className="placed-arg defense">
                {arg.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="control-panel">
        {!allPlaced ? (
          <p className="info">Расставьте все аргументы</p>
        ) : (
          <div className="result-area">
            {isSuccess ? (
              <div className="success-area">
                <div className="big-letter">Г</div>
                <p>Молодцы! Четвёртая буква найдена!</p>
                <p className="verdict">
                  Старуху оправдали (или оправдали частично)
                </p>

                <button className="btn next" onClick={onSuccess}>
                  Дальше →
                </button>
              </div>
            ) : (
              <div className="error-area">
                <p>Старуху осудили строго</p>
                <button className="btn retry" onClick={() => setPlacements({})}>
                  Пересудить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
