import React, { useState , useEffect } from "react";
import "./Calculator.css";
import * as math from "mathjs";
import { factorial } from "../utils/operators";
import { handleSpecialExceptions } from "../utils/exceptionHandlers";

export const handleClick = (value, displayValue, setDisplayValue) => {
  if (value === "AC") {
    setDisplayValue("0");
  } else if (value === "=") {
    try {
      let expression = displayValue
        .replace(/(\d+)!/g, (match, p1) => factorial(Number(p1))) // Replace factorial notation
        .replace(/ln/g, "log") // Replace ln with log for natural logarithm
        .replace(/EXP/g, "e") // Convert EXP to e for math.js
        .replace(/π/g, math.pi) // Replace π with the value of π
        .replace(/e/g, math.e) // Replace e with the value of e
        .replace(/÷/g, "/") // Replace ÷ with / for division
        .replace(/x/g, "*") // Replace x with * for multiplication
        .replace(/sq/g, "sqrt"); // Replace √ with sqrt for square root

      console.log(expression);
      const exceptionResult = handleSpecialExceptions(expression);
      if (exceptionResult) {
        setDisplayValue(exceptionResult);
        return;
      }

      const result = math.evaluate(expression);
      const formattedResult = Number(result).toFixed(10);
      setDisplayValue(formattedResult);
    } catch (error) {
      setDisplayValue("Error");
    }
  } else if (value === "x!") {
    setDisplayValue((prev) => prev + "!");
  } else if (value === "DEL") {
    setDisplayValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  } else {
    setDisplayValue((prev) => (prev === "0" ? value : prev + value));
  }
};


const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");

  const localHandleClick = (value) => {
    handleClick(value, displayValue, setDisplayValue);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "+": "+",
        "-": "-",
        "*": "x",
        "/": "÷",
        "Enter": "=",
        "=": "=",
        "Backspace": "DEL",
        "s": "sin",
        "t": "tan",
        "c": "cos",
        "p": "π",
        "e": "e",
        ".": ".",
      };
      const key = event.key;
      if (keyMap[key]) {
        localHandleClick(keyMap[key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayValue]);

  const buttons = [
    ["Rad", "Deg", "x!", "(", ")", "%", "AC"],
    ["Inv", "sin", "ln", "7", "8", "9", "÷"],
    ["π", "cos", "log", "4", "5", "6", "x"],
    ["e", "tan", "sq", "1", "2", "3", "-"],
    ["Ans", "EXP", "x^y", "0", ".", "=", "+"],
    ["DEL"],
  ];

  return (
    <div className="calculator">
      <div className="display">{displayValue}</div>
      <div className="buttons">
        {buttons.flat().map((btn) => (
          <button key={btn} onClick={() => localHandleClick(btn)}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
