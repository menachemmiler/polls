import { type FC, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppWrapper from "./components/shared/AppWrapper";
import Loading from "./components/shared/Loading";
import NotFoundPage from "./pages/404Page";

import { useShragaUser } from "./utils/hooks";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/About"));
const ResponsePage = lazy(() => import("./pages/ResponsePage"));
const CreateEditFormPage = lazy(() => import("./pages/CreateEditFormPage"));

const App: FC = () => {
  useShragaUser();

  return (
    <AppWrapper>
      <Suspense fallback={<Loading />}>
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poll/:pollId" element={<CreateEditFormPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/response/:pollId" element={<ResponsePage />} />
          <Route
            path="/preview/:pollId"
            element={<ResponsePage preview={true} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-center" autoClose={2000} />
    </AppWrapper>
  );
};

export default App;
