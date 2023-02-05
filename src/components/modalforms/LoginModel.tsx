import { Form, Stack, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import styles from '../css/ShortMenu.module.css';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import { login, resetPassword } from '../api/ShortenerApi';

type LoginModalProps = {
  showLogin: boolean;
  closeLogin: () => void;
  loggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export function LoginModal({
  showLogin,
  closeLogin,
  loggedIn,
}: LoginModalProps) {
  const [userData, setUserData] = useState<UserData>(new UserData());
  const [apiRtnMsg, setApiRgnMsg] = useState<string>('');
  const [isErrorMsg, setIsErrorMsg] = useState<boolean>(true);

  useEffect(() => {
    setApiRgnMsg('');
  }, [showLogin]);

  const handleLoginChange = (event: any) => {
    const { type, name, value } = event.target;
    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };
    let loginUser: UserData = new UserData();
    setUserData((nu) => {
      loginUser = new UserData({ ...nu, ...change });
      return loginUser;
    });
  };

  const handleLoginSubmit = async (event: any) => {
    event.preventDefault();
    if (userData.userId.length === 0 || userData.pwdOne.length === 0) {
      setIsErrorMsg(true);
      setApiRgnMsg('invalid input data!');
      return;
    }
    try {
      const machineId = getMachineId();

      const formData = new FormData();
      formData.append('User', userData.userId);
      formData.append('Password', userData.pwdOne);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await login(formData);
      setIsErrorMsg(true);
      setApiRgnMsg(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'SHORTENER') {
        loggedIn(true);
        setApiRgnMsg('');
      }
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  const handleResetPassword = async (event: any) => {
    event.preventDefault();
    if (userData.userId.length === 0) {
      setIsErrorMsg(true);
      setApiRgnMsg('You must enter a userId (email address)');
      return;
    }
    try {
      setIsErrorMsg(true);
      const dataMap = await resetPassword(userData.userId);
      if (dataMap.get('NextAction') === 'CHANGE_PASSWORD') {
        setIsErrorMsg(false);
      }
      setApiRgnMsg(dataMap.get('Error'));
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  return (
    <>
      <Modal
        show={showLogin}
        onHide={closeLogin}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Stack gap={4}>
              <Col>
                <Row className="mb-3">
                  {isErrorMsg && (
                    <div className={styles.error}>{apiRtnMsg}</div>
                  )}
                  {!isErrorMsg && (
                    <div className={styles.success}>{apiRtnMsg}</div>
                  )}
                </Row>

                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>user Id - email address</Form.Label>
                    <Form.Control
                      name="userId"
                      placeholder="someone@email.com"
                      type="text"
                      onChange={handleLoginChange}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>password</Form.Label>

                    <Form.Control
                      name="pwdOne"
                      placeholder="password"
                      type="password"
                      onChange={handleLoginChange}
                    />
                  </Form.Group>
                </Row>
              </Col>
            </Stack>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleResetPassword}>
                Reset Password
              </Button>
              <Button variant="secondary" onClick={closeLogin}>
                Close
              </Button>
              <Button variant="primary" onClick={handleLoginSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
