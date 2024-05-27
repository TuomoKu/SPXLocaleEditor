document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".category-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", updateKeys);
  });

  document
    .getElementById("category-fields")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("add-category")) {
        addNewCategory(event.target);
      } else if (event.target.classList.contains("add-key")) {
        addNewKey(event.target);
      }
    });
});

function updateKeys(event) {
  const category = event.target.value;
  const keyDropdown = event.target
    .closest(".row")
    .querySelector(".key-dropdown");
  keyDropdown.innerHTML =
    '<option value="" disabled selected>Select key</option>';

  if (category) {
    fetch(`/keys?category=${category}`)
      .then((response) => response.json())
      .then((keys) => {
        keys.forEach((key) => {
          const option = document.createElement("option");
          option.value = key;
          option.textContent = key;
          keyDropdown.appendChild(option);
        });
      });

    keyDropdown.addEventListener("change", () => {
      populateValues(category, keyDropdown.value);
    });
  }
}

function populateValues(category, key) {
  fetch(`/values?category=${category}&key=${key}`)
    .then((response) => response.json())
    .then((values) => {
      Object.keys(values).forEach((language) => {
        document.getElementById(`value-${language}`).value =
          values[language] || "";
      });
    });
}

function addNewCategory(target) {
  const categoryName = prompt("Enter new category name:");
  if (categoryName) {
    const categoryDropdown = target
      .closest(".input-group")
      .querySelector(".category-dropdown");
    const option = document.createElement("option");
    option.value = categoryName;
    option.textContent = categoryName;
    categoryDropdown.appendChild(option);
    categoryDropdown.value = categoryName;
  }
}

function addNewKey(target) {
  const categoryDropdown = target
    .closest(".row")
    .querySelector(".category-dropdown");
  if (!categoryDropdown.value) {
    alert("Please select a category first.");
    return;
  }

  const keyName = prompt("Enter new key name:");
  if (keyName) {
    const keyDropdown = target
      .closest(".input-group")
      .querySelector(".key-dropdown");
    const option = document.createElement("option");
    option.value = keyName;
    option.textContent = keyName;
    keyDropdown.appendChild(option);
    keyDropdown.value = keyName;
  }
}

function addCategoryField(categoryName = "") {
  const categoryFields = document.getElementById("category-fields");
  const index = categoryFields.querySelectorAll(".category-row").length;
  const newField = document.createElement("div");
  newField.classList.add("row", "mb-3", "category-row");
  newField.innerHTML = `
    <div class="col">
        <label for="category-${index}" class="form-label">Category</label>
        <div class="input-group">
            <select class="form-select category-dropdown" name="categories[${index}][category]" id="category-${index}">
                <option value="${categoryName}" selected>${categoryName}</option>
            </select>
            <button class="btn btn-outline-secondary add-category" type="button">+</button>
        </div>
    </div>
    <div class="col">
        <label for="key-${index}" class="form-label">Key</label>
        <div class="input-group">
            <select class="form-select key-dropdown" name="categories[${index}][key]" id="key-${index}">
                <option value="" disabled selected>Select key</option>
            </select>
            <button class="btn btn-outline-secondary add-key" type="button">+</button>
        </div>
    </div>
  `;
  categoryFields.appendChild(newField);
  newField
    .querySelector(".category-dropdown")
    .addEventListener("change", updateKeys);
}

function addCategoryKeyFields() {
  const categoryFields = document.getElementById("category-fields");
  const index = categoryFields.querySelectorAll(".category-row").length;
  const newField = document.createElement("div");
  newField.classList.add("row", "mb-3");
  newField.innerHTML = `
    <div class="col">
        <label for="new-category-${index}" class="form-label">New Category</label>
        <input type="text" class="form-control new-category" name="newCategories[${index}][category]" id="new-category-${index}">
    </div>
    <div class="col">
        <label for="new-key-${index}" class="form-label">New Key</label>
        <input type="text" class="form-control new-key" name="newCategories[${index}][key]" id="new-key-${index}">
    </div>
  `;
  categoryFields.appendChild(newField);
}
