import { Form, Stack, Row, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { getMachineId } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedin, editDest } from '../api/ShortenerApi';
import ShortContext, { TagOptionType } from '../context/ShortContext';
import styles from '../css/ShortMenu.module.css';

export function EditShort() {
  const { setTagArray, tagMap, destMap, tag } = useContext(ShortContext);

  const [shortCode, setShortCode] = useState<string>('');

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

    if (tag) {
      setShortCode(tag!.value);
      setTagname(tagMap.get(tag?.value));
      setDestination(destMap.get(tag?.value));
    }
  }, []);

  const handleDestinationChange = (event: any) => {
    const { type, name, value } = event.target;
    if (name === 'destination') {
      setDestination(value);
    }
    if (name === 'tagname') {
      setTagname(value);
    }
  };

  const handleDestinationSubmit = async (event: any) => {
    event.preventDefault();
    if (
      destination.length === 0 ||
      tagname.length === 0 ||
      shortCode.length === 0
    ) {
      setIsErrorMsg(true);
      setApiRgnMsg('invalid input data!');
      return;
    }
    try {
      const machineId = getMachineId();

      const formData = new FormData();
      formData.append('Destination', destination);
      formData.append('Tag', tagname);
      formData.append('ShortCode', shortCode);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await editDest(formData);
      setApiRgnMsg(dataMap.get('Error'));
      setIsErrorMsg(true);
      if (dataMap.get('Error') === '') {
        destMap.set(shortCode, destination);
        tagMap.set(shortCode, tagname);

        const tagArray: TagOptionType[] = Array.from(
          tagMap,
          function (entry: any) {
            if (entry[1] === '') {
              entry[1] = 'NoTag';
            }
            return { value: entry[0], label: entry[1] + ' => ' + entry[0] };
          }
        );
        setTagArray(tagArray);
        setIsErrorMsg(false);
        setApiRgnMsg('Update Success');
      }
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  return (
    <>
      <Form>
        <Stack gap={4}>
          <Row>
            <h1>Change Your Short Please!</h1>
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
