// Fetch data from a given URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json(); // Parse and return JSON data
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate error to caller
  }
}

// Calculate age based on the birth date
function calculateAge(birthDate) {
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear(); // Calculate difference in years
}

// Format date string to "DD-MM"
function formatDateToDayMonth(dateString) {
  const [day, month] = dateString.split('-').slice(0, 2).map(Number);
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`; // Ensure leading zeros
}

// Get today's date in "DD-MM" format
function getTodayDate() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`; // Format current date
}

// Display today's birthday message
function displayTodayBirthdayMessage(birthdays) {
  const today = getTodayDate(); // Get today's date
  const todayBirthday = birthdays.find(b => formatDateToDayMonth(b.date) === today); // Find matching birthday
  const messageElement = document.getElementById('birthday-message');

  if (todayBirthday) {
    const birthDate = new Date(todayBirthday.date.split('-').reverse().join('-')); // Parse date string
    const age = calculateAge(birthDate); // Calculate age
    messageElement.textContent = `${todayBirthday.name} turns ${age} years old today!`;
  } else {
    messageElement.textContent = "No birthdays today.";
  }
}

// Display the next upcoming birthday message
function displayNextBirthdayMessage(birthdays) {
  const today = new Date();
  const todayTime = today.setHours(0, 0, 0, 0); // Normalize to midnight

  // Map birthdays to their next occurrence in the current or next year
  const futureBirthdays = birthdays
    .map(b => {
      const [day, month] = b.date.split('-').map(Number);
      let birthdayDate = new Date(today.getFullYear(), month - 1, day);
      if (birthdayDate < todayTime) birthdayDate.setFullYear(today.getFullYear() + 1); // Adjust to next year if in the past
      return { name: b.name, date: birthdayDate };
    })
    .sort((a, b) => a.date - b.date); // Sort by date

  const nextBirthday = futureBirthdays[0]; // Get the next upcoming birthday
  const messageElement = document.getElementById('next-birthday-message');

  if (nextBirthday) {
    const daysRemaining = Math.ceil((nextBirthday.date - todayTime) / (1000 * 60 * 60 * 24)); // Calculate days left
    messageElement.textContent = `${nextBirthday.name}'s birthday is in ${daysRemaining} day(s)!`;
  } else {
    messageElement.textContent = "No upcoming birthdays found!";
  }
}

// Initialize application
async function initializeApp() {
  try {
    const birthdays = await fetchData('birthdays.json'); // Load birthdays from external source
    displayTodayBirthdayMessage(birthdays); // Show today's birthdays
    displayNextBirthdayMessage(birthdays); // Show next upcoming birthday
  } catch {
    document.getElementById('birthday-message').textContent = "Failed to load data."; // Display error message
    document.getElementById('next-birthday-message').textContent = "Try reloading the page.";
  }
}

// Run the app
initializeApp();