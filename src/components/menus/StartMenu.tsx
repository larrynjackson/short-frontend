import styles from '../css/Menu.module.css';
import { LoginModal } from '../modalforms/LoginModel';
import { AddUserModal } from '../modalforms/AddUserModal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function StartMenu() {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();

  return (
    <>
      <div className={styles.dropdown}>
        <button className={styles.dropbtn}>Menu</button>
        <div className={styles.dropdownContent}>
          <span>
            <a href="#" onClick={() => setShowLoginModal(true)}>
              Login
            </a>
            <LoginModal
              showLogin={showLoginModal}
              closeLogin={() => setShowLoginModal(false)}
              loggedIn={setLoggedIn}
            />
          </span>

          <span>
            <a href="#" onClick={() => setShowAddUserModal(true)}>
              Register
            </a>
            <AddUserModal
              showAddUser={showAddUserModal}
              closeAddUser={() => setShowAddUserModal(false)}
            />
          </span>
        </div>
      </div>

      {loggedIn && navigate('/short')}
    </>
  );
}
