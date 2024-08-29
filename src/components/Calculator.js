
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
    //eslint-disable-next-line no-unused-vars
    const [isRadians, setIsRadians] = useState(true);
    const [isPlaceholderActive, setIsPlaceholderActive] = useState(true);


    const handleClick = useCallback((value) => {
      const placeholder = ")"; //we set the placeholder as ) bracket

      if (value === "AC") {
          setDisplayValue("0");
          setExpression("");
          setShowExpression(false);
          setIsPlaceholderActive(true);
      } else if (value === "Inv") {
          setIsInverse((prev) => !prev);
      } else if (value === "Rad") {
          setIsRadians(true);
      } else if (value === "Deg") {
          setIsRadians(false);
      } else if (value === "=") {
          try {
              let expression = displayValue.replace(/(\d+)!/g, (_, p1) => factorial(Number(p1)))
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
      }
      else if (value === ")") {
        setDisplayValue((prev) => {
          // Check if the previous value contains the placeholder
          const hasPlaceholder = prev.includes(placeholder);
          if (hasPlaceholder) {
            setIsPlaceholderActive(false);
            return prev.replace(placeholder, value); // Replace the placeholder with ")"
          } else {
            return prev; // Do nothing if there's no placeholder
          }
        });
      }else if (["ln", "sin", "cos", "tan", "log", "sq", "sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(value)) {
          const functionMap = {
              "ln": `log(${placeholder}`, //when the function is pressed then the function is returned with the placeholder
              "sin": `sin(${placeholder}`,
              "cos": `cos(${placeholder}`,
              "tan": `tan(${placeholder}`,
              "log": `log10(${placeholder}`,
              "sin⁻¹": `asin(${placeholder}`,
              "cos⁻¹": `acos(${placeholder}`,
              "tan⁻¹": `atan(${placeholder}`,
              "sq": `sqrt(${placeholder}`
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
          setDisplayValue((prev) => prev.includes(placeholder) //check if the expression contains the placeholder(")") , if so it replaces the placeholder with the input value.
              ? prev.replace(placeholder, value + ")")
              : (prev === lastResult ? value : (prev === "0" ? value : prev + value)));
      }
  }, [displayValue, lastResult, isRadians ,factorial]);


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
          <div className="display">
          {displayValue.split(')').map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < displayValue.split(')').length - 1 && (
                <span className={isPlaceholderActive ? "placeholder" : "placeholder active"}>
                  )
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
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
