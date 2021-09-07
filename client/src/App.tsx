import React from "react";
import { TopBar, BottomBar } from "./components/AppBars";

function App(): JSX.Element {
  return (
    <div>
      <TopBar />
      <BottomBar />
    </div>
  );
}

export default App;
