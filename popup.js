document.addEventListener("DOMContentLoaded", function () {
  const duplicatesHandling = document.getElementById("duplicatesHandling");
  const inputText = document.getElementById("inputText");
  const fromDelimiters = document.getElementById("fromDelimiters");
  const toDelimiters = document.getElementById("toDelimiters");
  const fromDelimiterCustom = document.getElementById("fromDelimiterCustom");
  const toDelimiterCustom = document.getElementById("toDelimiterCustom");
  const quoteButtonsContainer = document.getElementById("quoteButtons");
  const delimitButton = document.getElementById("delimitButton");
  const copyButton = document.getElementById("copyButton");
  const result = document.getElementById("result");
  const debugInfo = document.getElementById("debugInfo");

  let currentResult = "";
  let selectedQuoteType = "none";
  let selectedFromDelimiter = null;
  let selectedToDelimiter = null;
  let removeDuplicates = false;

  // Handle delimiter button selection
  function handleDelimiterSelection(buttons, selectedValue) {
    buttons.querySelectorAll(".delimiter-button").forEach((button) => {
      button.classList.remove("selected");
      if (button.dataset.value === selectedValue) {
        button.classList.add("selected");
      }
    });
  }

  // Handle from delimiter selection
  fromDelimiters.addEventListener("click", function (e) {
    if (e.target.classList.contains("delimiter-button")) {
      selectedFromDelimiter = e.target.dataset.value;
      handleDelimiterSelection(fromDelimiters, selectedFromDelimiter);
      fromDelimiterCustom.classList.remove("visible");
    }
  });

  // Handle to delimiter selection
  toDelimiters.addEventListener("click", function (e) {
    if (e.target.classList.contains("delimiter-button")) {
      selectedToDelimiter = e.target.dataset.value;
      handleDelimiterSelection(toDelimiters, selectedToDelimiter);
      toDelimiterCustom.classList.remove("visible");
    }
  });

  // Handle custom delimiter input
  fromDelimiterCustom.addEventListener("input", function () {
    if (this.value) {
      selectedFromDelimiter = this.value;
      handleDelimiterSelection(fromDelimiters, null);
    }
  });

  toDelimiterCustom.addEventListener("input", function () {
    if (this.value) {
      selectedToDelimiter = this.value;
      handleDelimiterSelection(toDelimiters, null);
    }
  });

  const dupButtons =
    duplicatesHandling?.querySelectorAll(".delimiter-button") || [];
  dupButtons.forEach((button) => {
    button.addEventListener("click", function () {
      dupButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      removeDuplicates = this.getAttribute("data-type") === "remove-duplicates";
    });
  });

  // Handle quote button selection
  const quoteButtons =
    quoteButtonsContainer?.querySelectorAll(".delimiter-button") || [];
  quoteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      quoteButtons.forEach((btn) => btn.classList.remove("selected"));
      this.classList.add("selected");
      selectedQuoteType = this.dataset.type;
    });
  });

  // Initialize selected buttons
  function initializeSelectedButtons() {
    const noneQuoteButton = document.querySelector(
      '.delimiter-button[data-type="none"]',
    );
    const fromCommaButton = fromDelimiters?.querySelector(
      '.delimiter-button[data-value=","]',
    );
    const toCommaButton = toDelimiters?.querySelector(
      '.delimiter-button[data-value=","]',
    );
    const keepDuplicatesButton = duplicatesHandling?.querySelector(
      '.delimiter-button[data-type="keep-duplicates"]',
    );

    if (noneQuoteButton) noneQuoteButton.classList.add("selected");
    if (fromCommaButton) fromCommaButton.classList.add("selected");
    if (toCommaButton) toCommaButton.classList.add("selected");
    if (keepDuplicatesButton) keepDuplicatesButton.classList.add("selected");

    selectedFromDelimiter = ",";
    selectedToDelimiter = ",";
  }

  // Initialize the selected buttons
  initializeSelectedButtons();

  // Show initial message
  result.textContent = "Please enter some text to convert.";

  delimitButton.addEventListener("click", function () {
    const text = inputText.value.trim();
    const fromDelim = selectedFromDelimiter;
    const toDelim = selectedToDelimiter;

    if (!text) {
      result.textContent = "Please enter some text to convert.";
      return;
    }

    if (!fromDelim) {
      result.textContent = 'Please select or enter a "From" delimiter.';
      return;
    }

    if (!toDelim) {
      result.textContent = 'Please select or enter a "To" delimiter.';
      return;
    }

    // Handle special characters
    const specialChars = {
      "\\n": "\n",
      "\\t": "\t",
    };

    const actualFromDelim = specialChars[fromDelim] || fromDelim;
    const actualToDelim = specialChars[toDelim] || toDelim;

    let items = text.split(actualFromDelim).map((item) => item.trim());
    const itemsBeforeDedup = [...items];
    if (removeDuplicates) {
      console.log("items before removing duplicates:", items);
      items = Array.from(new Set(items));
    }
    console.log("items after removing duplicates if any:", items);
    const delimitedText = items.map((trimmed) => {
      switch (selectedQuoteType) {
        case "single":
          return `'${trimmed}'`;
        case "double":
          return `"${trimmed}"`;
        default:
          return trimmed;
      }
    });

    // Store the actual result with proper delimiters
    currentResult = delimitedText.join(actualToDelim);

    // Display the result with proper formatting
    if (toDelim === "\\n") {
      result.innerHTML = delimitedText.join("<br>");
    } else if (toDelim === "\\t") {
      // For tabs, we'll show them as visible characters in the display
      const tabVisual = "\u2192"; // →  right arrow
      result.textContent = delimitedText.join(` ${tabVisual} `);
    } else {
      result.textContent = delimitedText.join(actualToDelim);
    }

    if (debugInfo) {
      if (removeDuplicates) {
        debugInfo.textContent =
          `Before removing duplicates (${itemsBeforeDedup.length}): ${itemsBeforeDedup.join(", ")}\n` +
          `After removing duplicates (${items.length}): ${items.join(", ")}`;
      } else {
        debugInfo.textContent = `Items count: ${items.length}`;
      }
    }
  });

  copyButton.addEventListener("click", function () {
    if (!currentResult) {
      return;
    }

    // Create a temporary textarea to copy from
    const textarea = document.createElement("textarea");
    textarea.value = currentResult;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // Show feedback
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  });
});
