let data = null;

// LOAD JSON
fetch("travel_recommendation_api.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("Не удалось загрузить JSON");
        }
        return res.json();
    })
    .then(json => {
        data = json;
        console.log("✅ Данные загружены:", data);
    })
    .catch(error => {
        console.error("❌ Ошибка загрузки JSON:", error);
    });

// SEARCH FUNCTION
function search() {
    console.log("🔍 Поиск запущен");
    
    const keyword = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    console.log("Введено ключевое слово:", keyword);

    if (!keyword) {
        console.log("⚠️ Пустой поисковый запрос");
        return;
    }

    if (!data) {
        console.error("❌ Данные еще не загружены!");
        resultsDiv.innerHTML = "<p style='color: white; padding: 20px;'>Данные загружаются, попробуйте снова через секунду...</p>";
        return;
    }

    let results = [];

    // BEACHES (проверяем множественное и единственное число)
    if (keyword.includes("beach") || keyword.includes("beaches")) {
        console.log("🏖️ Найдено: пляжи");
        results = data.beaches;
    }

    // TEMPLES (проверяем множественное и единственное число)
    else if (keyword.includes("temple") || keyword.includes("temples")) {
        console.log("🛕 Найдено: храмы");
        results = data.temples;
    }

    // COUNTRIES (проверяем множественное и единственное число)
    else if (keyword.includes("country") || keyword.includes("countries")) {
        console.log("🌍 Найдено: страны");
        // Показываем ВСЕ города из всех стран
        data.countries.forEach(country => {
            results.push(...country.cities);
        });
    }

    // Поиск по конкретной стране (например "japan", "australia", "brazil")
    else {
        console.log("🔎 Поиск по названию страны...");
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                console.log(`✅ Найдена страна: ${country.name}`);
                results.push(...country.cities);
            }
        });
    }

    console.log("📊 Найдено результатов:", results.length);

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p style='color: white; padding: 20px; background: rgba(0,0,0,0.6); border-radius: 8px;'>❌ Ничего не найдено. Попробуйте: beach, temple, country, japan, australia, brazil</p>";
        return;
    }

    // SHOW RESULTS
    results.forEach((place, index) => {
        console.log(`Добавляем карточку ${index + 1}:`, place.name);
        
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}" onerror="this.src='https://via.placeholder.com/500x300?text=Image+Not+Found'">
            <h2>${place.name}</h2>
            <p>${place.description}</p>
        `;
        resultsDiv.appendChild(card);
    });

    console.log("✅ Результаты отображены");
}

// CLEAR BUTTON
function clearResults() {
    console.log("🧹 Очистка результатов");
    document.getElementById("searchInput").value = "";
    document.getElementById("results").innerHTML = "";
}

// Позволяем искать по нажатию Enter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search();
            }
        });
    }
});