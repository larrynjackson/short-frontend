import { Form, Stack, Row, Col, Button, Modal } from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import { changePassword, isLoggedin } from '../api/ShortenerApi';
import styles from '../css/ShortMenu.module.css';

type ChangePwdModalProps = {
  showChangePwd: boolean;
  closeChangePwd: () => void;
  loggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChangePwdModal({
  showChangePwd,
  closeChangePwd,
  loggedIn,
}: ChangePwdModalProps) {
  const [userData, setUserData] = useState<UserData>(new UserData());
  const [apiRtnMsg, setApiRgnMsg] = useState<string>('');
  const [isErrorMsg, setIsErrorMsg] = useState<boolean>(true);

  useEffect(() => {
    setApiRgnMsg(
      'Warning: After you change your password you must login again.'
    );
  }, []);

  const handlePasswordChange = (event: any) => {
    const { type, name, value } = event.target;

    let updatedValue = value;
    if (type === 'number') {
      updatedValue = Number(updatedValue);
    }
    const change = {
      [name]: updatedValue,
    };
    let addNewUser: UserData = new UserData();
    setUserData((nu) => {
      addNewUser = new UserData({ ...nu, ...change });
      return addNewUser;
    });
  };

  const handlePasswordSubmit = async (event: any) => {
    event.preventDefault();
    if (
      userData.userId.length === 0 ||
      userData.pwdOne.length === 0 ||
      userData.pwdTwo.length === 0 ||
      userData.pwdThree.length === 0 ||
      userData.pwdTwo !== userData.pwdThree
    ) {
      setIsErrorMsg(true);
      setApiRgnMsg('invalid input data!');
      return;
    }
    try {
      const machineId = getMachineId();

      const formData = new FormData();
      formData.append('User', userData.userId);
      formData.append('Password', userData.pwdOne);
      formData.append('PassCode', userData.pwdTwo);
      formData.append('MachineId', `${machineId}`);
      const dataMap = await changePassword(formData);
      setIsErrorMsg(true);
      if (dataMap.get('Error') === '') {
        setUserData(new UserData());
        loggedIn(false);
      } else {
        setApiRgnMsg(dataMap.get('Error'));
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
      <Modal
        show={showChangePwd}
        onHide={closeChangePwd}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
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
                      onChange={handlePasswordChange}
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
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>re-enter password</Form.Label>
                    <Form.Control
                      name="pwdTwo"
                      placeholder="new password"
                      type="password"
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>re-enter password</Form.Label>
                    <Form.Control
                      name="pwdThree"
                      placeholder="re-enter new password"
                      type="password"
                      onChange={handlePasswordChange}
                    />
                  </Form.Group>
                </Row>
              </Col>
            </Stack>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeChangePwd}>
                Close
              </Button>
              <Button variant="primary" onClick={handlePasswordSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
