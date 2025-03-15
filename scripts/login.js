// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD9DhPh4h7xwiooOP8eHlcwaY6sZeapStk",
//   authDomain: "fleekfinds.firebaseapp.com",
//   projectId: "fleekfinds",
//   storageBucket: "fleekfinds.firebasestorage.app",
//   messagingSenderId: "191912399594",
//   appId: "1:191912399594:web:1a00752ed3cb59d7523d93",
//   measurementId: "G-TWFEL9R8PM"
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// // const firebaseConfig = {
// //     apiKey: "YOUR_API_KEY",
// //     authDomain: "YOUR_AUTH_DOMAIN",
// //     projectId: "YOUR_PROJECT_ID",
// //     storageBucket: "YOUR_STORAGE_BUCKET",
// //     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
// //     appId: "YOUR_APP_ID"
// // };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();

// // Google Login
// function loginWithGoogle() {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider)
//         .then(result => {
//             console.log("User signed in:", result.user);
//             alert("Login Successful!");
//             window.location.href = "index.html"; // Redirect after login
//         })
//         .catch(error => {
//             console.error(error);
//             alert("Error logging in with Google!");
//         });
// }

// // GitHub Login
// function loginWithGitHub() {
//     const provider = new firebase.auth.GithubAuthProvider();
//     auth.signInWithPopup(provider)
//         .then(result => {
//             console.log("User signed in:", result.user);
//             alert("Login Successful!");
//             window.location.href = "index.html"; // Redirect after login
//         })
//         .catch(error => {
//             console.error(error);
//             alert("Error logging in with GitHub!");
//         });
// }

// // Show/Hide Password
// function togglePassword() {
//     const passwordField = document.getElementById("password");
//     passwordField.type = passwordField.type === "password" ? "text" : "password";
// }

// // Email/Password Login
// document.getElementById("login-form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
    
//     auth.signInWithEmailAndPassword(email, password)
//         .then(userCredential => {
//             console.log("User signed in:", userCredential.user);
//             alert("Login Successful!");
//             window.location.href = "index.html"; // Redirect after login
//         })
//         .catch(error => {
//             console.error(error);
//             alert("Error logging in! Please check your credentials.");
//         });
// });


document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sample credentials check
    if (email === 'gowtham@gmail.com' && password === 'Gowtham@1') {
        // Successful login
        window.location.href = 'index.html';
    } else {
        // Failed login
        alert('Invalid credentials. Please try again.');
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}