import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const searchTimeout = useRef(null);
  // const [apiLink, setApiLink] = useState("");

  const renderCount = useRef(1);
  const apiLink = useRef("");

  useEffect(() => {
    console.log("current render count:", renderCount.current);
    renderCount.current += 1;
  });

  function handleChange(event) {
    const value = event.target.value;
    setWord(value);
  }

  async function searchForWord() {
    const response = await fetch(apiLink.current);
    const defs = await response.json();
    console.log(defs);

    if (defs.length === 0) {
      setDefinitions([]);
      setSuggestedWords([]);
      return;
    }

    if (typeof defs[0] === "string") {
      setSuggestedWords(defs);
      setDefinitions([]);
    } else {
      setDefinitions(defs);
      setSuggestedWords([]);
    }
  }

  useEffect(() => {
    if (!word) return; // don't process the "word" if it's empty
    apiLink.current = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=4a20bac2-b02b-40bb-8948-91ec4c27b194`;
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      searchForWord();
    }, 300);
  }, [word]);

  return (
    <div className="container">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">My Dictionary</div>
      </nav>
      <div className="columns">
        <div className="column">
          <input
            value={word}
            onChange={handleChange}
            className="input is-primary"
            type="text"
            placeholder="Primary input"
          />
        </div>
        <div className="column">
          {suggestedWords.map((suggestedWord) => {
            return (
              <button
                onClick={() => {
                  setWord(suggestedWord);
                  apiLink.current = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${suggestedWord}?key=4a20bac2-b02b-40bb-8948-91ec4c27b194`;
                  searchForWord();
                }}
                key={`suggested-word-${suggestedWord}`}
                className="button is-info my-button"
              >
                {suggestedWord}
              </button>
            );
          })}

          {definitions.map((definition) => {
            return (
              <div className="card my-card" key={definition.meta.uuid}>
                <header className="card-header">
                  <p className="card-header-title">{definition.fl}</p>
                </header>
                <div className="card-content">
                  <div className="content">
                    {definition.shortdef.map((def) => {
                      return (
                        <p key={`${definition.meta.uuid}-${def}`}>{def}</p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
