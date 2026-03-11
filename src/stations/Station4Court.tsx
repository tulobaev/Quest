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

type Side = "accusation" | "defense";

export default function Station4Court({ onSuccess }: Props) {
  const [placements, setPlacements] = useState<Record<number, Side>>({});
  const [selectedArg, setSelectedArg] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedArg(id);
  };

  const handlePlace = (side: Side) => {
    if (selectedArg === null) return;

    setPlacements((prev) => ({
      ...prev,
      [selectedArg]: side,
    }));

    setSelectedArg(null);
  };

  const availableArgs = argumentsList.filter((arg) => !placements[arg.id]);

  const getArgsForSide = (side: Side) =>
    argumentsList.filter((arg) => placements[arg.id] === side);

  const allPlaced = argumentsList.every((arg) => placements[arg.id]);

  const accusationCount = argumentsList.filter(
    (arg) => placements[arg.id] === "accusation",
  ).length;

  const defenseCount = argumentsList.filter(
    (arg) => placements[arg.id] === "defense",
  ).length;

  const isSuccess = allPlaced && defenseCount >= accusationCount;

  return (
    <div className="station4-court">
      <h1>Суд над старухой ⚖️</h1>
      <p>
        Сначала выберите аргумент, затем нажмите колонку{" "}
        <strong>Обвинение</strong> или <strong>Защита</strong>
      </p>

      <div className="arguments-pool">
        <h2>Аргументы</h2>

        <div className="args-list">
          {availableArgs.map((arg) => (
            <div
              key={arg.id}
              className={`arg-card ${selectedArg === arg.id ? "selected" : ""}`}
              onClick={() => handleSelect(arg.id)}
            >
              {arg.text}
            </div>
          ))}
        </div>
      </div>

      <div className="court-board">
        <div
          className="column accusation"
          onClick={() => handlePlace("accusation")}
        >
          <h2>Обвинение</h2>

          <div className="drop-zone">
            {getArgsForSide("accusation").map((arg) => (
              <div key={arg.id} className="placed-arg accusation">
                {arg.text}
              </div>
            ))}
          </div>
        </div>

        <div className="column defense" onClick={() => handlePlace("defense")}>
          <h2>Защита</h2>

          <div className="drop-zone">
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
          <p className="info">Распределите все аргументы</p>
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
