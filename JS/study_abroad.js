document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const country = params.get("country");

    if (!country) {
        document.getElementById("country-details").innerHTML = "<h2>Country not specified.</h2>";
        return;
    }

    fetch("../study_abroad.json")
        .then(response => response.json())
        .then(data => {
            if (data[country]) {
                displayCountryData(data[country]);
            } else {
                document.getElementById("country-details").innerHTML = "<h2>Country data not found.</h2>";
            }
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
            document.getElementById("country-details").innerHTML = "<h2>Error loading country data.</h2>";
        });
});

// Function to display country data dynamically
function displayCountryData(countryData) {
    document.getElementById("country-title").innerText = countryData.title;
    document.getElementById("country-description").innerText = countryData.description;

    const contentGrid = document.getElementById("country-data");

    const sections = [
        {
            title: "Why Choose This Country?",
            icon: "fas fa-globe",
            list: countryData.whyChoose,
            image: "images/Why_Choose.jpg"
        },
        {
            title: "Top Universities",
            icon: "fas fa-university",
            list: countryData.topUniversities,
            image: "images/Top_Univers.jpg"
        },
        {
            title: "Tuition Fees",
            icon: "fas fa-dollar-sign",
            content: `<b>Undergraduate:</b> ${countryData.tuitionFees.undergraduate}<br>
                      <b>Postgraduate:</b> ${countryData.tuitionFees.postgraduate}`,
            image: "images/Tution Fees.jpg"
        },
        {
            title: "Living Expenses",
            icon: "fas fa-home",
            content: `<b>Estimated Costs:</b> ${countryData.livingExpenses.estimated}<br>
                      <b>Metropolitan:</b> ${countryData.livingExpenses.metropolitan}<br>
                      <b>Suburban:</b> ${countryData.livingExpenses.suburban}`,
            image: "images/Living_Expences.jpg"
        }
    ];

    contentGrid.innerHTML = sections.map(section => `
        <div class="section-card">
            <img src="${section.image}" alt="${section.title}">
            <div class="card-content">
                <h2><i class="${section.icon}"></i> ${section.title}</h2>
                ${section.content || `<ul>${section.list.map(item => `<li>${item}</li>`).join('')}</ul>`}
            </div>
        </div>
    `).join('');

    document.getElementById("faqs").innerHTML = countryData.faqs.map(faq => `
        <div class="faq-item">
            <strong>${faq.question}</strong>: ${faq.answer}
        </div>
    `).join('');
}
