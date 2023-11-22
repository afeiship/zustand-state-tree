import './App.css';

function App() {
  const fishes = nx.$use('fish.fishes');
  const width = nx.$use('layout.width');
  const collapsed = nx.$use('layout.collapsed');

  return (
    <>
      <h1>zustand-state-tree</h1>
      <h2>hello zustand</h2>
      <p>🐠: {fishes}</p>
      <div>
        <h3>coll-width: {width}</h3>
        <p>collapsed: {String(collapsed)}</p>
        <button
          onClick={(e) => {
            console.log('toggle');
            nx.$call('layout.toggle');
          }}>
          Toggle
        </button>
      </div>
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
