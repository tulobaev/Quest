import { useState } from "react";
import Station1Sea from "./stations/Station1Sea";
import Station2Greed from "./stations/Station2Greed";
import Station3Who from "./stations/Station3Who";
import Station4Court from "./stations/Station4Court";
import Station5Lesson from "./stations/Station5Lesson";

export default function Quest() {
  const [station, setStation] = useState(1);
  const [letters, setLetters] = useState<string[]>([]);

  const fullWord = "БЛАГОДАРНОСТЬ";

  const next = (letter?: string) => {
    if (letter) {
      setLetters((prev) => [...prev, letter]);
    }
    setStation((prev) => prev + 1);
  };

  // Собранные буквы с первых 4 станций
  const collected = letters.join("");

  // Показываем полное слово, когда прошли 5-ю станцию
  const displayedWord = station >= 5 ? fullWord : collected || "Собирается...";

  return (
    <div className="quest-container">
      <div className="progress-bar">
        <div className="progress-text">
          Станция: <strong>{station} / 5</strong>
        </div>
        <div className="progress-text word-progress">
          Слово:{" "}
          <strong className={station >= 5 ? "complete-word" : ""}>
            {displayedWord}
          </strong>
          {station >= 5 && <span className="sparkle">✨</span>}
        </div>
      </div>

      {station === 1 && <Station1Sea onSuccess={() => next("Б")} />}
      {station === 2 && <Station2Greed onSuccess={() => next("Л")} />}
      {station === 3 && <Station3Who onSuccess={() => next("А")} />}
      {station === 4 && <Station4Court onSuccess={() => next("Г")} />}
      {station === 5 && <Station5Lesson />}
    </div>
  );
}
