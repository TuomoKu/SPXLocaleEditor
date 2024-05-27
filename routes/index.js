const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();


// ------------------------------------------------------
//
// IMPORTANT:
// Set the path to your the locales folder:

const jsonsPath = path.join(__dirname, "../../../../GC/locales/");

// ------------------------------------------------------



const loadJson = () => {
  const files = fs
    .readdirSync(jsonsPath)
    .filter((file) => file.endsWith(".json"));
  const languages = files.map((file) => path.basename(file, ".json"));
  const jsons = {};

  languages.forEach((lang) => {
    const data = fs.readFileSync(path.join(jsonsPath, `${lang}.json`));
    jsons[lang] = JSON.parse(data);
  });

  return jsons;
};

router.get("/", (req, res) => {
  const jsons = loadJson();
  const categories = new Set();

  Object.values(jsons).forEach((json) => {
    Object.keys(json).forEach((category) => {
      categories.add(category);
    });
  });

  res.render("index", { jsons, categories: Array.from(categories) });
});

router.get("/keys", (req, res) => {
  const { category } = req.query;
  const jsons = loadJson();
  const keys = new Set();

  Object.values(jsons).forEach((json) => {
    if (json[category]) {
      Object.keys(json[category]).forEach((key) => {
        keys.add(key);
      });
    }
  });

  res.json(Array.from(keys));
});

router.get("/values", (req, res) => {
  const { category, key } = req.query;
  const jsons = loadJson();
  const values = {};

  Object.keys(jsons).forEach((language) => {
    if (jsons[language][category] && jsons[language][category][key]) {
      values[language] = jsons[language][category][key];
    } else {
      values[language] = "";
    }
  });

  res.json(values);
});

router.post("/save", (req, res) => {
  const { categories, newCategories, ...values } = req.body;

  const updateJsonFiles = (category, key) => {
    Object.keys(values).forEach((language) => {
      const filePath = path.join(jsonsPath, `${language}.json`);
      const data = JSON.parse(fs.readFileSync(filePath));

      if (!data[category]) {
        data[category] = {};
      }
      if (key) {
        data[category][key] = values[language];
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    });
  };

  if (categories) {
    categories.forEach(({ category, key }) => {
      updateJsonFiles(category, key);
    });
  }

  if (newCategories) {
    newCategories.forEach(({ category, key }) => {
      updateJsonFiles(category, key);
    });
  }

  res.redirect("/");
});

module.exports = router;
