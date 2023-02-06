import { Form, Stack, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedin, list, listTag } from '../api/ShortenerApi';
import { ShortMenu } from '../menus/ShortMenu';
import { getMachineId } from '../../App';
import ShortContext, { TagOptionType } from '../context/ShortContext';
import styles from '../css/ShortCard.module.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import creativeThinking from '../../images/creativeThinking.jpg';

type DisplayURLProps = {
  label: string;
  url: string;
};

export function ShortPage() {
  const {
    setDestMap,
    setTagMap,
    setTagArray,
    setTag,
    tagArray,
    tagMap,
    destMap,
  } = useContext(ShortContext);
  const [tagname, setTagname] = useState<string>('');

  const imgSize = {
    height: 200,
    width: 900,
  };

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

    const getUserCodeDestMap = async () => {
      try {
        const destMap = await list();
        destMap.delete('Error');
        destMap.delete('NextAction');
        setDestMap(destMap);
      } catch (event) {
        if (event instanceof Error) {
          console.log('destMapError:', event.message);
        }
      }
    };

    const getUserCodeTagMap = async () => {
      try {
        const userCodeTagMap = await listTag();
        userCodeTagMap.delete('Error');
        userCodeTagMap.delete('NextAction');
        setTagMap(userCodeTagMap);
        const tagArray: TagOptionType[] = Array.from(
          userCodeTagMap,
          function (entry) {
            if (entry[1] === '') {
              entry[1] = 'NoTag';
            }
            return { value: entry[0], label: entry[1] + ' => ' + entry[0] };
          }
        );
        setTagArray(tagArray);
      } catch (event) {
        if (event instanceof Error) {
          console.log('codeTagMapError:', event.message);
        }
      }
    };

    getUserCodeDestMap();
    getUserCodeTagMap();

    checkIsLoggedIn();
  }, []);

  function tagMatch(tag: TagOptionType) {
    const tagOptionName = tagMap.get(tag.value);
    let tagMatch =
      tagOptionName === '' ||
      tagOptionName.toLowerCase().includes(tagname.toLowerCase());
    return tagMatch;
  }

  return (
    <>
      <div>
        <Row className="align-items-center mb-4">
          <img style={imgSize} src={creativeThinking} alt="Creative Thinking" />
        </Row>
        <Row className="align-items-center mb-4">
          <Col>
            <h1>L&L Shortener</h1>
          </Col>

          <Col xs="auto">
            <Stack gap={2} direction="horizontal">
              <ShortMenu />
            </Stack>
          </Col>
        </Row>
        <Form>
          <Row className="mb-4">
            <Col>
              <Form.Group controlId="tagname">
                <Form.Label>Tag Filter</Form.Label>
                <Form.Control
                  type="text"
                  value={tagname}
                  onChange={(e) => setTagname(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col></Col>
          </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
          {tagArray
            ?.filter((tag) => tagMatch(tag))
            .map((tag) => (
              <Col key={tag?.value}>
                <NoteCard
                  tagname={tagMap.get(tag?.value)}
                  url={destMap.get(tag?.value)}
                  tag={tag}
                  setTag={setTag}
                />
              </Col>
            ))}
        </Row>
      </div>
    </>
  );
}

type NoteCardProps = {
  tagname: string;
  url: string;
  tag: TagOptionType;

  setTag: React.Dispatch<React.SetStateAction<TagOptionType | undefined>>;
};

function NoteCard({ tagname, url, tag, setTag }: NoteCardProps) {
  return (
    <>
      <Card
        key={tag?.value}
        as={Link}
        onClick={() => setTag(tag)}
        to={'/display'}
        className={`h-100 text-reset text-decoration-none ${styles.card}`}
      >
        <Card.Body>
          <Stack
            gap={2}
            className="align-items-center justify-content-center h-100"
          >
            <span className="fs-5">{tagname}</span>

            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              <DisplayURL label={tag?.label} url={url}></DisplayURL>
            </Stack>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}

function DisplayURL({ label, url }: DisplayURLProps) {
  const renderBigDiv = (props: any) => (
    <div {...props}>
      <span className={styles.destination}>{url}</span>
    </div>
  );

  return (
    <OverlayTrigger
      delay={{ show: 100, hide: 200 }}
      trigger={['hover', 'focus']}
      placement="bottom"
      overlay={renderBigDiv}
    >
      <div>{label}</div>
    </OverlayTrigger>
  );
}
