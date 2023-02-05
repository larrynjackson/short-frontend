import { Form, Stack, Row, Col, Button, Modal } from 'react-bootstrap';

import { useState, useEffect } from 'react';
import { getMachineId } from '../../App';
import { UserData } from '../models/UserData';
import { addUser, setCode } from '../api/ShortenerApi';
import styles from '../css/ShortMenu.module.css';

type AddUserModalProps = {
  showAddUser: boolean;
  closeAddUser: () => void;
};

export function AddUserModal({ showAddUser, closeAddUser }: AddUserModalProps) {
  const [userData, setUserData] = useState<UserData>(new UserData());
  const [apiRtnMsg, setApiRgnMsg] = useState<string>('');
  const [isRegisterSubmitted, setIsRegisterSubmitted] = useState(false);
  const [isCodeSubmitted, setIsCodeSubmitted] = useState(false);
  const [passCode, setPassCode] = useState<string>('');
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [isErrorMsg, setIsErrorMsg] = useState<boolean>(true);

  useEffect(() => {
    setApiRgnMsg('');
  }, [showAddUser]);

  const handleRegisterChange = (event: any) => {
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

  const handleRegisterSubmit = async (event: any) => {
    event.preventDefault();
    if (
      userData.userId.length === 0 ||
      userData.pwdOne.length === 0 ||
      userData.pwdTwo.length === 0 ||
      userData.pwdOne !== userData.pwdTwo
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
      formData.append('MachineId', `${machineId}`);
      const dataMap = await addUser(formData);
      setApiRgnMsg(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'SEND_CODE') {
        setIsRegisterSubmitted(true);
        setIsErrorMsg(false);
        setApiRgnMsg(
          'A code has been emailed. Submit the code to complete the process.'
        );
        setToggleModal((prev) => !prev);
      }
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  const handleAddUser = () => {
    setUserData(new UserData());
    setApiRgnMsg('');
    setIsCodeSubmitted(false);
    setToggleModal((prev) => !prev);
    setIsRegisterSubmitted(false);
    setPassCode('');
  };

  const handleCancel = () => {
    setUserData(new UserData());
    setApiRgnMsg('');
    setToggleModal((prev) => !prev);
    setIsRegisterSubmitted(false);
    closeAddUser();
  };

  const handleCodeSubmit = async (event: any) => {
    event.preventDefault();
    if (passCode.length === 0) {
      setIsErrorMsg(true);
      setApiRgnMsg('Enter a code, then submit.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('PassCode', passCode);
      const dataMap = await setCode(formData);
      setApiRgnMsg(dataMap.get('Error'));
      setPassCode('');
      setIsErrorMsg(true);
      if (dataMap.get('NextAction') === 'LOGIN') {
        setUserData(new UserData());

        if (isCodeSubmitted) {
          setApiRgnMsg('Quit or Add Another');
        } else {
          setIsErrorMsg(false);
          setApiRgnMsg('User has been added. Quit or Add Another.');
          setIsCodeSubmitted(true);
        }
      }
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  const handleReSendCode = async (event: any) => {
    event.preventDefault();
    if (
      userData.userId.length === 0 ||
      userData.pwdOne.length === 0 ||
      userData.pwdTwo.length === 0 ||
      userData.pwdOne !== userData.pwdTwo
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
      formData.append('MachineId', `${machineId}`);
      const dataMap = await addUser(formData);
      setApiRgnMsg(dataMap.get('Error'));
      if (dataMap.get('NextAction') === 'SEND_CODE') {
        setIsRegisterSubmitted(true);
        setIsErrorMsg(false);
        setApiRgnMsg(
          'A code has been emailed. Submit the code to complete the process.'
        );
      }
    } catch (event) {
      if (event instanceof Error) {
        setIsErrorMsg(true);
        setApiRgnMsg(event.message);
      }
    }
  };

  const handleCodeChange = (event: any) => {
    const { value } = event.target;
    setPassCode(value);
  };

  const renderAddUser = (
    <>
      <Modal
        show={showAddUser && !toggleModal}
        onHide={closeAddUser}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
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
                      onChange={handleRegisterChange}
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
                      onChange={handleRegisterChange}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>re-enter password</Form.Label>
                    <Form.Control
                      name="pwdTwo"
                      placeholder="re-enter password"
                      type="password"
                      onChange={handleRegisterChange}
                    />
                  </Form.Group>
                </Row>
              </Col>
            </Stack>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAddUser}>
                Close
              </Button>
              <Button variant="primary" onClick={handleRegisterSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );

  const renderSendCode = (
    <>
      <Modal
        show={showAddUser && toggleModal}
        onHide={closeAddUser}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Code</Modal.Title>
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
                    <Form.Label>code</Form.Label>
                    <Form.Control
                      value={passCode}
                      name="code"
                      placeholder="enter code"
                      type="text"
                      onChange={handleCodeChange}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </Row>
              </Col>
            </Stack>
            <Modal.Footer>
              <Stack gap={1} direction="horizontal">
                <Button variant="secondary" onClick={handleAddUser}>
                  Add User
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  Quit
                </Button>
                <Button variant="secondary" onClick={handleReSendCode}>
                  Request Code
                </Button>
                <Button variant="secondary" onClick={closeAddUser}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleCodeSubmit}>
                  Submit
                </Button>
              </Stack>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );

  return (
    <>
      {!isRegisterSubmitted && renderAddUser}
      {isRegisterSubmitted && renderSendCode}
    </>
  );
}
