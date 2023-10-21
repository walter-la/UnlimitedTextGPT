var allText = ``;
var firstSend = true;
var checkButtonInterval;

function splitCSharpClasses(code) {
  let classes = [];
  let buffer = "";
  let braceCount = 0;
  let inClass = false;
  let startIdx = 0;
  let inString = false;
  let inComment = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;

  for (let i = 0; i < code.length; i++) {
    let char = code[i];
    buffer += char;

    if (char === '"' && (i === 0 || code[i - 1] !== "\\")) {
      if (!inComment) {
        inString = !inString;
      }
    }

    if (!inString) {
      if (!inComment && char === "/" && code[i + 1] === "/") {
        inComment = true;
        inSingleLineComment = true;
      } else if (!inComment && char === "/" && code[i + 1] === "*") {
        inComment = true;
        inMultiLineComment = true;
      } else if (inSingleLineComment && char === "\n") {
        inComment = false;
        inSingleLineComment = false;
      } else if (inMultiLineComment && char === "*" && code[i + 1] === "/") {
        inComment = false;
        inMultiLineComment = false;
      }
    }

    if (!inString && !inComment) {
      if (char === "{") {
        braceCount++;
        if (braceCount === 1 && buffer.includes("class")) {
          inClass = true;
        }
      }
      if (char === "}") {
        braceCount--;
      }

      if (braceCount === 0 && inClass) {
        const endIdx = i; 
        const extractedCode = code.substring(startIdx, endIdx + 1); 
        classes.push({
          code: extractedCode,
          start: startIdx,
          end: endIdx + 1,
        });

        buffer = ""; 
        startIdx = i + 1;
        inClass = false;
      }
    }
  }

  return classes;
}

function handleTextSending() {
  const maxCharCount = firstSend ? 650 : 500;
  let endIndex = maxCharCount;

  const csharpClasses = splitCSharpClasses(allText);

  if (csharpClasses.length > 0) {
    let closestClassEnd = -1;
    for (const cls of csharpClasses) {
      if (cls.end <= maxCharCount) {
        closestClassEnd = Math.max(closestClassEnd, cls.end);
      }
    }

    if (closestClassEnd !== -1) {
      endIndex = closestClassEnd;
    } else {
      endIndex = csharpClasses[0].end;
    }
  } else if (allText.length > maxCharCount) {
    const lastNewLineBeforeMax = allText.lastIndexOf("\n", maxCharCount);
    if (lastNewLineBeforeMax !== -1) {
      endIndex = lastNewLineBeforeMax + 1; 
    }
  } else {
    endIndex = allText.length;
  }

  const inputText = allText.substring(0, endIndex);
  allText = allText.substring(endIndex).trimStart();

  if (firstSend) {
    firstSend = false;
  }

  const textarea = document.getElementById("prompt-textarea");
  const keyEvent = new KeyboardEvent("keydown", {
    key: inputText,
    bubbles: true,
    cancelable: true,
  });
  textarea.dispatchEvent(keyEvent);

  if (!keyEvent.defaultPrevented) {
    textarea.value += inputText;
    textarea.dispatchEvent(
      new Event("input", { bubbles: true, cancelable: true })
    );
  }
}

function checkAndSendText() {
  const isDisabled = !!document.querySelector(
    'button[data-testid="send-button"][disabled]'
  );
  if (isDisabled && allText.length > 0) {
    handleTextSending();
    setTimeout(() => {
      document.querySelector('button[data-testid="send-button"]').click();
      if (!checkButtonInterval) {
        checkButtonInterval = setInterval(() => {
          const specialButton = document.querySelector(
            "button.cursor-pointer.absolute.z-10"
          );
          if (specialButton) {
            specialButton.click();
            clearInterval(checkButtonInterval);
          }
        }, 1000);
      }
      setTimeout(checkAndSendText, 500);
    }, 500);
  } else {
    if (allText.length !== 0) {
      setTimeout(checkAndSendText, 500);
    } else {
      firstSend = true;
    }
  }
}

const intervalId = setInterval(function () {
  const unlimitedTextGPTbutton = "unlimitedTextGPTbutton";
  const targetButton = document.querySelector(
    'button[data-testid="send-button"]'
  );
  const textarea = document.getElementById("prompt-textarea");
  const newButton = document.getElementById(unlimitedTextGPTbutton);

  if (targetButton && textarea && textarea.value.length > 300) {
    if (!newButton) {
      const newBtn = document.createElement("button");
      newBtn.textContent = "UnlimitedText";
      newBtn.id = unlimitedTextGPTbutton;
      newBtn.addEventListener(
        "click",
        function (event) {
          allText = textarea.value;
          textarea.value = "";
          handleTextSending();
          setTimeout(() => {
            setTimeout(checkAndSendText, 500);
          }, 300);
          event.stopPropagation();
        },
        true
      );
      newBtn.className = targetButton.className;
      const existingRight = getComputedStyle(targetButton).right;
      const newRight =
        parseFloat(existingRight) + targetButton.offsetWidth + 10 + "px";
      newBtn.style.right = newRight;
      targetButton.parentNode.appendChild(newBtn);
    } else if (newButton) {
      newButton.style.display = firstSend ? "inline-block" : "none";
    }
  } else {
    if (newButton) {
      newButton.style.display = "none";
    }
  }
}, 1000);
