import React, { useState, useEffect, useCallback } from "react";
import "./Calculator.css";
import * as math from "mathjs";
import { factorial } from "../utils/operators";
import { handleSpecialExceptions } from "../utils/exceptionHandlers";
import HistoryDisplay from './HistoryDisplay';
import HistoryModal from './HistoryModal';

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expression, setExpression] = useState("");
  const [showExpression, setShowExpression] = useState(false);
  const [isInverse, setIsInverse] = useState(false);
  const [isRadians, setIsRadians] = useState(true);

  const handleClick = useCallback((value) => {
    if (value === "AC") {
      setDisplayValue("0");
      setExpression("");
      setShowExpression(false);
    } else if (value === "Inv") {
      setIsInverse((prev) => !prev);
    } else if (value === "Rad") {
      setIsRadians(true);
    } else if (value === "Deg") {
      setIsRadians(false);
    } else if (value === "=") {
      try {
        let openBrackets = (displayValue.match(/\(/g) || []).length;
        let closeBrackets = (displayValue.match(/\)/g) || []).length;
        let updatedDisplayValue = displayValue;
        while (openBrackets > closeBrackets) {
          updatedDisplayValue += ")";
          closeBrackets++;
        }
        let expression = updatedDisplayValue
          .replace(/(\d+)!/g, (_, p1) => factorial(Number(p1)))
          .replace(/EXP/g, "e")
          .replace(/π/g, math.pi)
          .replace(/e/g, math.e)
          .replace(/÷/g, "/")
          .replace(/x/g, "*")
          .replace(/sqrt/g, "sqrt")
          .replace(/sin/g, isRadians ? "sin" : `sin * (math.pi / 180)`)
          .replace(/cos/g, isRadians ? "cos" : `cos * (math.pi / 180)`)
          .replace(/tan/g, isRadians ? "tan" : `tan * (math.pi / 180)`)
          .replace(/ln/g, "log")
          .replace(/log10/g, "log10")
          .replace(/\^/g, "**")
          .replace(/Ans/g, lastResult || 0)
          .replace(/sin⁻¹/g, isRadians ? "asin" : `asin / (math.pi / 180)`)
          .replace(/cos⁻¹/g, isRadians ? "acos" : `acos / (math.pi / 180)`)
          .replace(/tan⁻¹/g, isRadians ? "atan" : `atan / (math.pi / 180)`);
  
        const exceptionResult = handleSpecialExceptions(expression);
        if (exceptionResult) {
          setDisplayValue(exceptionResult);
          return;
        }
  
        const result = math.evaluate(expression);
        const formattedResult = Number(result).toFixed(10);
        setDisplayValue(formattedResult);
        setLastResult(formattedResult);
        setExpression(expression);
        setShowExpression(true);
        setHistory((prevHistory) => [...prevHistory, expression + "=" + formattedResult]);
      } catch (error) {
        console.error("Evaluation Error:", error);
        setDisplayValue("Error");
      }
    } else if (value === "x!") {
      setDisplayValue((prev) => prev + "!");
    } else if (value === "DEL") {
      setDisplayValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (value === "Ans") {
      setDisplayValue((prev) => (prev === "0" ? "Ans" : prev + "Ans"));
    } else if (["ln", "sin", "cos", "tan", "log", "sq", "sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
      const functionMap = {
        "ln": "log(",
        "sin": "sin(",
        "cos": "cos(",
        "tan": "tan(",
        "log": "log10(",
        "sin⁻¹": "sin⁻¹(",
        "cos⁻¹": "cos⁻¹(",
        "tan⁻¹": "tan⁻¹(",
        "sq": "sqrt("
      };
      setDisplayValue((prev) => {
        const lastChar = prev[prev.length - 1];
        const isPreviousValue = !isNaN(lastChar) || lastChar === ")";
        return prev === "0"
          ? functionMap[value]
          : (isPreviousValue ? prev + " * " + functionMap[value] : prev + functionMap[value]);
      });
    } else if (value === "x^y") {
      setDisplayValue((prev) => (prev === "0" ? "0^" : prev + "^"));
    } else {
      setDisplayValue((prev) => (prev === lastResult ? value : (prev === "0" ? value : prev + value))); //remove the values in the display after the result is displayed
    }
  }, [displayValue, lastResult, isRadians]);


  const toggleHistory = () => {
    setShowHistory(!showHistory);
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
        handleClick(keyMap[key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]);

  const buttons = [
    ["Rad", "Deg", "x!", "(", ")", "%", "AC"],
    ["Inv", isInverse ? "sin⁻¹" : "sin", "ln", "7", "8", "9", "÷"],
    ["π", isInverse ? "cos⁻¹" : "cos", "log", "4", "5", "6", "x"],
    ["e", isInverse ? "tan⁻¹" : "tan", "sq", "1", "2", "3", "-"],
    ["Ans", "EXP", "x^y", "0", ".", "=", "+"],
    ["DEL"],
  ];

  return (
    <div className="calculator">
      <HistoryModal
        showHistory={showHistory}
        toggleHistory={toggleHistory}
        history={history}
      />
      <div className="display-container">
        <HistoryDisplay expression={expression} lastResult={lastResult} showExpression={showExpression} />
        <button className="history-toggle" onClick={toggleHistory}>
          History
        </button>
        <div className="display">{displayValue}</div>
      </div>
      <div className="buttons">
     
        <div className="rad-deg-container">
          <button
          style={{
            width : "116px",
            hight: "53",

          }}
            className={isRadians ? "active" : ""}
            onClick={() => handleClick("Rad")}
          >
            Rad
          </button>
          <div class="vertical-line"></div>
          <button
          style={{
            width : "116px",
            hight: "53",
          }}
            className={!isRadians ? "active" : ""}
            onClick={() => handleClick("Deg")}
          >
            Deg
          </button>
        </div>
        {buttons.flat().filter(btn => btn !== "Rad" && btn !== "Deg").map((btn) => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
        </div>
        </div>
  );
};

export default Calculator;
