// Fetch the birthday data from the 'birthdays.json' file
fetch('birthdays.json')
  .then(response => response.json()) // Convert the response to JSON
  .then(data => {
    const birthdays = data; // Store the fetched birthdays
    displayTodayBirthday(birthdays); // Call the function to display today's birthdays
    displayNextBirthday(birthdays); // Call the function to display the next upcoming birthday
  })
  .catch(error => {
    console.error("Error loading birthdays:", error);
  });

// Helper Function: Format a date to "DD-MM" (ignores the year)
function formatDateToDayMonth(dateString) {
  const [day, month, year] = dateString.split("-"); // Split the date into day, month, and year
  return `${day}-${month}`; // Return only the day and month as "DD-MM"
}

// Helper Function: Get today's date in "DD-MM" format
function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Ensure two-digit day (e.g., 01, 02, ...)
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  return `${day}-${month}`; // Return the date in "DD-MM" format
}

// Function to Display Today's Birthdays
function displayTodayBirthday(birthdays) {
  const today = getTodayDate(); // Get today's date in "DD-MM"
  
  // Find if there's a birthday matching today's date
  const todayBirthday = birthdays.find(b => formatDateToDayMonth(b.date) === today);

  const birthdayMessage = document.getElementById('birthday-message'); // Reference the HTML element

  if (todayBirthday) {
    // Calculate the age: extract birth year and subtract from the current year
    const birthYear = parseInt(todayBirthday.date.split("-")[2]); 
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Display the birthday message with the name and calculated age
    birthdayMessage.textContent = `${todayBirthday.name} turns ${age} years old today!`;

    // Exclude today's birthday for upcoming birthdays
    todayBirthday._isToday = true; // Mark this birthday as "today" for filtering
  } else {
    // If no birthday matches today, display a custom fallback message
    birthdayMessage.textContent = "None"; // Replace with your specific string
  }
}

// Function to Find and Display the Next Upcoming Birthday
function displayNextBirthday(birthdays) {
  const today = new Date(); // Get the current date
  const todayDate = today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

  // Map each birthday to a Date object for the current year
  const futureBirthdays = birthdays
    .filter(b => !b._isToday) // Exclude today's birthday
    .map(b => {
      const [day, month, year] = b.date.split("-"); // Extract day, month, year
      const birthdayDate = new Date(today.getFullYear(), month - 1, day); // Create a Date object

      // If the birthday has already passed this year, move it to next year
      if (birthdayDate < todayDate) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
      }
      return { name: b.name, date: birthdayDate }; // Return the name and adjusted date
    });

  // Sort the birthdays by date (earliest first)
  futureBirthdays.sort((a, b) => a.date - b.date);

  // Get the next upcoming birthday
  const nextBirthday = futureBirthdays[0];

  const nextBirthdayMessage = document.getElementById('next-birthday-message'); // Reference the HTML element

  if (nextBirthday) {
    // Calculate the number of days remaining until the next birthday
    const daysRemaining = Math.ceil((nextBirthday.date - todayDate) / (1000 * 60 * 60 * 24));

    // Display the name of the next birthday and the countdown
    nextBirthdayMessage.textContent = `${nextBirthday.name}'s birthday is in ${daysRemaining} day(s)!`;
  } else {
    // If there are no upcoming birthdays (unlikely), show a fallback message
    nextBirthdayMessage.textContent = "No upcoming birthdays found!";
  }
}