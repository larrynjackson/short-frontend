import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginModal } from './components/modalforms/LoginModel';
import { HomePage } from './components/pages/HomePage';
import { ShortPage } from './components/pages/ShortPage';
import { NewShort } from './components/pages/NewShort';
import ShortContext, { TagOptionType } from './components/context/ShortContext';
import { DisplayTagShort } from './components/pages/DisplayTagShort';
import { EditShort } from './components/pages/EditShort';

export function getMachineId() {
  let machineId = localStorage.getItem('MachineId');

  if (!machineId) {
    machineId = crypto.randomUUID();
    localStorage.setItem('MachineId', machineId);
  }

  return machineId;
}

function App() {
  const [destMap, setDestMap] = useState<any>(new Map());
  const [tagMap, setTagMap] = useState<any>(new Map());
  const [tagArray, setTagArray] = useState<TagOptionType[] | undefined>([]);
  const [tag, setTag] = useState<TagOptionType | undefined>(undefined);

  return (
    <>
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/short"
            element={
              <ShortContext.Provider
                value={{
                  destMap,
                  setDestMap,
                  tagMap,
                  setTagMap,
                  tagArray,
                  setTagArray,
                  tag,
                  setTag,
                }}
              >
                <ShortPage />
              </ShortContext.Provider>
            }
          />
          <Route path="/new" element={<NewShort />} />

          <Route
            path="/display"
            element={
              <ShortContext.Provider
                value={{
                  destMap,
                  setDestMap,
                  tagMap,
                  setTagMap,
                  tagArray,
                  setTagArray,
                  tag,
                  setTag,
                }}
              >
                <DisplayTagShort />
              </ShortContext.Provider>
            }
          />

          <Route
            path="/edit"
            element={
              <ShortContext.Provider
                value={{
                  destMap,
                  setDestMap,
                  tagMap,
                  setTagMap,
                  tagArray,
                  setTagArray,
                  tag,
                  setTag,
                }}
              >
                <EditShort />
              </ShortContext.Provider>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
