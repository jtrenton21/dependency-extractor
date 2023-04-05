function displayProdLibraries(libraries) {
  const output = document.getElementById("output");
  const prod = document.getElementById("prod-dep");
  prod.style.opacity = 1;
  output.textContent = libraries.join(" ");
}

function displayDevLibraries(libraries) {
  const output = document.getElementById("devoutput");
  const dev = document.getElementById("dev-dep");
  dev.style.opacity = 1;
  output.textContent = libraries.join(" ");
}


function displayLibraries(libraries) {
  const {prod, dev} = libraries;
  displayProdLibraries(prod);
  displayDevLibraries(dev);
}

async function fetchPackageJsonContent(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

async function extractLibraries(url) {
  const packageJsonContent = await fetchPackageJsonContent(url);
  if (packageJsonContent) {
    const packageJson = JSON.parse(packageJsonContent);
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    const libraries = { prod: dependencies, dev: devDependencies };
    return libraries;
  }
  return null;
}

document.getElementById("extract").addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    const libraries = await extractLibraries(activeTab.url);
    if (libraries) {
      displayLibraries(libraries);
    } else {
      output.textContent = "Error: Could not find package.json.";
    }
  });
});

document.getElementById("copy").addEventListener("click", () => {
  const output = document.getElementById("output");
  const text = output.textContent;
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard:", text);
      document.getElementById("copy-msg").style.display = 'block';
    },
    (err) => {
      console.error("Could not copy text:", err);
    }
  );
});

document.getElementById("copydev").addEventListener("click", () => {
  const output = document.getElementById("devoutput");
  const text = output.textContent;
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard:", text);
      document.getElementById("copy-msg").style.display = 'block';
    },
    (err) => {
      console.error("Could not copy text:", err);
    }
  );
});

