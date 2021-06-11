import './App.css';
import ReactReduxPage from './pages/ReactReduxPage';
import ReactReduxHookPage from './pages/ReactReduxHookPage';
// import HooksPage from './pages/HooksPage';

function App() {
  return (
    <div className="App">
      {/* <ReactReduxPage test={1123} /> */}
      <ReactReduxHookPage />
      {/* <HooksPage /> */}
    </div>
  );
}

export default App;
