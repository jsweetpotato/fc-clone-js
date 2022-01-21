function getToken() {
  return localStorage.getItem('token');
}

async function login(event) {
  event.preventDefault(); //submit은 원래 정의된 흐름대로 진행하려는 특성이있음 -> submit에 관련된 로직이 내가 작성한 것 이외에 진행되지 않도록 preventDefault로 막음
  event.stopPropagation(); //submit 이벤트가 상위로 전달되지 않도록 막음

  const emailElement = document.querySelector('#email');
  const passwordElement = document.querySelector('#password');

  const email = emailElement.value; // string
  const password = passwordElement.value; // string

  try{
    const res = await axios.post('https://api.marktube.tv/v1/me', {
      email,
      password
    });

    const {token} = res.data // const token = res.data.token
    if (token === undefined) {
      return;
    }
    localStorage.setItem('token', token);
    location.assign('/');
  } catch (error) {
    const data = error.response.data;
    if (data) {
      const state = data.error;
      if (state === 'USER_NOT_EXIST') {
        alert('아이디가 존재하지 않습니다.');
      } else if (state === 'PASSWORD_NOT_MATCH') {
        alert('패스워드가 일치하지 않습니다.');
      }
    }
  }
}

function bindLoginButton() {
  const form = document.querySelector('#form-login');
  form.addEventListener('submit', login);
}

function main() {
  //버튼에 이벤트 연결
  bindLoginButton();

  //토큰 체크
  const token = getToken();
  if (token !== null) {
    location.assign('/');
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);