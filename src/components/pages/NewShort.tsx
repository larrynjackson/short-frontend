import { Form, Stack, Row, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getMachineId } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedin, addDest } from '../api/ShortenerApi';
import styles from '../css/ShortMenu.module.css';

export function NewShort() {
  const [apiRtnMsg, setApiRgnMsg] = useState<string>('');
  const [isErrorMsg, setIsErrorMsg] = useState<boolean>(true);
  const [destination, setDestination] = useState<string>('');
  const [tagname, setTagname] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const machineId = getMachineId();
        const formData = new FormData();
        formData.append('MachineId', `${machineId}`);
        const dataMap = await isLoggedin(formData);
        if (dataMap.get('NextAction') !== 'SHORTENER') {
          navigate('/');
        }
      } catch (event) {
        if (event instanceof Error) {
          console.log(event.message);
        }
      }
    };
    checkIsLoggedIn();
  }, []);

  const handleDestinationChange = (event: any) => {
    const { type, name, value } = event.target;
    if (name === 'destination') {
      setDestination(value);
    }
    if (name === 'tagname') {
      setTagname(value);
    }
    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
  };

  const handleDestinationSubmit = async (event: any) => {
    event.preventDefault();
    if (destination.length === 0) {
      setIsErrorMsg(true);
      setApiRgnMsg('invalid input data!');
      return;
    }
    try {
      const machineId = getMachineId();

      if (tagname === '') {
        setTagname('NoTag');
      }
      const formData = new FormData();
      formData.append('Destination', destination);
      formData.append('Tag', tagname);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await addDest(formData);
      setApiRgnMsg(dataMap.get('Error'));

      if (dataMap.get('NextAction') === 'SHORTENER') {
        setIsErrorMsg(false);
        setApiRgnMsg('New Destination Added.');
        setDestination('');
        setTagname('');
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiRgnMsg(event.message);
      }
    }
  };

  return (
    <>
      <Form>
        <Stack gap={4}>
          <Row>
            <h1>Let's make a new Short!</h1>
          </Row>
          <Row className="mb-3">
            {isErrorMsg && <div className={styles.error}>{apiRtnMsg}</div>}
            {!isErrorMsg && <div className={styles.success}>{apiRtnMsg}</div>}
          </Row>
          <Row className="mb-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Tag (optional)</Form.Label>
              <Form.Control
                name="tagname"
                value={tagname}
                type="text"
                onChange={handleDestinationChange}
              />
            </Form.Group>
          </Row>
          <Form.Group controlId="markdown">
            <Form.Label>Destination URL</Form.Label>
            <Form.Control
              name="destination"
              value={destination}
              as="textarea"
              rows={10}
              required
              onChange={handleDestinationChange}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button
              type="button"
              variant="outline-primary"
              onClick={handleDestinationSubmit}
            >
              Save
            </Button>
            <Link to="/short">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
