import { handleClick } from "src/components/Calculator.js";


let displayValue = "0";
const setDisplayValue = (value) => { displayValue = value; };

const simulateClick = (value) => {
  handleClick(value, displayValue, setDisplayValue);
  return displayValue;
};

const testCases = [
  { action: ["7", "8", "9", "÷", "3", "="], expected: "26" },
  { action: ["5", "x!", "="], expected: "120" },
  { action: ["ln", "1", "="], expected: "0" },
  { action: ["1", "÷", "0", "="], expected: "Error" },
  { action: ["AC"], expected: "0" },
  { action: ["7", "+", "3", "="], expected: "10" },
  { action: ["(", "3", "+", "5", ")", "*", "2", "="], expected: "16" }
];

testCases.forEach(({ action, expected }, index) => {
  displayValue = "0";
  action.forEach((val) => {
    simulateClick(val);
  });
  console.log(`Test Case ${index + 1}: ${displayValue === expected ? "Passed" : "Failed"}`);
  console.log(`Expected: ${expected}, Got: ${displayValue}`);
});
