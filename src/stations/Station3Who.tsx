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
    isCorrect: true,
  },
  {
    id: 2,
    description: "Исполняет желания, но предупреждает о последствиях",
    answer: "Золотая рыбка",
    isCorrect: true,
  },
  {
    id: 3,
    description: "Живёт в старой землянке у самого синего моря",
    answer: "Старуха",
    isCorrect: false,
  },
  {
    id: 4,
    description: "Просит всё больше и больше, не зная меры",
    answer: "Старуха",
    isCorrect: false,
  },
  {
    id: 5,
    description:
      "Говорит: «Не хочу быть столбовой дворянкой, хочу быть вольной царицей!»",
    answer: "Старуха",
    isCorrect: false,
  },
] as const;

export default function Station3Who({ onSuccess }: Props) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [guesses, setGuesses] = useState<Record<number, string>>({});

  const allRevealed = cards.every((c) => revealed[c.id]);
  const allCorrect = cards.every((c) => {
    if (!c.isCorrect) return true;
    const guess = guesses[c.id]?.trim().toLowerCase() || "";
    return guess === c.answer.toLowerCase();
  });

  const handleReveal = (id: number) => {
    if (!revealed[id]) {
      setRevealed((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleGuess = (id: number, value: string) => {
    setGuesses((prev) => ({ ...prev, [id]: value }));
  };

  const resetAnswers = () => {
    setGuesses({});
    // если хочешь полностью перевернуть карточки обратно:
    // setRevealed({});
  };

  return (
    <div className="station3-who">
      <h1>Кто я?</h1>
      <p>
        Прочитайте описание и угадайте героя сказки. Кликните по карточке, чтобы
        увидеть ответ.
      </p>

      <div className="cards-grid">
        {cards.map((card) => {
          const isRevealed = !!revealed[card.id];
          const userGuess = guesses[card.id] || "";

          return (
            <div
              key={card.id}
              className={`card ${isRevealed ? "revealed" : ""} ${
                isRevealed &&
                card.isCorrect &&
                userGuess.trim().toLowerCase() === card.answer.toLowerCase()
                  ? "correct"
                  : ""
              } ${
                isRevealed &&
                card.isCorrect &&
                userGuess.trim() &&
                userGuess.trim().toLowerCase() !== card.answer.toLowerCase()
                  ? "wrong"
                  : ""
              }`}
              onClick={() => !isRevealed && handleReveal(card.id)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <p>{card.description}</p>
                  <small className="hint">Нажмите, чтобы открыть ответ</small>
                </div>

                <div className="card-back">
                  //!!
                  <h3>{card.answer}</h3>
                  //!!
                  {card.isCorrect && (
                    <div className="guess-area">
                      <p>Кто это?</p>
                      <input
                        type="text"
                        placeholder="Введите имя героя..."
                        value={userGuess}
                        onChange={(e) => handleGuess(card.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {userGuess.trim() &&
                        userGuess.trim().toLowerCase() ===
                          card.answer.toLowerCase() && (
                          <span className="correct-mark">✓ Верно!</span>
                        )}
                      {userGuess.trim() &&
                        userGuess.trim().toLowerCase() !==
                          card.answer.toLowerCase() &&
                        userGuess.length > 2 && (
                          <span className="wrong-mark">✗ Попробуй ещё</span>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="control-panel">
        {!allRevealed ? (
          <p className="info">Откройте все карточки и угадайте героев</p>
        ) : !allCorrect ? (
          <div className="error-area">
            <p>Есть ошибки в угадывании… исправьте ответы</p>
            <button className="btn retry" onClick={resetAnswers}>
              Сбросить ответы
            </button>
          </div>
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
