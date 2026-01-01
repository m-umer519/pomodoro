'use client';

import { useState, useEffect, useRef } from 'react';
import { logPomodoroSession } from '@/app/actions';

type Mode = 'work' | 'shortBreak' | 'longBreak';

type PomodoroTimerProps = {
  tasks: { id: string; title: string }[];
};

export default function PomodoroTimer({ tasks }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('work');
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTime(durations[newMode]);
    setIsActive(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      
      if (mode === 'work') {
        if (selectedTask) {
          logPomodoroSession(selectedTask, durations.work / 60);
        }
        
        const newPomodoros = pomodoros + 1;
        setPomodoros(newPomodoros);
        if (newPomodoros % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('work');
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, mode, pomodoros, selectedTask]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl mb-4">Pomodoro Timer</h2>
        
        <div className="tabs tabs-boxed mb-4">
          <button
            className={`tab ${mode === 'work' ? 'tab-active' : ''}`}
            onClick={() => switchMode('work')}
          >
            Work
          </button>
          <button
            className={`tab ${mode === 'shortBreak' ? 'tab-active' : ''}`}
            onClick={() => switchMode('shortBreak')}
          >
            Short Break
          </button>
          <button
            className={`tab ${mode === 'longBreak' ? 'tab-active' : ''}`}
            onClick={() => switchMode('longBreak')}
          >
            Long Break
          </button>
        </div>

        {mode === 'work' && tasks.length > 0 && (
          <div className="form-control w-full max-w-xs mb-4">
            <label className="label">
              <span className="label-text">Select Task</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">No task selected</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-6xl font-mono font-bold my-8">
          {formatTime(time)}
        </div>

        <div className="flex gap-4">
          <button
            className={`btn ${isActive ? 'btn-warning' : 'btn-primary'}`}
            onClick={toggleTimer}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button className="btn btn-secondary" onClick={resetTimer}>
            Reset
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm">Pomodoros completed: {pomodoros}</p>
        </div>

        <audio ref={audioRef} src="/notification.mp3" />
      </div>
    </div>
  );
}
