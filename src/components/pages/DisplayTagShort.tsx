import { Form, Stack, Row, Button, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  isLoggedin,
  deleteShortCode,
  list,
  listTag,
} from '../api/ShortenerApi';

import { getMachineId } from '../../App';
import ShortContext, { TagOptionType } from '../context/ShortContext';
import styles from '../css/ShortMenu.module.css';

export function DisplayTagShort() {
  const { setDestMap, setTagMap, setTagArray, tagMap, destMap, tag } =
    useContext(ShortContext);

  const [apiRtnMsg, setApiRgnMsg] = useState<string>('');
  const [isErrorMsg, setIsErrorMsg] = useState<boolean>(true);
  const [destination, setDestination] = useState<string>('');
  const [tagname, setTagname] = useState<string>('');
  const [testUrl, setTestUrl] = useState<string>('');

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
      setTestUrl(`http://localhost:8080/${tag?.value}`);
      setTagname(tagMap.get(tag?.value));
      setDestination(destMap.get(tag?.value));
    }
  }, []);

  const handleDelete = async (event: any) => {
    try {
      const dataMap = await deleteShortCode(tag!.value);
      if (dataMap.get('Error') === '') {
        setIsErrorMsg(true);
        setApiRgnMsg('');
        try {
          const destMap = await list();
          setApiRgnMsg(destMap.get('Error'));
          destMap.delete('Error');
          destMap.delete('NextAction');
          setDestMap(destMap);
        } catch (event) {
          if (event instanceof Error) {
            console.log('destMapError:', event.message);
            setApiRgnMsg(event.message);
          }
        }

        try {
          const userCodeTagMap = await listTag();
          setApiRgnMsg(userCodeTagMap.get('Error'));
          userCodeTagMap.delete('Error');
          userCodeTagMap.delete('NextAction');
          setTagMap(userCodeTagMap);
          const tagArray: TagOptionType[] = Array.from(
            userCodeTagMap,
            function (entry) {
              if (entry[1] === '') {
                entry[1] = 'NoTag';
              }
              return {
                value: entry[0],
                label: entry[1] + ' => ' + entry[0],
              };
            }
          );
          setTagArray(tagArray);
        } catch (event) {
          if (event instanceof Error) {
            console.log('codeTagMapError:', event.message);
            setApiRgnMsg(event.message);
          }
        }
        if (apiRtnMsg === '') {
          setIsErrorMsg(false);
          setApiRgnMsg('Destination Deleted');
        }
      } else {
        setApiRgnMsg(dataMap.get('Error'));
      }
    } catch (event) {
      if (event instanceof Error) {
        setApiRgnMsg(event.message);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Looking at 'Your Short'</h1>
        </Col>

        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button onClick={handleDelete} variant="outline-danger">
              Delete
            </Button>
            <Link to="/short">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <Row className="mb-3">
        {isErrorMsg && <div className={styles.error}>{apiRtnMsg}</div>}
        {!isErrorMsg && <div className={styles.success}>{apiRtnMsg}</div>}
      </Row>
      <Row>
        <Col></Col>
        <Col xs="auto">
          <Button
            variant="outline-success"
            onClick={(e) => window.open(testUrl)}
          >
            Test shortcode =&gt; {testUrl}
          </Button>
        </Col>
      </Row>
      <Stack gap={4}>
        <Row className="mb-3">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tag (optional)</Form.Label>
            <Form.Control
              name="tagname"
              value={tagname}
              type="text"
              plaintext
              readOnly
            />
          </Form.Group>
        </Row>
        <Form.Group controlId="markdown">
          <Form.Label>
            Destination URL &nbsp; &nbsp; &nbsp; &nbsp;Shortcode: {tag?.value}
          </Form.Label>
          <Form.Control
            name="destination"
            value={destination}
            as="textarea"
            plaintext
            rows={10}
            readOnly
          />
        </Form.Group>
      </Stack>
    </>
  );
}
