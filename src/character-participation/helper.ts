export const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
export function generateRandomHour(): { startTime: number; endTime: number } {
    let startTime: number;
    let endTime: number;
  
    startTime = getRandomInt(11, 30);
    endTime = getRandomInt(11, 30);
  
    if (endTime <= startTime) {
      endTime = startTime + getRandomInt(1, 5); 
    }
  
    return { startTime, endTime };
  }

  export function generateRandomSeconds(): { startTimeS: number; endTimeS: number } {
    let startTimeS: number;
    let endTimeS: number;
  
    startTimeS = getRandomInt(1, 60);
    endTimeS = getRandomInt(1, 60);
  
    if (endTimeS <= startTimeS) {
        endTimeS = startTimeS + getRandomInt(1, 5); 
    }
  
    return { startTimeS, endTimeS };
  }
  