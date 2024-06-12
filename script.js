document.addEventListener("DOMContentLoaded", () => {
    const screen = document.querySelector(".screen .placeholder");
    const numbers = document.querySelectorAll(".numbers");
    const operators = document.querySelectorAll(".operator");
    const deleteButton = document.getElementById("delete");
    const resetButton = document.getElementById("reset");
    const resultButton = document.getElementById("result");
    const themeToggleButton = document.querySelector(".theme-toggle");
    const themeToggleButtonCircle = document.querySelector(
        ".theme-toggle .circle"
    );
    const themes = ["theme-1", "theme-2", "theme-3"];
    let currentThemeIndex = 0;

    let currentInput = "";
    let previousInput = "";
    let operator = null;
    let resultDisplayed = false;

    numbers.forEach((button) => {
        button.addEventListener("click", () => {
            handleNumber(button.value);
        });
    });

    operators.forEach((button) => {
        button.addEventListener("click", () => {
            handleOperator(button.value);
        });
    });

    deleteButton.addEventListener("click", () => {
        handleDelete();
    });

    resetButton.addEventListener("click", () => {
        handleReset();
    });

    resultButton.addEventListener("click", () => {
        handleResult();
    });

    themeToggleButton.addEventListener("click", () => {
        handleThemeToggle();
    });

    function handleNumber(num) {
        if (resultDisplayed) {
            currentInput = "";
            resultDisplayed = false;
        }
        if (num === "." && currentInput === "") {
            currentInput = "0.";
        } else if (num === "." && currentInput.includes(".")) {
            return;
        } else {
            currentInput += num;
        }
        if (formatNumber(currentInput).length <= 15) {
            updateScreen(formatNumber(currentInput));
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }

    function handleOperator(op) {
        if (currentInput === "" && previousInput === "") return;
        if (currentInput === "" && previousInput !== "") {
            operator = op;
            updateScreen(op);
            return;
        }
        if (previousInput === "") {
            previousInput = currentInput;
            currentInput = "";
            operator = op;
            updateScreen(op);
        } else if (currentInput !== "") {
            let result = calculate();
            operator = op;
            currentInput = "";
            previousInput = result;
            updateScreen(formatNumber(result));
        }
    }

    function handleDelete() {
        currentInput = currentInput.slice(0, -1);
        updateScreen(formatNumber(currentInput) || "0");
    }

    function handleReset() {
        currentInput = "";
        previousInput = "";
        operator = null;
        resultDisplayed = false;
        updateScreen("0");
    }

    function handleResult() {
        if (currentInput === "" || previousInput === "") return;
        let result = calculate();
        if (result.replace(/,/g, "").length > 12) {
            result = "too large";
        } else {
            result = formatNumber(result);
        }
        currentInput = result;
        previousInput = "";
        operator = null;
        resultDisplayed = true;
        updateScreen(result);
    }

    function handleThemeToggle() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.documentElement.id = themes[currentThemeIndex];

        if (currentThemeIndex === 0) {
            themeToggleButtonCircle.style.left = "0";
            themeToggleButtonCircle.style.transform = "translateX(0)";
        }

        if (currentThemeIndex === 1) {
            themeToggleButtonCircle.style.left = "50%";
            themeToggleButtonCircle.style.transform = "translateX(-50%)";
        }

        if (currentThemeIndex === 2) {
            themeToggleButtonCircle.style.left = "100%";
            themeToggleButtonCircle.style.transform = "translateX(-100%)";
        }
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const curr = parseFloat(currentInput);
        if (isNaN(prev) || isNaN(curr)) return;
        switch (operator) {
            case "+":
                result = prev + curr;
                break;
            case "-":
                result = prev - curr;
                break;
            case "/":
                result = curr === 0 ? "undefined" : prev / curr;
                break;
            case "x":
                result = prev * curr;
                break;
            default:
                return;
        }
        return result.toString();
    }

    function formatNumber(value) {
        if (value === "" || value === "undefined") return value;
        if (value.includes(".")) {
            const [integerPart, decimalPart] = value.split(".");
            const roundedDecimalPart =
                decimalPart.length > 6 ? decimalPart.slice(0, 6) : decimalPart;
            const formattedInteger =
                parseFloat(integerPart).toLocaleString("en");
            return `${formattedInteger}.${roundedDecimalPart}`;
        }
        const formattedInteger = parseFloat(value).toLocaleString("en");
        return formattedInteger;
    }

    function updateScreen(value) {
        screen.textContent = value;
    }

    handleReset();
});
