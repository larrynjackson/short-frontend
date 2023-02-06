import { Stack, Row, Col } from 'react-bootstrap';

import underConstruction from '../../images/underConstruction.jpg';

import { StartMenu } from '../menus/StartMenu';
import styles from '../css/ShortCard.module.css';

export function HomePage() {
  const imgSize = {
    height: 500,
    width: 900,
  };

  return (
    <>
      <div>
        <Row className="align-items-center mb-4">
          <div>
            <span></span>
          </div>
        </Row>
        <Row className="align-items-center mb-4">
          <Col>
            <h1>Welcome to the L&L Shortener</h1>
          </Col>
          <Col xs="auto">
            <Stack gap={2} direction="horizontal">
              <StartMenu />
            </Stack>
          </Col>
          <Row>
            <Col>
              <img
                style={imgSize}
                src={underConstruction}
                alt="Under Construction"
              />
            </Col>
          </Row>
        </Row>
      </div>
    </>
  );
}
