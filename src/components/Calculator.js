//tomorrow morning make sure to handle the inputs into the evaluation functions
import React, { useState, useEffect, useCallback } from "react";
import "./Calculator.css";
import * as math from "mathjs";
import { factorial } from "../utils/operators";
import { handleSpecialExceptions } from "../utils/exceptionHandlers";
import HistoryDisplay from "./HistoryDisplay";
import HistoryModal from "./HistoryModal";
import { convertToMathNotation } from "../utils/convertToMathNotation";
import { FaHistory, FaEraser } from "react-icons/fa";

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
  const [isSuperscriptMode, setIsSuperscriptMode] = useState(false);
  const [classIndex, setClassIndex] = useState(0);

  const handleClick = useCallback(
    (value) => {
      const placeholder = ")"; //we set the placeholder as ) bracket

      if (value === "AC") {
        setDisplayValue("0");
        setExpression("");
        setShowExpression(false);
        setIsPlaceholderActive(true);
        setIsSuperscriptMode(false); // deactivate superscript mode
      } else if (value === "Inv") {
        setIsInverse((prev) => !prev);
      } else if (value === "Rad") {
        setIsRadians(true);
      } else if (value === "Deg") {
        setIsRadians(false);
      } else if (value === "=") {
        try {
          let updatedDisplayValue = convertToMathNotation(displayValue);

          console.log("Updated Display Value:", updatedDisplayValue);

          let expression = updatedDisplayValue
            .replace(/(\d+)!/g, (_, p1) => factorial(Number(p1)))
            .replace(/EXP/g, "e")
            .replace(/π/g, math.pi)
            .replace(/e/g, math.e)
            .replace(/÷/g, "/")
            .replace(/x/g, "*")
            .replace(/√/g, "sqrt")
            .replace(/sin/g, isRadians ? "sin" : `sin * (math.pi / 180)`)
            .replace(/cos/g, isRadians ? "cos" : `cos * (math.pi / 180)`)
            .replace(/tan/g, isRadians ? "tan" : `tan * (math.pi / 180)`)
            .replace(/ln/g, "log")
            .replace(/log10/g, "log10")
            .replace(/Ans/g, lastResult || 0)
            .replace(/sin⁻¹/g, isRadians ? "asin" : `asin / (math.pi / 180)`)
            .replace(/cos⁻¹/g, isRadians ? "acos" : `acos / (math.pi / 180)`)
            .replace(/tan⁻¹/g, isRadians ? "atan" : `atan / (math.pi / 180)`);
          const exceptionResult = handleSpecialExceptions(expression);
          if (exceptionResult) {
            setDisplayValue(exceptionResult);
            return;
          }
          console.log(`${expression} this is expression`);
          const result = math.evaluate(expression);
          const formattedResult = Number(result).toFixed(10);
          setDisplayValue(formattedResult);
          setLastResult(formattedResult);
          setExpression(expression);
          setShowExpression(true);
          setHistory((prevHistory) => [
            ...prevHistory,
            expression + "=" + formattedResult,
          ]);
        } catch (error) {
          console.error("Evaluation Error:", error);
          setDisplayValue("Error");
        }
      } else if (value === "x!") {
        setDisplayValue((prev) => prev + "!");
      } else if (value === "DEL") {
        setDisplayValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else if (value === "Ans") {
        //adding the ans to the bracket
        setDisplayValue((prev) =>
          prev.includes(placeholder)
            ? prev.replace(placeholder, value + ")")
            : prev === lastResult
            ? value
            : prev === "0"
            ? value
            : prev + value
        );
      } else if (value === ")") {
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
      } else if (
        [
          "ln",
          "sin",
          "cos",
          "tan",
          "log",
          "√",
          "sin⁻¹",
          "cos⁻¹",
          "tan⁻¹",
        ].includes(value)
      ) {
        const functionMap = {
          ln: `log(${placeholder}`,
          sin: `sin(${placeholder}`,
          cos: `cos(${placeholder}`,
          tan: `tan(${placeholder}`,
          log: `log10(${placeholder}`,
          "sin⁻¹": `asin(${placeholder}`,
          "cos⁻¹": `acos(${placeholder}`,
          "tan⁻¹": `atan(${placeholder}`,
          "√": `√(${placeholder}`,
        };

        if (displayValue.includes(placeholder)) {
          setDisplayValue((prev) =>
            prev.includes(placeholder)
              ? prev.replace(placeholder, functionMap[value] + ")")
              : prev === lastResult
              ? value
              : prev === "0"
              ? value
              : prev + value
          );
        } else {
          setDisplayValue((prev) => {
            const lastChar = prev[prev.length - 1];
            const isPreviousValue = !isNaN(lastChar) || lastChar === ")";
            return prev === "0"
              ? functionMap[value]
              : isPreviousValue
              ? prev + " * " + functionMap[value]
              : prev + functionMap[value];
          });
        }
      } else if (value === "x^y") {
        setDisplayValue((prev) => {
          let sup = {
            0: "⁰",
            1: "¹",
            2: "²",
            3: "³",
            4: "⁴",
            5: "⁵",
            6: "⁶",
            7: "⁷",
            8: "⁸",
            9: "⁹",
          };

          if (Object.values(sup).some((s) => prev.endsWith(s))) {
            return prev + "◻";
          }
          return prev.includes(placeholder)
            ? prev.replace(placeholder, "◻" + ")")
            : prev === lastResult
            ? value
            : prev === "0"
            ? value
            : prev + "◻";
        });
        setIsSuperscriptMode(true); // Activate superscript mode
      } else {
        let sup = {
          0: "⁰",
          1: "¹",
          2: "²",
          3: "³",
          4: "⁴",
          5: "⁵",
          6: "⁶",
          7: "⁷",
          8: "⁸",
          9: "⁹",
        };
        if (isSuperscriptMode) {
          const superscriptValue = sup[value] || value;
          setDisplayValue((prev) => {
            if (prev.endsWith("◻")) {
              //for the first time
              return prev.slice(0, -1) + superscriptValue;
            } else {
              //until the isSuperscriptMode is true the values are added to the superscript
              return prev + superscriptValue;
            }
          });
        } //for the brackets
        else if (displayValue.includes(placeholder)) {
          setDisplayValue((prev) => prev.replace(placeholder, value + ")"));
        } else {
          setDisplayValue((prev) => (prev === "0" ? value : prev + value));
        }
        console.log(displayValue);
      }
    },
    [displayValue, lastResult, isRadians, factorial]
  );

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        0: "0",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        "+": "+",
        "-": "-",
        "*": "x",
        "/": "÷",
        Enter: "=",
        "=": "=",
        Backspace: "DEL",
        s: "sin",
        t: "tan",
        c: "cos",
        p: "π",
        e: "e",
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
    ["e", isInverse ? "tan⁻¹" : "tan", "√", "1", "2", "3", "-"],
    ["Ans", "EXP", "x^y", "0", ".", "=", "+"],
    ["DEL"],
  ];
  const classes = [
    "square-xlarge",
    "square-large",
    "square-medium",
    "square-small",
  ];

  return (
    <div className="calculator">
      <HistoryModal
        showHistory={showHistory}
        toggleHistory={toggleHistory}
        history={history}
      />
      <div className="display-container">
        <HistoryDisplay
          expression={expression}
          lastResult={lastResult}
          showExpression={showExpression}
        />
        <button className="history-toggle" onClick={toggleHistory}>
          <FaHistory />
        </button>
        <div className="display">
          {/* renders only if the isSuperscriptMode is true */}

          {displayValue.split(")").map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < displayValue.split(")").length - 1 && (
                <span
                  className={
                    isPlaceholderActive ? "placeholder" : "placeholder active"
                  }
                >
                  )
                </span>
              )}
            </React.Fragment>
          ))}

          {isSuperscriptMode && (
            <div className="superscript-mode">
              {classes.map((className, index) => (
                <span
                  key={index}
                  className={className}
                  style={{ display: "inline-block", marginRight: "10px" }}
                >
                  ◻
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="buttons">
        <div className="rad-deg-container">
          <button
            style={{
              width: "116px",
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
              width: "116px",
              hight: "53",
            }}
            className={!isRadians ? "active" : ""}
            onClick={() => handleClick("Deg")}
          >
            Deg
          </button>
        </div>
        {buttons
          .flat()
          .filter((btn) => btn !== "Rad" && btn !== "Deg")
          .map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)}>
              {btn == "DEL" ? <FaEraser /> : btn}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Calculator;
