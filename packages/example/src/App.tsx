import TheComponent from '@jswork/zustand-state-tree';
import '@jswork/zustand-state-tree/src/style.scss';
import './App.css';


function App() {
  return (
    <>
      <h1>zustand-state-tree</h1>
      <TheComponent
        onClick={() => {
          console.log('click me');
        }}>
        Click me
      </TheComponent>
    </>
  );
}

export default App;
