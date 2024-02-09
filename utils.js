// JavaScript to toggle dark mode
const html = document.documentElement;
const body = document.body

console.log("element", html)

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (prefersDarkScheme.matches) {
  html.classList.add("dark-mode");
  body.classList.add("dark-mode");
} else {
  html.classList.remove("dark-mode");
  body.classList.remove("dark-mode");

}

// Listen for changes to the user's color scheme preference
prefersDarkScheme.addListener((event) => {
  if (event.matches) {
    html.classList.add("dark-mode");
    body.classList.add("dark-mode");
  } else {
    html.classList.remove("dark-mode");
    body.classList.remove("dark-mode");
  }
});


function toggle_visibility(id) {
  const e = document.getElementById(id);
  if (e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}
