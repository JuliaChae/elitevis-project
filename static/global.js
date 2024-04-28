console.log("HELLOOOOO")
// Define the $$ function
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Insert the color scheme toggle controls into the body
document.body.insertAdjacentHTML("afterbegin", `
    <label class="color-scheme">
        Theme:
        <select id="Select">
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="Custom">Custom</option>
        </select>
    </label>`
);

// Get a reference to the select element
let select = document.getElementById("Select");

// Add event listener for when the user selects an option
select.addEventListener("input", function(event) {
    console.log("Color scheme changed to", event.target.value);

    // Set color scheme based on selected option
    setColorScheme(event.target.value);
});

// Function to set the color scheme based on the selected option
function setColorScheme(scheme) {
    switch (scheme) {
        case "Light":
            // Set color scheme to light
            document.documentElement.style.setProperty("color-scheme", "light");
            break;
        case "Dark":
            // Set color scheme to dark
            document.documentElement.style.setProperty("color-scheme", "dark");
            break;
        case "Custom":
            // Handle custom color scheme if needed
            // For demonstration purposes, set it to a specific value
            document.documentElement.style.setProperty("color-scheme", "custom");
            break;
        default:
            // Reset color scheme to default or automatic if an invalid option is selected
            document.documentElement.style.removeProperty("color-scheme");
            break;
    }
}

// Step 2: Automatic current page link

// // Step 2.1: Get an array of all nav links into a variable
// let navLinks = $$(".nav a");

// // Step 2.2: Find the link to the current page
// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);

// // Step 2.3: Add the current class to the current page link
// currentLink?.classList.add("current");

// Step 3: Automatic navigation menu

// Step 3.1: Adding the navigation menu
let pages = [
    { url: "index.html", title: "Motivation" },
    { url: "projects/index.html", title: "Map" },
    { url: "contact/index.html", title: "Predictive Tool" }
];

let nav = document.createElement("nav");
document.body.prepend(nav);

// Create links and add them to nav
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    let link = document.createElement("a");
    link.href = url;
    link.textContent = title;
    nav.appendChild(link);
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

// if (!ARE_WE_HOME && !url.startsWith("http")) {
// 	url = "../" + url;
// }

// if (a.host === location.host && a.pathname === location.pathname) {
// 	a.classList.add("current");
// }
