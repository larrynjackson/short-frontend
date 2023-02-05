import styles from '../css/Menu.module.css';
import { ChangePwdModal } from '../modalforms/ChangePwdModal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getMachineId } from '../../App';
import { logOut } from '../api/ShortenerApi';
import { AddUserModal } from '../modalforms/AddUserModal';

export function ShortMenu() {
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [showChangePwdModal, setShowChangePwdModal] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    const machineId = getMachineId();
    const formData = new FormData();
    formData.append('MachineId', `${machineId}`);
    console.log('logout');
    await logOut(formData);
    navigate('/');
  };

  return (
    <>
      <div className={styles.dropdown}>
        <button className={styles.dropbtn}>Menu</button>
        <div className={styles.dropdownContent}>
          <span>
            <a href="#" onClick={handleLogOut}>
              LogOut
            </a>
          </span>
          <span>
            <a href="#" onClick={() => setShowAddUserModal(true)}>
              Add User
            </a>
            <AddUserModal
              showAddUser={showAddUserModal}
              closeAddUser={() => setShowAddUserModal(false)}
            />
          </span>
          <span>
            <a href="#" onClick={() => setShowChangePwdModal(true)}>
              Change Password
            </a>
            <ChangePwdModal
              showChangePwd={showChangePwdModal}
              closeChangePwd={() => setShowChangePwdModal(false)}
              loggedIn={setLoggedIn}
            />
          </span>
          <span>
            <a href="/new">New Destination</a>
          </span>
        </div>
      </div>
      {!loggedIn && navigate('/')}
    </>
  );
}
