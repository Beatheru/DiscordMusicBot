import { useState, useEffect, useRef } from "react";
interface ProgressBarProps {
  duration: number;
  startTime: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const { duration, startTime } = props;
  const [progressPercentage, setProgressPercentage] = useState(0);
  const progressBar = useRef(null);

  let timeout: number;

  function calculateProgress() {
    setProgressPercentage(((Date.now() - startTime) / duration) * 100);
    timeout = setTimeout(() => calculateProgress(), 100);
  }

  useEffect(() => {
    calculateProgress();

    return () => {
      clearTimeout(timeout);
    };
  }, [startTime]);

  return (
    <div className="h-1 w-full bg-gray-300" ref={progressBar}>
      <div
        style={{ width: `${progressPercentage}%`, maxWidth: "100%" }}
        className="h-full bg-blue-600"
      ></div>
    </div>
  );
}
