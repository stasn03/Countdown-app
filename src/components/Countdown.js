import React, { useState, useEffect, useRef } from "react";

export default function Countdown() {
  const [targetTime, setTargetTime] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [counting, setCounting] = useState(false);
  const [expired, setExpired] = useState(false);
  const alarmRef = useRef(null);

  useEffect(() => {
    let timer;
    if (counting && targetTime) {
      timer = setInterval(() => {
        const now = new Date();
        const [hours, minutes] = targetTime.split(":").map(Number);

        const target = new Date();
        target.setHours(hours, minutes, 0, 0);

        const distance = target - now;

        if (distance <= 0) {
          clearInterval(timer);
          setTimeLeft({});
          setCounting(false);
          setExpired(true);
          if (alarmRef.current) {
            alarmRef.current.currentTime = 0;
            alarmRef.current.play();
          }
        } else {
          setTimeLeft({
            hours: Math.floor((distance / (1000 * 60 * 60)) % 100),
            minutes: Math.floor((distance / (1000 * 60)) % 60),
            seconds: Math.floor((distance / 1000) % 60),
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [targetTime, counting]);

  const resetCountdown = () => {
    setCounting(false);
    setTimeLeft({});
    setExpired(false);
    setTargetTime("");
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ${
        expired ? "bg-red-200" : "bg-gray-100"
      }`}
    >
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">Countdown Timer</h1>

        <input
          type="time"
          className="w-full p-2 border border-gray-300 rounded"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
          disabled={counting}
        />

        {!expired ? (
          <button
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => setCounting(true)}
            disabled={!targetTime || counting}
          >
            Start Countdown
          </button>
        ) : (
          <button
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={resetCountdown}
          >
            Reset
          </button>
        )}

        {counting && timeLeft && (
          <div className="text-center text-lg font-medium space-y-1">
            <div>{timeLeft.hours} Hours</div>
            <div>{timeLeft.minutes} Minutes</div>
            <div>{timeLeft.seconds} Seconds</div>
          </div>
        )}

        {expired && (
          <div className="text-center text-lg font-semibold text-red-600">
            Time's up!
          </div>
        )}
      </div>

      
      <audio ref={alarmRef} src="/alarm.wav" preload="auto" loop/>
    </div>
  );
}
