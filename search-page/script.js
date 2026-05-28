
    const input = document.getElementById("locationInput");
    const listContainer = document.getElementById("autocompleteList");
    let debounceTimer;

    // 디바운스 함수: 유저가 타이핑을 멈추고 300ms가 지나면 API를 호출해 서버 과부하를 방지합니다.
    input.addEventListener("input", function() {
      const query = this.value.trim();
      clearTimeout(debounceTimer);
      closeAllLists();

      if (query.length < 2) return false; // 최소 2글자 이상 입력했을 때 작동

      debounceTimer = setTimeout(() => {
        // GeoNames 오픈 전용 인프라 API 호출 (전세계 도시/국가 실시간 데이터셋)
        const apiUrl = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(query)}&maxRows=6&username=demo&style=LONG`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (!data.geonames || data.geonames.length === 0) return;

            data.geonames.forEach(item => {
              const suggestionElement = document.createElement("DIV");
              
              // 도시/주 이름과 국가 이름을 깔끔하게 조합
              const cityName = item.name;
              const adminName = item.adminName1 ? `, ${item.adminName1}` : '';
              const countryName = item.countryName;
              const fullText = `${cityName}${adminName}, ${countryName}`;

              suggestionElement.innerHTML = `
                <span>${fullText}</span>
                <span class="country-badge">${item.countryCode || 'INTL'}</span>
              `;

              // 클릭하면 인풋창에 선택한 도시명이 자동으로 매핑됨
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

    // 마우스로 바깥 여백을 누르면 드롭다운이 닫힙니다.
    document.addEventListener("click", function (e) {
      if (e.target !== input) {
        closeAllLists();
      }
    });
 
