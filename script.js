// Import helper functions from external modules (if modularized)
// import { fetchBirthdays } from './dataFetcher.js';
// import { calculateAge } from './ageCalculator.js';

async function fetchBirthdays(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

function calculateAge(birthDate) {
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear();
}

function formatDateToDayMonth(dateString) {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateString)) {
    console.error(`Invalid date format: ${dateString}`);
    return null;
  }
  const [day, month, year] = dateString.split('-').map(Number);
  return `${day}-${month}`;
}

function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}`;
}

function displayTodayBirthday(birthdays) {
  const today = getTodayDate();
  const todayBirthday = birthdays.find(b => formatDateToDayMonth(b.date) === today);
  const birthdayMessage = document.getElementById('birthday-message');

  if (todayBirthday) {
    const birthDate = new Date(todayBirthday.date.split('-').reverse().join('-'));
    const age = calculateAge(birthDate);
    birthdayMessage.textContent = `${todayBirthday.name} turns ${age} years old today!`;
  } else {
    birthdayMessage.textContent = "No birthdays today.";
  }
}

function displayNextBirthday(birthdays) {
  const today = new Date();
  const todayDate = today.setHours(0, 0, 0, 0);

  const futureBirthdays = birthdays
    .map(b => {
      const [day, month, year] = b.date.split('-').map(Number);
      let birthdayDate = new Date(today.getFullYear(), month - 1, day);
      if (birthdayDate < todayDate) birthdayDate.setFullYear(today.getFullYear() + 1);
      return { name: b.name, date: birthdayDate };
    })
    .sort((a, b) => a.date - b.date);

  const nextBirthday = futureBirthdays[0];
  const nextBirthdayMessage = document.getElementById('next-birthday-message');

  if (nextBirthday) {
    const daysRemaining = Math.ceil((nextBirthday.date - todayDate) / (1000 * 60 * 60 * 24));
    nextBirthdayMessage.textContent = `${nextBirthday.name}'s birthday is in ${daysRemaining} day(s)!`;
  } else {
    nextBirthdayMessage.textContent = "No upcoming birthdays found!";
  }
}

(async function initialize() {
  try {
    const birthdays = await fetchBirthdays('birthdays.json');
    displayTodayBirthday(birthdays);
    displayNextBirthday(birthdays);
  } catch {
    document.getElementById('birthday-message').textContent = "Failed to load data.";
    document.getElementById('next-birthday-message').textContent = "Try reloading the page.";
  }
})();