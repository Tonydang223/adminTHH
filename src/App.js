import "./App.scss";
import AuthMiddleware from "./components/ProtectedRoutes/AuthMidlleware";
import MainPages from "./pages";

function App() {
  return (
    <>
      <AuthMiddleware>
        <MainPages />
      </AuthMiddleware>
    </>
  );
}

export default App;
