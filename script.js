// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJRmaqZLB9kDY1Pqh7utq0ZnNI5eOzUiw",
  authDomain: "sportsync-b5e1d.firebaseapp.com",
  databaseURL: "https://sportsync-b5e1d-default-rtdb.firebaseio.com",
  projectId: "sportsync-b5e1d",
  storageBucket: "sportsync-b5e1d.firebasestorage.app",
  messagingSenderId: "512011344406",
  appId: "1:512011344406:web:f801cadcb3fdc1726d7337",
  measurementId: "G-BSC7YEZ2QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// Toggle department input based on category
function toggleDeptInput() {
  const category = document.getElementById('category').value;
  document.getElementById('intraDeptInput').style.display = category === 'Intra-Department' ? 'block' : 'none';
  document.getElementById('interDeptInput').style.display = category === 'Inter-Department' ? 'block' : 'none';
}

// Generate random fixture and display it
function generateFixture() {
  const sport = document.getElementById('sport').value;
  const type = document.getElementById('type').value;
  const gender = document.getElementById('gender').value;
  const category = document.getElementById('category').value;
  
  let fixtureName = `${sport} ${type} ${gender}`;
  let department1, department2;
  
  if (category === 'Intra-Department') {
    department1 = document.getElementById('department').value;
    fixtureName += ` Intra ${department1}`;
  } else {
    department1 = document.getElementById('department1').value;
    department2 = document.getElementById('department2').value;
    fixtureName += ` Inter ${department1} vs ${department2}`;
  }

  const numTeams = document.getElementById('teams').value;
  const teams = [];
  
  for (let i = 0; i < numTeams; i++) {
    let teamMembers = [];
    if (type === 'Singles') {
      teamMembers.push(prompt(`Enter name for Team ${i + 1}:`));
    } else if (type === 'Doubles') {
      teamMembers.push(prompt(`Enter name for Player 1 of Team ${i + 1}:`));
      teamMembers.push(prompt(`Enter name for Player 2 of Team ${i + 1}:`));
    }
    teams.push(teamMembers);
  }

  // Create fixture data
  const fixtureData = {
    fixtureName,
    teams: teams.map((team, index) => `Team ${index + 1}: ${team.join(', ')}`),
  };

  // Save fixture to Firebase
  saveFixtureToFirebase(fixtureData);

  // Redirect to the view fixture page after saving
  window.location.href = "view-fixture.html";  // Modify with the correct path to your view fixture page
}

// Firebase function to save the fixture
function saveFixtureToFirebase(fixtureData) {
  const fixtureRef = ref(db, 'fixtures/' + Date.now());  // Use timestamp as the key
  set(fixtureRef, fixtureData)
    .then(() => {
      console.log('Fixture saved to Firebase.');
    })
    .catch((error) => {
      console.error('Error saving fixture to Firebase: ', error);
      alert('There was an error saving the fixture. Please try again.');
    });
}

// Display fixture data on the View Fixture page
function displayFixture() {
  const fixtureRef = ref(db, 'fixtures');
  fixtureRef.once('value', function(snapshot) {
    const fixtureData = snapshot.val();
    const fixtureDisplay = document.getElementById('fixtureDisplay');
    const fixtureOutput = document.getElementById('fixtureOutput');
    
    if (fixtureData) {
      Object.keys(fixtureData).forEach(key => {
        const fixture = fixtureData[key];
        fixtureOutput.innerHTML += `
          <strong>Fixture Name:</strong> ${fixture.fixtureName} <br>
          <strong>Teams:</strong> <br>
          ${fixture.teams.join('<br>')} <br><br>
        `;
      });
    } else {
      fixtureOutput.innerHTML = 'No fixtures available.';
    }
  });
}

// Attach event listener to form button for fixture generation
document.querySelector("button").addEventListener("click", generateFixture);

// Attach event listener to form submit
document.getElementById('fixtureForm').addEventListener('submit', function (e) {
  e.preventDefault();  // Prevent form from submitting normally

  generateFixture();  // Generate fixture and save to Firebase
});

