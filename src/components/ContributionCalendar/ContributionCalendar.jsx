import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ContributionCalendar.module.css';

const ContributionCalendar = () => {
  const [contributions, setContributions] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSquareIndex, setSelectedSquareIndex] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://dpg.gg/test/calendar.json'); // Исправлено: axios.get вместо axios
      setContributions(result.data);
    };
    fetchData();
    setStartDate(new Date(new Date().setDate(new Date().getDate() - 357)));
  }, []);

  const getContributionCount = date => {
    const dateString = date.toISOString().slice(0, 10);
    return contributions[dateString] || 0;
  };

  const getContributionLevel = count => {
    if (count === 0) return 0;
    if (count < 10) return 1;
    if (count < 20) return 2;
    if (count < 30) return 3;
    if (count < 40) return 4;
    return 5;
  };

  const handleDateClick = (date, squareIndex) => {
    setSelectedDate(date); 
    setSelectedSquareIndex(squareIndex); 
  };

  const renderCalendar = () => {
    let currentDate = new Date(startDate);
    let calendar = [];
    const daysOfWeek = ['Пн', 'Ср', 'Пт','Вс']; 

    for (let i = 0; i < 51; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        const count = getContributionCount(currentDate);
        const level = getContributionLevel(count);
        const squareIndex = i * 7 + j; 

        week.push(
          <div
            key={currentDate.toISOString()}
            className={`${styles.contribution} ${styles[`level${level}`]} ${squareIndex === selectedSquareIndex ? styles.selected : ''}`}
            title={`${count} вкладов на ${currentDate.toDateString()}`}
            onMouseEnter={() => handleDateClick(currentDate.toDateString(), squareIndex)}
            onMouseLeave={() => handleDateClick(null, null)}
          >
            {squareIndex === selectedSquareIndex && <div className={styles.selectedDate}>{currentDate.toDateString()}</div>}
          </div>
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
      calendar.push(
        <div key={i} className={styles.week}>
          {week}
        </div>
      );
    }
    
    // Добавляем названия дней недели перед первой неделей
    if (calendar.length > 0) {
      calendar.splice(0, 0, (
        <div key="daysOfWeek" className={styles.daysOfWeek}>
          {daysOfWeek.map(day => (
            <div key={day} className={styles.dayOfWeek}>
              {day}
            </div>
          ))}
        </div>
      ));
    }
    
    return calendar;
  };

  return (
    <div className={styles.calendar}>
      {renderCalendar()}
    </div>
  );
};

export default ContributionCalendar;
