const inputText = document.getElementById("input-text");

const outputText = document.getElementById("output-text");

const translateBtn = document.getElementById("translate-btn");

const characterCount = document.getElementById("character-count");

const sourceLanguage = document.getElementById("source-language");
const targetLanguage = document.getElementById("target-language");
 const swapBtn = document.getElementById("swap-btn");
const copyBtn = document.getElementById("copy-btn");
const loading = document.getElementById("loading");
const speakBtn = document.getElementById("speak-btn");
const historyList = document.getElementById("history-list");

const clearHistory=document.getElementById("clear-history");
const darkBtn = document.getElementById("dark-btn");

const body = document.body;

inputText.addEventListener("input", () => {

    characterCount.textContent =
    `Characters : ${inputText.value.length}`;

});
inputText.addEventListener("keydown",(event)=>{

    if(event.ctrlKey && event.key==="Enter"){

        translateText();

    }

});
async function translateText() {
 const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    if (source === target) {
        alert("Please choose different languages.");
        return;
    }

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
        );

        if (!response.ok) {
            throw new Error("API Error");
        }

        const data = await response.json();

        console.log(data);

        outputText.value = data.responseData.translatedText;

        addToHistory(text, data.responseData.translatedText);

    } catch (error) {

        console.error(error);

        outputText.value = "Translation failed!";

    } finally {

        loading.classList.add("hidden");
}
}
    
translateBtn.addEventListener("click", translateText);
swapBtn.addEventListener("click", () => {

    
    const temp = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = temp;

  
    const tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;

});
loading.classList.add("hidden");

copyBtn.addEventListener("click",()=>{

    if(outputText.value===""){

        alert("Nothing to copy!");

        return;

    }

    navigator.clipboard.writeText(outputText.value);

    copyBtn.innerHTML="✅ Copied";

    copyBtn.style.background="#22c55e";

    setTimeout(()=>{

        copyBtn.innerHTML="📋 Copy";

        copyBtn.style.background="#111";

    },1800);

});
speakBtn.addEventListener("click", () => {

    if (outputText.value.trim() === "") {
        alert("Nothing to speak!");
        return;
    }

    
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(outputText.value);

    // Set language correctly
    const languageMap = {
        en: "en-US",
        hi: "hi-IN",
        fr: "fr-FR",
        es: "es-ES"
    };

    speech.lang = languageMap[targetLanguage.value] || "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);

});
clearHistory.addEventListener("click",()=>{

    historyList.innerHTML="";

    localStorage.removeItem("translationHistory");

});

function addToHistory(original, translated){

    const item = document.createElement("li");

    item.innerHTML = `
        <strong>${original}</strong><br>
        ${translated}
    `;

    historyList.prepend(item);

    saveHistory();
}
function saveHistory(){

    localStorage.setItem(
        "translationHistory",
        historyList.innerHTML
    );

}

function loadHistory(){

    const savedHistory =
    localStorage.getItem("translationHistory");

    if(savedHistory){

        historyList.innerHTML = savedHistory;

    }

}
darkBtn.addEventListener("click", () => {

    body.classList.toggle("dark");

    if(body.classList.contains("dark")){
        darkBtn.innerHTML = "☀️ Light Mode";
    }else{
        darkBtn.innerHTML = "🌙 Dark Mode";
    }

});
loadHistory();
inputText.focus();




