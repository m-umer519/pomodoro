// ... (imports)
import { logPomodoroSession } from '@/app/actions'; // Import the new action
// ...

// ... (inside the PomodoroTimer component, find the useEffect hook)

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
        // THIS IS THE UPDATED PART
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
  }, [isActive, time, mode, pomodoros, switchMode, selectedTask, durations.work]);

// ... (the rest of the component remains the same)