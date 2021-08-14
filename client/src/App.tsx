import React from "react";
import CategoryTag from "./components/CategoryTag";

function App(): JSX.Element {
  return (
    <div>
      {process.env.REACT_APP_SAMPLE}
      <CategoryTag />
    </div>
  );
}

export default App;
