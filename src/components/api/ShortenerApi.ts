import { baseUrl } from '../../env';

const handleReturnData = (data: [[string, string]]) => {
  const map = new Map();

  for (let i = 0, entries = Object.entries(data); i < entries.length; i++) {
    map.set(entries[i][0], entries[i][1]);
  }
  return map;
};

export const logOut = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/logout`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const isLoggedin = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/authtest`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const resetPassword = async (userId: string) => {
  let map = new Map();
  const url = `${baseUrl}/resetpassword/${userId}`;
  await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const changePassword = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/changepassword`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const login = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/auth`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const addUser = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/add/user`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const editDest = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);
  const url = `${baseUrl}/edit`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const addDest = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);

  const url = `${baseUrl}/add`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const setCode = async (formData: FormData) => {
  let data: any = {};
  let map = new Map();
  formData.forEach((value, key) => (data[key] = value));
  var json = JSON.stringify(data);
  const url = `${baseUrl}/code`;
  await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const list = async () => {
  let map = new Map();
  const url = `${baseUrl}/get/usercodedest`;
  await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const listTag = async () => {
  let map = new Map();
  const url = `${baseUrl}/get/usercodetag`;
  await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};

export const deleteShortCode = async (shortCode: string) => {
  let map = new Map();
  const url = `${baseUrl}/delete/${shortCode}`;
  await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      map = handleReturnData(data);
    });
  return map;
};
