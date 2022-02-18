import { useState, useEffect } from 'react'

export function useInterval(time, delay) {
    // запомнить переданное время в секундах
    const [timeLeft, setTimeLeft] = useState(time);

    useEffect(() => {
        // не запускать когда не задано время задержки
        if (delay === null) return;

        // уменьшать время на единицу
        const tick = () => {
            setTimeLeft(timeLeft - 1);
        };

        // старт
        const timerId = setInterval(tick, delay);

        // остановить если время истекло
        if (timeLeft <= 0) clearInterval(timerId);

        // очистить интервал
        return () => clearInterval(timerId);
    }, [delay, timeLeft]);

    // передать управление интервалом вовне
    return [timeLeft, setTimeLeft];
}
