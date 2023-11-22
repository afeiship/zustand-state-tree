import './App.css';

function App() {
  const fishes = nx.$use('fish.fishes');

  return (
    <>
      <h1>zustand-state-tree</h1>
      <h2>hello zustand</h2>
      <p>🐠: {fishes}</p>
      <footer>
        <button
          onClick={(e) => {
            nx.$call('fish.addFish');
          }}>
          AddFish
        </button>

        <button
          onClick={(e) => {
            nx.$call('fish.eatFish');
          }}>
          🐻‍❄️ EatFish
        </button>
      </footer>
    </>
  );
}

export default App;
