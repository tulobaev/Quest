// Station5Lesson.tsx
import { useState } from "react";
import "./Station5Lesson.css";

export default function Station5Lesson() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correctPhrases = [
    "быть благодарным",
    "благодарность",
    "умение быть благодарным",
    "ценить то что есть",
    "не жадничать",
    "довольствоваться малым",
    "счастье в благодарности",
  ];

  const isGoodAnswer =
    submitted &&
    correctPhrases.some((phrase) =>
      answer.toLowerCase().includes(phrase.toLowerCase()),
    );

  const handleSubmit = () => {
    if (answer.trim() === "") return;
    setSubmitted(true);
  };

  return (
    <div className="station5-lesson">
      <h1>Разбитое корыто</h1>
      <p className="intro">Эта сказка учит нас…</p>

      {!submitted ? (
        <div className="input-area">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Напишите одним-двумя предложениями, чему учит эта сказка"
            rows={4}
            className="answer-input"
          />
          <button
            className="btn submit"
            onClick={handleSubmit}
            disabled={answer.trim() === ""}
          >
            Отправить
          </button>
        </div>
      ) : (
        <div className="result-area">
          <div className="your-answer">
            <h3>Ваш ответ:</h3>
            <p>{answer}</p>
          </div>

          <div
            className={`final-message ${isGoodAnswer ? "success" : "neutral"}`}
          >
            {isGoodAnswer ? (
              <>
                <div className="big-check">✓</div>
                <h2>Правильно!</h2>
              </>
            ) : (
              <h2>Очень близко!</h2>
            )}

            <div className="main-lesson">
              <p className="gold">Эта сказка учит нас…</p>
              <p className="lesson-text">
                <strong>
                  Счастье не в желаниях, а в умении быть благодарным
                </strong>
              </p>
            </div>

            <div className="final-image">
              <div className="fish-emoji">🐟✨</div>
              <p>Спасибо, что прошли квест вместе со мной!</p>
            </div>

            <p className="congrats">
              Вы молодцы! Ключевое слово: <strong>БЛАГОДАРНОСТЬ</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
