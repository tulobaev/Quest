import { useState } from "react";
import "./Station3Who.css";

interface Props {
  onSuccess: () => void;
}

const cards = [
  {
    id: 1,
    description: "Он покорно выполняет приказы, но чувствует тревогу и грусть",
    answer: "Старик",
  },
  {
    id: 4,
    description: "Просит всё больше и больше, не зная меры",
    answer: "Старуха",
  },
  {
    id: 2,
    description: "Исполняет желания, но предупреждает о последствиях",
    answer: "Золотая рыбка",
  },
  {
    id: 3,
    description: "Живёт в старой землянке у самого синего моря",
    answer: "Старуха",
  },
  {
    id: 5,
    description:
      "Говорит: «Не хочу быть столбовой дворянкой, хочу быть вольной царицей!»",
    answer: "Старуха",
  },
] as const;

export default function Station3Who({ onSuccess }: Props) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleReveal = (id: number) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const allRevealed = cards.every((card) => revealed[card.id]);

  return (
    <div className="station3-who">
      <h1>Кто я?</h1>
      <p>
        Прочитайте описание героя. Нажмите на карточку, чтобы увидеть правильный
        ответ.
      </p>

      <div className="cards-grid">
        {cards.map((card) => {
          const isRevealed = !!revealed[card.id];

          return (
            <div
              key={card.id}
              className={`card ${isRevealed ? "revealed" : ""}`}
              onClick={() => !isRevealed && handleReveal(card.id)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <p>{card.description}</p>
                  <small className="hint">Нажмите, чтобы открыть ответ</small>
                </div>

                <div className="card-back">
                  <h3>{card.answer}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="control-panel">
        {!allRevealed ? (
          <p className="info">Откройте все карточки</p>
        ) : (
          <div className="success-area">
            <div className="big-letter">А</div>
            <p>Молодцы! Третья буква найдена!</p>

            <button className="btn next" onClick={onSuccess}>
              Дальше →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
