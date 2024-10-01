import { Routes, Route } from "react-router-dom";
import { UploadPage } from "./components/UploadPage";
import Homepage from "./components/Homepage";


export default function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>
    </>
  );
}