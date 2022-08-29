import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query'
import TabPage from './components/TabPage';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <TabPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
