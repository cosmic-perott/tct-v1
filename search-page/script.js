
    const input = document.getElementById("locationInput");
    const listContainer = document.getElementById("autocompleteList");
    let debounceTimer;

    input.addEventListener("input", function() {
      const query = this.value.trim();
      clearTimeout(debounceTimer);
      closeAllLists();

      if (query.length < 2) return false;

      debounceTimer = setTimeout(() => {
        const apiUrl = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=6&username=demo&style=LONG`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (!data.geonames || data.geonames.length === 0) return;

            data.geonames.forEach(item => {
              const suggestionElement = document.createElement("DIV");
              
              const cityName = item.name;
              const adminName = item.adminName1 ? `, ${item.adminName1}` : '';
              const countryName = item.countryName;
              const fullText = `${cityName}${adminName}, ${countryName}`;

              suggestionElement.innerHTML = `
                <span>${fullText}</span>
                <span class="country-badge">${item.countryCode || 'INTL'}</span>
              `;

              suggestionElement.addEventListener("click", function() {
                input.value = fullText;
                closeAllLists();
              });

              listContainer.appendChild(suggestionElement);
            });
          })
          .catch(err => console.error("API Fetch Error:", err));
      }, 300);
    });

    function closeAllLists() {
      listContainer.innerHTML = "";
    }

    document.addEventListener("click", function (e) {
      if (e.target !== input) {
        closeAllLists();
      }
    });
 
