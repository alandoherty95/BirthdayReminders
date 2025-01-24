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

// Calculate age based on the birth date and reference date
function calculateAge(birthDate, referenceDate = new Date()) {
  const thisYearBirthday = new Date(referenceDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  if (referenceDate < thisYearBirthday) {
    age--;
  }
  return age;
}

// Format date string to "dd/mm/yyyy"
function formatDateToDDMMYYYY(dateString) {
  const [day, month, year] = dateString.split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`; // Ensure leading zeros
}

// Convert a date object to "January 30"
function formatDateToHumanReadable(date) {
  const options = { month: 'long', day: 'numeric' }; // Use full month name and day
  return new Intl.DateTimeFormat('en-US', options).format(date); // Format as "January 30"
}

// Get today's date in "dd/mm/yyyy" format
function getTodayDate() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
}

// Display today's birthday message
function displayTodayBirthdayMessage(birthdays) {
  const today = getTodayDate(); // Get today's date in "dd/mm/yyyy" format
  const todayBirthday = birthdays.find(b => formatDateToDDMMYYYY(b.date) === today); // Find matching birthday
  const messageElement = document.getElementById('birthday-message');

  if (todayBirthday) {
    const birthDate = new Date(todayBirthday.date.split('-').reverse().join('-')); // Parse date string
    const age = calculateAge(birthDate); // Calculate age
    messageElement.textContent = `${todayBirthday.name} turns ${age} years old today`;
  } else {
    messageElement.textContent = "No birthdays today";
  }
}

// Display the next upcoming birthday message
function displayNextBirthdayMessage(birthdays) {
  const today = new Date();
  const todayTime = today.setHours(0, 0, 0, 0); // Normalize to midnight

  // Exclude today's birthdays from the upcoming birthdays list
  const todayDateFormatted = getTodayDate(); // Format today's date as "dd/mm/yyyy"
  const futureBirthdays = birthdays
    .filter(b => formatDateToDDMMYYYY(b.date) !== todayDateFormatted) // Exclude today's birthdays
    .map(b => {
      const [day, month] = b.date.split('-').map(Number);
      let birthdayDate = new Date(today.getFullYear(), month - 1, day);
      if (birthdayDate < todayTime) birthdayDate.setFullYear(today.getFullYear() + 1); // Move to next year if in the past
      return { name: b.name, date: birthdayDate, birthYear: parseInt(b.date.split('-')[2], 10) };
    })
    .sort((a, b) => a.date - b.date); // Sort by date

  const nextBirthday = futureBirthdays[0]; // Get the next upcoming birthday
  const messageElement = document.getElementById('next-birthday-message');

  if (nextBirthday) {
    // Calculate the age they will turn on their next birthday
    const age = nextBirthday.date.getFullYear() - nextBirthday.birthYear;

    // Format the birthday date as "January 30"
    const birthdayDateFormatted = formatDateToHumanReadable(nextBirthday.date);

    // Update the message
    messageElement.textContent = `${nextBirthday.name} will turn ${age} years old on ${birthdayDateFormatted}`;
  } else {
    messageElement.textContent = "No upcoming birthdays found";
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